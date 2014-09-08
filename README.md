JeX
===

Documentation: http://jonziebell.com/jex/doc
Requires https://github.com/nicklynj/rocket

###jex.console
> Allows you to call all of the functions in the Console API regardless of your browser. Unsupported functions fall back to console.log() and console output is buffered for when loading a console after the page is loaded is necessary.

###jex.debug
> Some debugging utilities. This is fairly limited at the moment but allows you to easily see how many listeners have been added to the document via Rocket.

### jex.hashchange
> Provides an event that can have a listener attached to to get hashchange events. This uses the normal hashchange event where supported or else falls back to polling. Also implements support for back/forward button in legacy browsers.

###jex.hotkey
> Lets you easily listen for hotkeys like "enter" or "ctrl+enter" or "a b a b ctrl+enter" on the page or inside of inputs. This currently has a couple of bugs that need fixed.

###jex.ie
> Uses proper feature detection to determine what version of IE you are running. Functions run on demand. Results are 100% accurate unless running in compatibility mode.

###jex.table
> Utility class for creating and accessing tables way faster than it would normally take to write all that code out every single time.

###jex.type
> More advanced "typeof" with support for lots of types. Returns a string representation of the type and won't return "object" for things like [] and /regex/.

###jex.prettyprint
> Prettyprinter for JavaScript objects. Similar to the native JSON prettyprinter but supports color schemes and works across browsers.
