/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Native Desktop Environment (natural window system).
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
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.System: NaturalObject is undefined");
		}

		if(typeof window.NaturalShell.Native.WindowSystem === "undefined")
		{
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.System: NaturalShell.WindowSystem is undefined");
		}

		window.NaturalShell = window.NaturalShell || {};

		window.NaturalShell.Native = window.NaturalShell.Native || {};

		window.NaturalShell.Native.NaturalWindowSystem = function(context, manager)
		{
			window.NaturalShell.Native.WindowSystem.call(this, context, manager);
		};

		window.NaturalShell.Native.NaturalWindowSystem.prototype =
			Object.create(window.NaturalShell.Native.WindowSystem.prototype);

		window.NaturalShell.Native.NaturalWindowSystem.prototype.createDefaultWindow = function(title, appdata)
		{
			var normal = function(winel, appdata)
			{
				var titlebar = document.createElement("div");
				var titlebarCloseOrBackButton = document.createElement("span");
				var titlebarTitle = document.createElement("h2");
				var titlebarMenuButton = document.createElement("span");
				var body = document.createElement("div");

				var parentWindow = null;

				var makeIcon = function(iconName)
				{
					var sp = document.createElement("span");
					sp.className = "gui-font-iconset-v2";
					sp.appendChild(document.createTextNode(iconName));

					return sp;
				};

				titlebar.className = "gui-widget-window-header gui-flexcore-row no-margin od-1";
				titlebar.dataset["widget"] = "window-header";

				titlebarCloseOrBackButton.className = "gui-font-iconset-v2 gui-hoverable od-1 text-jumbo gui-clickeable padding-8 no-margin";
				titlebarCloseOrBackButton.dataset["widget"] = "button";

				titlebarTitle.className = "text-jumbo font-bold od-2 fx-1 margin-8";
				titlebarTitle.dataset["widget"] = "button";

				titlebarMenuButton.className = "gui-font-iconset-v2 gui-hoverable od-3 text-jumbo gui-clickeable padding-8 no-margin";
				titlebarMenuButton.dataset["widget"] = "button";

				body.className = "gui-widget-window-body container border no-padding no-margin od-2 fx-1 force-relative";
				body.dataset["widget"] = "window-body";

				if(appdata.mainWindowCreated)
				{
					titlebarCloseOrBackButton.appendChild(document.createTextNode("back"));
				}
				else
				{
					titlebarCloseOrBackButton.appendChild(document.createTextNode("close"));
				}

				titlebarMenuButton.appendChild(document.createTextNode("menu"));

				titlebarTitle.appendChild(document.createTextNode(title));

				titlebar.appendChild(titlebarCloseOrBackButton);
				titlebar.appendChild(titlebarTitle);
				titlebar.appendChild(titlebarMenuButton);

				winel.appendChild(titlebar);
				winel.appendChild(body);

				return {
					"titlebar": titlebar,
					"titlebarCloseOrBackButton": titlebarCloseOrBackButton,
					"titlebarMenuButton": titlebarMenuButton,
					"titlebarTitle": titlebarTitle,
					"body": body
				};
			};

			return this.createCustomWindow(normal, appdata);
		};

		window.NaturalShell.Native.NaturalWindowSystem.prototype.createCustomWindow = function(callback, appdata)
		{
			var winel = document.createElement("div");
			var menu = document.createElement("div");
			var menuSideNav = document.createElement("div");
			var menuSideNavCloseMenu = document.createElement("span");
			var menuSideNavCloseWindow = document.createElement("span");
			var menuSideNavMinimizeWindow = document.createElement("span");

			var resmap = {
				titlebar: null,
				titlebarCloseOrBackButton: null,
				titlebarMenuButton: null,
				titlebarTitle: null,
				body: null,
				result: null
			};

			var parentWindow = null;

			var makeIcon = function(iconName)
			{
				var sp = document.createElement("span");
				sp.className = "gui-font-iconset-v2";
				sp.appendChild(document.createTextNode(iconName));

				return sp;
			};

			winel.className = "gui-flexcore no-wrap gui-widget-window no-padding no-margin width-block height-block force-relative";
			winel.dataset["widget"] = "window";

			winel.dataset["name"] = appdata.applicationName;
			winel.dataset["ns"] = appdata.namespace;
			winel.dataset["appid"] = appdata.applicationID;
			winel.dataset["instanceId"] = appdata.instanceID.toString();
			winel.dataset["windowId"] = appdata.windowID.toString();
			appdata.windowID++;

			menu.className = "gui-widget-window-menu container padding-8 no-margin card gui-hidden";
			menu.dataset["widget"] = "window-menu";

			menuSideNav.className = "side-navigation border-bottom bs-2 border-color-natural-black";
			menuSideNav.dataset["widget"] = "window-menu-native";

			menuSideNavCloseMenu.className =
				menuSideNavCloseWindow.className =
				menuSideNavMinimizeWindow.className = "link";

			menuSideNavCloseMenu.appendChild(makeIcon("back"));
			menuSideNavCloseMenu.appendChild(document.createTextNode("Close menu"));
			menuSideNavCloseWindow.appendChild(makeIcon("close"));
			menuSideNavCloseWindow.appendChild(document.createTextNode("Close Window"));
			menuSideNavMinimizeWindow.appendChild(makeIcon("minimize"));
			menuSideNavMinimizeWindow.appendChild(document.createTextNode("Minimize window"));

			menuSideNav.appendChild(menuSideNavCloseMenu);
			menuSideNav.appendChild(menuSideNavCloseWindow);
			menuSideNav.appendChild(menuSideNavMinimizeWindow);

			menu.appendChild(menuSideNav);

			resmap = callback(winel, appdata);

			winel.appendChild(menu);

			if(appdata.mainWindowCreated)
			{
				parentWindow = appdata.mainWindow;
			}
			else
			{
				appdata.mainWindowCreated = true;
			}

			var win = new window.NaturalShell.Native.NaturalWindow(parentWindow, appdata, window.$ntc(winel));

			this.initWindowEvents(
				win,
				winel,
				resmap.titlebar,
				resmap.titlebarCloseOrBackButton,
				resmap.titlebarMenuButton,
				resmap.body,
				menu,
				menuSideNavCloseMenu,
				menuSideNavCloseWindow,
				menuSideNavMinimizeWindow
			);

			if(parentWindow === null)
			{
				appdata.mainWindow = win;
			}

			this.getWindowManager().packWindowAsToplevel(win.getWMElement());

			return win;
		};

		window.NaturalShell.Native.NaturalWindowSystem.prototype.destroyWindow = function(windowObject)
		{
			return this.destroyCustomWindow(windowObject);
		};

		window.NaturalShell.Native.NaturalWindowSystem.prototype.destroyCustomWindow = function(windowObject)
		{
			var el = windowObject.getWMElement();
			var params = {};
			var canBeRemoved = true;

			el.apply((el) =>
			{
				canBeRemoved = canBeRemoved && el.original.dispatchEvent(new CustomEvent("close", params));
			}).forEach();

			if(canBeRemoved)
			{
				this.getWindowManager().unpackWindow((windowElement) =>
				{
					return ((windowElement.data("instanceId") == el.data("instanceId"))
						&& (windowElement.data("windowId") == el.data("windowId")));
				});
				return true;
			}

			return false;
		};

		window.NaturalShell.Native.NaturalWindowSystem.prototype.initWindowEvents =
			function(
				windowObject,
				windowElement,
				titlebar,
				titlebarCloseOrBackButton,
				titlebarMenuButton,
				body,
				menu,
				menuSideNavCloseMenu,
				menuSideNavCloseWindow,
				menuSideNavMinimizeWindow
			)
		{
			windowElement = window.$ntc(windowElement);
			menu = window.$ntc(menu);
			menuSideNavCloseMenu = window.$ntc(menuSideNavCloseMenu);
			menuSideNavCloseWindow = window.$ntc(menuSideNavCloseWindow);
			menuSideNavMinimizeWindow = window.$ntc(menuSideNavMinimizeWindow);

			if(titlebar !== null)
			{
				titlebar = window.$ntc(titlebar);
				titlebarCloseOrBackButton = window.$ntc(titlebarCloseOrBackButton);
				titlebarMenuButton = window.$ntc(titlebarMenuButton);

				titlebarCloseOrBackButton.attach(() =>
				{
					this.destroyWindow(windowObject);
				}).on("click");

				titlebarMenuButton.attach(() =>
				{
					menu.animatable().showMoveFromTopToCenter();
				}).on("click");
			}

			menuSideNavCloseMenu.attach(() =>
			{
				menu.animatable().hideMoveFromCenterToTop();
			}).on("click");

			menuSideNavCloseWindow.attach(() =>
			{
				menu.animatable().hideMoveFromCenterToTop();
				this.destroyWindow(windowObject);
			}).on("click");

			menuSideNavMinimizeWindow.attach(() =>
			{
				menu.animatable().hideMoveFromCenterToTop();
				windowElement.addClass("gui-hidden");
			}).on("click");
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
