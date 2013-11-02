JeX
===

JeX is a JavaScript library with some useful classes and other utilities.

Requires https://github.com/nicklynj/rocket.

JeX currently provides the following:
* jex.console - Cross-browser console wrapper.
* jex.debug - Debugging utilities namespace.
  * jex.debug.listener - Tracks event listeners added using rocket for use in searching for leaks.
* jex.placeholder - Input placeholder. If the browser supports this already, that implementation is used. Otherwise falls back to the JeX implementation.
* jex.table - Table builder with some other useful functions.
* jex.type - More advanced "typeof" with support for basic types like string, number, function, regex, etc.

See doc/index.html for usage details.
