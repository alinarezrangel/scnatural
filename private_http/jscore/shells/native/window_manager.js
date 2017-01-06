/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Native Desktop Environment (window manager base class).
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
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.ManagerBase: NaturalObject is undefined");
		}

		if(typeof window.NaturalShell.Native.Context === "undefined")
		{
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.ManagerBase: NaturalShell.Context is undefined");
		}

		window.NaturalShell = window.NaturalShell || {};

		window.NaturalShell.Native = window.NaturalShell.Native || {};

		window.NaturalShell.Native.WindowManager = function(context)
		{
			this.context = context;
		};

		window.NaturalShell.Native.WindowManager.prototype.packWindowAsToplevel = function(windowElement)
		{
			// Abstract method!
			/// Packs a window as toplevel window.
		};

		window.NaturalShell.Native.WindowManager.prototype.hideAllWindows = function()
		{
			// Abstract method!
			/// Hides all windows.
		};

		window.NaturalShell.Native.WindowManager.prototype.showToplevel = function()
		{
			// Abstract method!
			/// Shows the toplevel (most elevated, higher Z-Index) window.
		};

		window.NaturalShell.Native.WindowManager.prototype.moveToTop = function(cmpfcn)
		{
			// Abstract method!
			/// Moves the window specified by the function cmpfcn to be the toplevel window.
		};

		window.NaturalShell.Native.WindowManager.prototype.isShowingWindow = function()
		{
			// Abstract method!
			/// Returns true if is visible any window.
		};

		window.NaturalShell.Native.WindowManager.prototype.isShowing = function(cmpfcn)
		{
			// Abstract method!
			/// Returns true if the cmpfcn functions returns true on any of the windows
			/// contained in this.context.
		};

		window.NaturalShell.Native.WindowManager.prototype.unpackWindow = function(cmpfcn)
		{
			// Abstract method!
			/// Unpacks a window
		};

		window.NaturalShell.Native.WindowManager.prototype.forEach = function(callback)
		{
			this.context.getWindowArea().apply((windowEl) =>
			{
				callback(windowEl);
			}).forEach();
		};

		window.NaturalShell.Native.WindowManager.prototype.getContext = function()
		{
			return this.context;
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
