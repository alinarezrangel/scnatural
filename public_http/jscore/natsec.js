/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Natural Selectors Library.
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
		var isLowerCase = function(char)
		{
			return char === char.toLowerCase();
		};
		var isUpperCase = function(char)
		{
			return char === char.toUpperCase();
		};

		var NaturalObject = function(dom)
		{
			this.original = dom;
			this._callbackLastRef = function(ev){};
		};
		NaturalObject.prototype.isNodeList = function()
		{
			return (this.original instanceof window.NodeList) ||
				(this.original instanceof window.HTMLCollection);
		};
		NaturalObject.prototype.get = function(i)
		{
			if(typeof i === "number")
			{
				return new NaturalObject(this.original[i]);
			}
			return new NaturalObject(this.original);
		};
		NaturalObject.prototype.child = function(sq)
		{
			if(typeof sq === "string")
			{
				return new NaturalObject(this.original.querySelectorAll(sq));
			}
			return new NaturalObject(sq);
		};
		NaturalObject.prototype.wrap = function(obj)
		{
			return new NaturalObject(obj);
		};
		NaturalObject.prototype.echo = function(obj)
		{
			return obj;
		};
		NaturalObject.prototype.attr = function(name, value)
		{
			var func = (to) =>
			{
				if(typeof value === "string")
				{
					to.setAttribute(name, value);
					return this;
				}
				else
				{
					return to.getAttribure(name);
				}
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					return func(this.get(i).original);
				}
			}
			else
			{
				return func(this.original);
			}
			return this;
		};
		NaturalObject.prototype.data = function(name, value)
		{
			var func = (to) =>
			{
				if(typeof value === "string")
				{
					to.dataset[name] = value;
					return this;
				}
				else
				{
					return to.dataset[name];
				}
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					return func(this.get(i).original);
				}
			}
			else
			{
				return func(this.original);
			}
			return this;
		};
		NaturalObject.prototype.value = function(value)
		{
			var func = (to) =>
			{
				if(typeof value === "string")
				{
					to.value = value;
				}
				else
				{
					return to.value;
				}
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					return func(this.get(i).original);
				}
			}
			else
			{
				return func(this.original);
			}
			return this;
		};
		NaturalObject.prototype.style = function(obj)
		{
			if(typeof obj === "string")
			{
				return this.original.style[obj];
			}
			var func = (to) =>
			{
				for(var i in obj)
				{
					if(obj.hasOwnProperty(i))
					{
						to.style[i] = obj[i];
					}
				}
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					func(this.get(i).original);
				}
			}
			else
			{
				func(this.original);
			}
			return this;
		};
		NaturalObject.prototype.addClass = function(newremove)
		{
			var func = (to) =>
			{
				if(Array.isArray(newremove))
				{
					to.classList.add.apply(to.classList, newremove);
				}

				to.classList.add(newremove);
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					func(this.get(i).original);
				}
			}
			else
			{
				func(this.original);
			}
			return this;
		};
		NaturalObject.prototype.removeClass = function(newremove)
		{
			var func = (to) =>
			{
				to.classList.remove(newremove);
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					func(this.get(i).original);
				}
			}
			else
			{
				func(this.original);
			}
			return this;
		};
		NaturalObject.prototype.hasClass = function(className)
		{
			var func = (to) =>
			{
				return to.classList.contains(className);
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					return func(this.get(i).original);
				}
			}
			else
			{
				return func(this.original);
			}
			return this;
		};
		NaturalObject.prototype.attach = function(handler)
		{
			this._callbackLastRef = handler;
			return this;
		};
		NaturalObject.prototype.apply = function(handler)
		{
			return this.attach(handler);
		};
		NaturalObject.prototype.call = function(handler)
		{
			return this.attach(handler);
		};
		NaturalObject.prototype.on = function(evt, cll)
		{
			var bubbles = (cll === true);
			if(typeof cll === "function")
			{
				this._callbackLastRef = cll;
			}
			else
			{
				cll = this._callbackLastRef;
			}
			var func = (to) =>
			{
				to.addEventListener(evt, function(ev)
				{
					return cll(ev);
				}, !bubbles);
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					func(this.get(i).original);
				}
			}
			else
			{
				func(this.original);
			}
			return this;
		};
		NaturalObject.prototype.ajax = function(options, callback)
		{
			var xhrc = new XMLHttpRequest();
			var params = "";
			var pdata = "";
			for(var i in options.args)
			{
				if(options.args.hasOwnProperty(i))
				{
					params += "&" + i + "=" + encodeURIComponent(options.args[i]);
				}
			}
			for(var i in options.pdata)
			{
				if(options.pdata.hasOwnProperty(i))
				{
					pdata += "&" + i + "=" + encodeURIComponent(options.pdata[i]);
				}
			}
			if(params !== "")
				params = params.substr(1, params.length - 1);
			if(pdata !== "")
				pdata = pdata.substr(1, pdata.length - 1);
			xhrc.onreadystatechange = function()
			{
				if((this.readyState === 4) && (this.status === 200))
				{
					callback(null, this.responseText);
				}
				if((this.readyState === 4) && (this.status !== 200))
				{
					callback(new Error("Error: unexpected HTTP !200 code " + this.status));
				}
			};
			xhrc.open("POST", options.url + ((params !== "")? ("?" + params) : ""), options.async);
			xhrc.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhrc.setRequestHeader("Content-length", pdata.length);
			xhrc.setRequestHeader("Connection", "close");
			xhrc.send(pdata);
		};
		NaturalObject.prototype.appendChild = function(child)
		{
			var func = (to) =>
			{
				to.appendChild(child.original);
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					func(this.get(i).original);
				}
			}
			else
			{
				func(this.original);
			}
			return this;
		};
		NaturalObject.prototype.remove = function()
		{
			var func = (to) =>
			{
				if(to.parentNode)
				{
					to.parentNode.removeChild(to);
				}
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					func(this.get(i).original);
				}
			}
			else
			{
				func(this.original);
			}
			return this;
		};
		NaturalObject.prototype.removeChild = function(child)
		{
			var func = (to) =>
			{
				to.removeChild(child.original);
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					func(this.get(i).original);
				}
			}
			else
			{
				func(this.original);
			}
			return this;
		};
		NaturalObject.prototype.each = function(cll)
		{
			if(typeof cll === "function")
			{
				this._callbackLastRef = cll;
			}
			else
			{
				cll = this._callbackLastRef;
			}
			var func = (to) =>
			{
				cll(to);
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					func(this.get(i));
				}
			}
			else
			{
				func(this);
			}
			return this;
		};
		NaturalObject.prototype.forEach = function(cll)
		{
			return this.each(cll);
		};
		NaturalObject.prototype.reloadGlobals = function(win)
		{
			if(typeof win === "undefined")
			{
				win = window;
			}
			win.NaturalObject = win.NaturalObject || NaturalObject;
			win.$natural = new win.NaturalObject(document);
			win.$ntc = function(obj)
			{
				if(typeof obj === "string")
				{
					return win.$natural.child(obj);
				}
				return win.$natural.wrap(obj);
			};
		};

		(new NaturalObject(document)).reloadGlobals(window);
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
