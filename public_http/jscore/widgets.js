/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * main file for widgets library.
**********************

Copyright 2016 Alejandro Linarez Rangel

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**********************
************************************************/

(function()
{
	var natsec = function(window, document)
	{
		if(typeof window.NaturalObject === "undefined")
		{
			throw new Error("Error at CNatural.JS.Widgets: NaturalObject is undefined");
		}

		/**
		 * @name NaturalWidgets.Extend
		 * @function
		 * @global
		 *
		 * Extends a plain class.
		 *
		 * In the process, the child class will inherit the base class.
		 *
		 * //
		 */
		var Extend = function(base, child)
		{
			"use strict";
			if((typeof base !== "object") || (typeof child !== "object"))
			{
				throw new TypeError("Error at Extend(base, child): the base or the child arent objects");
			}
			child._super = {};
			for(let i in base)
			{
				if(base.hasOwnProperty(i) && (typeof child[i] === "undefined"))
				{
					if(typeof base[i] === "object")
					{
						child[i] = Extend(base[i], {});
					}
					else if(typeof base[i] == "function")
					{
						child[i] = base[i]; // Later we change this.
					}
					else
					{
						child[i] = base[i];
					}
				}
				if(base.hasOwnProperty(i) && (typeof child[i] !== "undefined") && (typeof base[i] == "function"))
				{
					child._super[i] = base[i]; // Later we change this.
				}
			}
			return child;
		};
		var Create = function(klass, args)
		{
			"use strict";
			var obj = Object.create(klass);
			obj._constructor.call(obj, args);
			return obj;
		};
		var Class = function(child) // Semantic only
		{
			return child;
		};

		window.NaturalWidgets = window.NaturalWidgets || {};

		window.NaturalWidgets.Class = Class;
		window.NaturalWidgets.Create = Create;
		window.NaturalWidgets.Extend = Extend;

		window.NaturalWidgets.Widget = Class({
			type: "Widget",
			path: "CNatural.JS.Widgets.Widget",
			_constructor: function(args)
			{
				this._parent = args.parent;
				this._element = null;
				this._packed = false;
			},
			pack: function(side)
			{
				if(this._packed)
					return;
				this._packed = true;
				this._parent.appendChild(this._element);
			},
			unpack: function()
			{
				if(!this._packed)
					return;
				this._packed = false;
				this._element.remove();
			},
			reparent: function(np)
			{
				if(this._parent === np)
					return;
				this.unpack();
				this._parent = np;
			},
			getParent: function()
			{
				return this._parent;
			},
			getElement: function()
			{
				return this._element;
			}
		});
		window.NaturalWidgets.PlainText = Extend(window.NaturalWidgets.Widget, Class({
			type: "PlainText",
			path: "CNatural.JS.Widgets.PlainText",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createTextNode(args.text)
				);
			}
		}));
		window.NaturalWidgets.Text = Extend(window.NaturalWidgets.Widget, Class({
			type: "Text",
			path: "CNatural.JS.Widgets.Text",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("p")
				);
				this._element
					.addClass("gui-widget")
					.addClass("gui-widget-text")
					.data("widget", "text");

				if(typeof args.text !== "undefined")
				{
					this._element.appendChild(window.$natural.wrap(
						document.createTextNode(args.text)
					));
				}
			},
			changeText: function(new_text)
			{
				var node = this._element.original;

				while(node.firstChild)
					node.removeChild(node.firstChild);

				node.appendChild(document.createTextNode(new_text));
			}
		}));
		window.NaturalWidgets.Container = Extend(window.NaturalWidgets.Widget, Class({
			type: "Container",
			path: "CNatural.JS.Widgets.Container",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("div")
				);
				this._element
					.addClass("container")
					.addClass("gui-widget")
					.addClass("gui-widget-container")
					.data("widget", "container");
			}
		}));
		window.NaturalWidgets.RowContainer = Extend(window.NaturalWidgets.Widget, Class({
			type: "RowContainer",
			path: "CNatural.JS.Widgets.Container.RowContainer",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("div")
				);
				this._element
					.addClass("row")
					.addClass("wrap")
					.addClass("gui-widget")
					.addClass("gui-widget-container")
					.addClass("gui-widget-row-container")
					.data("widget", "row-container");
			}
		}));
		window.NaturalWidgets.MainContainer = Extend(window.NaturalWidgets.Widget, Class({
			type: "MainContainer",
			path: "CNatural.JS.Widgets.Container.MainContainer",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("div")
				);
				this._element
					.addClass("container")
					.addClass("overflow-auto")
					.addClass("color-transparent")
					.addClass("width-block")
					.addClass("height-block")
					.addClass("gui-widget")
					.addClass("gui-widget-container")
					.addClass("gui-widget-main-container")
					.data("widget", "main-container");

				if((typeof args.noPadding === "boolean") && (args.noPadding))
					this._element.addClass("no-padding");
			}
		}));
		window.NaturalWidgets.Button = Extend(window.NaturalWidgets.Widget, Class({
			type: "Button",
			path: "CNatural.JS.Widgets.Button",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("button")
				);
				this._element.attr("type", "button");
				this._element
					.addClass("button")
					.addClass("gui-widget")
					.addClass("gui-widget-button")
					.data("widget", "button");

				if(typeof args.text !== "undefined")
				{
					this._element.appendChild(window.$natural.wrap(
						document.createTextNode(args.text)
					));
				}

				if(typeof args.type !== "undefined")
				{
					if(args.type == "flat-button")
					{
						this.element
							.removeClass("button")
							.addClass("flat-button");
					}
				}
			}
		}));
		window.NaturalWidgets.Input = Extend(window.NaturalWidgets.Widget, Class({
			type: "Input",
			path: "CNatural.JS.Widgets.Input",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("input")
				);
				this._element.attr("type", args.type);
				this._element
					.addClass("input")
					.addClass("gui-widget")
					.addClass("gui-widget-input")
					.data("widget", "input");

				if(typeof args.value !== "undefined")
				{
					this._element.attr("value", args.value);
				}
				if(typeof args.placeholder !== "undefined")
				{
					this._element.attr("placeholder", args.placeholder);
				}
				if(typeof args.name !== "undefined")
				{
					this._element.attr("name", args.name);
				}
			}
		}));
		window.NaturalWidgets.Header = Extend(window.NaturalWidgets.Widget, Class({
			type: "Header",
			path: "CNatural.JS.Widgets.Header",
			levelTable: {
				"page.title": "jumbo-4",
				"page.subtitle": "jumbo-3",
				"section.title": "jumbo-2",
				"section.subtitle": "jumbo",
				"content.title": "ultra-big",
				"content.subtitle": "big"
			},
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("h" + args.level)
				);
				this._element
					.addClass("text-" + this.levelTable[args.size])
					.addClass("gui-widget")
					.addClass("gui-widget-header")
					.data("widget", "title-header");

				if(typeof args.text !== "undefined")
				{
					this._element.appendChild(window.$natural.wrap(
						document.createTextNode(args.text)
					));
				}
			}
		}));
		window.NaturalWidgets.Image = Extend(window.NaturalWidgets.Widget, Class({
			type: "Image",
			path: "CNatural.JS.Widgets.Image",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("img")
				);
				this._element
					.addClass("gui-widget")
					.addClass("gui-widget-image")
					.data("widget", "image");
				this._element.original.src = args.src;
				this._element.original.width = args.width;
				this._element.original.height = args.height;
				this._element.original.alt = args.alt;
			}
		}));
		window.NaturalWidgets.ContainerWithHeader = Extend(window.NaturalWidgets.Widget, Class({
			type: "ContainerWithHeader",
			path: "CNatural.JS.Widgets.ContainerWithHeader",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("div")
				);
				this._element
					.addClass("container")
					.addClass("padding-16")
					.addClass("no-margin")
					.addClass("gui-widget")
					.addClass("gui-widget-container")
					.addClass("gui-widget-container-with-header")
					.data("widget", "container-with-header");
				this._innerHeader = window.$natural.wrap(
					document.createElement("div")
				).addClass("container")
					.addClass("padding-8")
					.addClass("no-margin")
					.addClass("no-border")
					.addClass(args.color);
				this._innerBody = window.$natural.wrap(
					document.createElement("div")
				).addClass("container")
					.addClass("padding-8")
					.addClass("no-margin")
					.addClass("border")
					.addClass("border-" + args.color);
				this._innerTitle = window.NaturalWidgets.Create(
					window.NaturalWidgets.Header,
					{
						parent: this._innerHeader,
						level: args.level,
						size: args.size,
						text: args.title
					}
				);
				this._innerTitle.pack("BEGIN");
				this._element.appendChild(this._innerHeader);
				this._element.appendChild(this._innerBody);
			},
			getHeader: function()
			{
				return this._innerHeader;
			},
			getBody: function()
			{
				return this._innerBody;
			}
		}));
		window.NaturalWidgets.Window = Extend(window.NaturalWidgets.Widget, Class({
			type: "Window",
			path: "CNatural.JS.Widgets.Window",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("div")
				);
				this._element
					.addClass("container")
					.addClass("no-padding")
					.addClass("gui-widget")
					.addClass("gui-widget-window")
					.style({
						position: "absolute"
					})
					.data("widget", "window");
			},
			getBody: function()
			{
				return this._element;
			}
		}));
		window.NaturalWidgets.Dialog = Extend(window.NaturalWidgets.Widget, Class({
			type: "Dialog",
			path: "CNatural.JS.Widgets.Window.Dialog",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("div")
				);
				this._element
					.addClass("container")
					.addClass("no-padding")
					.addClass("gui-widget")
					.addClass("gui-widget-window")
					.addClass("gui-widget-window-dialog")
					.style({
						position: "absolute"
					})
					.data("widget", "dialog");
			},
			getBody: function()
			{
				return this._element;
			}
		}));
		window.NaturalWidgets.AcceptDenyDialog = Extend(window.NaturalWidgets.Widget, Class({
			type: "AcceptDenyDialog",
			path: "CNatural.JS.Widgets.Window.Dialog.AcceptDenyDialog",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);

				this.onready = function(event, choice) {};

				this._element = window.$natural.wrap(
					document.createElement("div")
				).addClass("modal")
					.addClass("gui-widget")
					.addClass("gui-widget-window")
					.addClass("gui-widget-window-dialog")
					.addClass("gui-widget-window-accept-deny-dialog")
					.addClass("gui-modal")
					.addClass("gui-hidden")
					.data("widget", "accept-deny-dialog");
				this._innerModal = window.$natural.wrap(
					document.createElement("div")
				).addClass("modal-content")
					.addClass("box")
					.addClass("color-gui-body")
					.addClass("no-padding")
					.addClass("no-margin")
					.addClass("no-border");
				this._innerHeader = window.$natural.wrap(
					document.createElement("div")
				).addClass("container")
					.addClass("color-gui-header")
					.addClass("padding-8")
					.addClass("no-margin")
					.addClass("no-border");
				this._innerBody = window.$natural.wrap(
					document.createElement("div")
				).addClass("container")
					.addClass("color-transparent")
					.addClass("padding-8")
					.addClass("no-margin")
					.addClass("border-bottom")
					.addClass("bs-1")
					.addClass("border-color-dark-grey");
				this._innerBottom = window.$natural.wrap(
					document.createElement("div")
				).addClass("row")
					.addClass("wrap")
					.addClass("right")
					.addClass("color-transparent")
					.addClass("no-padding")
					.addClass("no-margin")
					.addClass("no-border");

				this._element
					.appendChild(this._innerModal)
					.echo(this._innerModal)
					.appendChild(this._innerHeader)
					.appendChild(this._innerBody)
					.appendChild(this._innerBottom);

				this._innerTitle = window.NaturalWidgets.Create(
					window.NaturalWidgets.Header,
					{
						parent: this._innerHeader,
						level: 6,
						size: "content.title",
						text: args.title
					}
				);
				this._innerTitle.getElement()
					.addClass("text-center")
					.addClass("color-transparent")
					.addClass("no-padding")
					.addClass("no-margin")
					.addClass("no-border")
					.addClass("width-block");

				this._acceptButton = window.NaturalWidgets.Create(
					window.NaturalWidgets.Button,
					{
						parent: this._innerBottom,
						text: args.acceptText
					}
				);
				this._acceptButton.getElement()
					.addClass("fx-1")
					.addClass("od-1")
					.addClass("padding-8")
					.addClass("margin-16")
					.addClass("color-gui-button")
					.on("click", (ev) =>
					{
						this._element.addClass("gui-hidden");
						this._lastChoice = "accept";
						this.onready(ev, this._lastChoice);
					});

				this._denyButton = window.NaturalWidgets.Create(
					window.NaturalWidgets.Button,
					{
						parent: this._innerBottom,
						text: args.denyText
					}
				);
				this._denyButton.getElement()
					.addClass("fx-1")
					.addClass("od-2")
					.addClass("padding-8")
					.addClass("margin-16")
					.addClass("color-gui-button")
					.on("click", (ev) =>
					{
						this._element.addClass("gui-hidden");
						this._lastChoice = "deny";
						this.onready(ev, this._lastChoice);
					});

				this._acceptButton.pack("APPEND");
				this._denyButton.pack("APPEND");
				this._innerTitle.pack("APPEND");

				if(typeof args.text !== "undefined")
				{
					this._innerBody.appendChild(window.$natural.wrap(
						document.createTextNode(args.text)
					));
				}
			},
			getBody: function()
			{
				return this._innerBody;
			},
			show: function()
			{
				this._element.removeClass("gui-hidden");
			},
			hide: function()
			{
				this._element.addClass("gui-hidden");
			},
			getLastChoice: function()
			{
				return this._lastChoice;
			},
			onSelected: function(callback)
			{
				this.onready = callback || function(event, choice) {};
			}
		}));
		window.NaturalWidgets.TextDialog = Extend(window.NaturalWidgets.Widget, Class({
			type: "TextDialog",
			path: "CNatural.JS.Widgets.Window.Dialog.TextDialog",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);

				this._element = window.$natural.wrap(
					document.createElement("div")
				).addClass("modal")
					.addClass("gui-widget")
					.addClass("gui-widget-window")
					.addClass("gui-widget-window-dialog")
					.addClass("gui-widget-window-text-dialog")
					.addClass("gui-modal")
					.addClass("gui-hidden")
					.data("widget", "text-dialog");
				this._innerModal = window.$natural.wrap(
					document.createElement("div")
				).addClass("modal-content")
					.addClass("box")
					.addClass("color-gui-body")
					.addClass("no-padding")
					.addClass("no-margin")
					.addClass("no-border");
				this._innerHeader = window.$natural.wrap(
					document.createElement("div")
				).addClass("container")
					.addClass("color-gui-header")
					.addClass("padding-8")
					.addClass("no-margin")
					.addClass("no-border");
				this._innerHeaderCloseButton = window.$natural.wrap(
					document.createElement("span")
				).addClass("close-button")
					.addClass("gui-font-iconset-v1")
					.addClass("no-padding")
					.addClass("no-margin")
					.addClass("no-border")
					.addClass("gui-clickeable")
					.addClass("font-bold")
					.addClass("text-big")
					.addClass("color-transparent");
				this._innerHeaderCloseButton.appendChild(window.$natural.wrap(
					document.createTextNode(window.$natural.NaturalIconSetMap["close"])
				));
				this._innerBody = window.$natural.wrap(
					document.createElement("div")
				).addClass("container")
					.addClass("color-transparent")
					.addClass("padding-8")
					.addClass("no-margin")
					.addClass("border-bottom")
					.addClass("bs-1")
					.addClass("border-color-dark-grey");

				this._element
					.appendChild(this._innerModal)
					.echo(this._innerModal)
					.appendChild(this._innerHeader)
					.appendChild(this._innerBody)
					.echo(this._innerHeader)
					.appendChild(this._innerHeaderCloseButton);

				this._innerTitle = window.NaturalWidgets.Create(
					window.NaturalWidgets.Header,
					{
						parent: this._innerHeader,
						level: 6,
						size: "content.title",
						text: args.title
					}
				);
				this._innerTitle.getElement()
					.addClass("text-center")
					.addClass("color-transparent")
					.addClass("no-padding")
					.addClass("no-margin")
					.addClass("no-border")
					.addClass("width-block");
				this._innerTitle.pack("APPEND");

				if(typeof args.text !== "undefined")
				{
					this._innerBody.appendChild(window.$natural.wrap(
						document.createTextNode(args.text)
					));
				}

				if(args.can_be_closed || true)
				{
					this._innerHeaderCloseButton.attach(() =>
					{
						this.hide();

						if(args.destroy_on_close || false)
						{
							this.getElement().remove();
						}
					}).on("click");
				}
			},
			getBody: function()
			{
				return this._innerBody;
			},
			show: function()
			{
				this._element.removeClass("gui-hidden");
			},
			hide: function()
			{
				this._element.addClass("gui-hidden");
			}
		}));

		window.NaturalWidgets.CreateTextDialog = function(parent, title, text, oncreated)
		{
			var win = window.NaturalWidgets.Create(window.NaturalWidgets.TextDialog, {
				parent: parent,
				title: title,
				text: text,
				can_be_closed: true,
				destroy_on_close: true
			});
			win.pack("APPEND");
			win.show();
			oncreated(win);
			return win;
		};
	};

	if(typeof module !== "undefined")
	{
		module.exports = natsec; // NodeJS, AngularJS, NativeScript, RequireJS, etc
	}
	else
	{
		natsec(window, document); // Browser JS
	}
}());
