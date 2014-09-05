JeX
===

JeX is a JavaScript library with some useful classes and other utilities.

Documentation: http://jonziebell.com/jex/doc

Requires https://github.com/nicklynj/rocket

JeX currently provides the following:
* jex.console - Cross-browser console wrapper.
* jex.debug - Debugging utilities namespace.
  * jex.debug.listener - Tracks event listeners added using rocket for use in searching for leaks.
* jex.hashchange - Provides an event to listen on for hashchanges. This uses the normal hashchange event where supported or else falls back to polling. Also implements support for back/forward button in legacy browsers.
* jex.hotkey - Let's you easily listen for things like "enter" or "ctrl+enter" or "a b a b ctrl+enter" on the page or inside of inputs.
* jex.ie - Provides a way to get the version of IE you're running or do comparisons. Uses feature detection and is mostly intended for unfortunate circumstances where legacy support is needed for something.
* jex.table - Table builder with some other useful functions.
* jex.type - More advanced "typeof" with support for basic types like string, number, function, regex, etc.
* jex.prettyprint - Prettyprinter for JavaScript objects. Similar to the native JSON prettyprinter but supports color schemes and doesn't lack support for older versions of IE like the native one does.
* jex.type - Easy, fast, cross-browser, frame-safe type checking.
