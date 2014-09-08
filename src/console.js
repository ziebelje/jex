

/**
 * This is a wrapper for the native console class. It provides access to basic
 * console functions that you can call regardless of whether or not a console
 * is available.
 *
 * Any console events triggered before the console is available (like when
 * you're trying to use Firebug Lite with IE7, for example) are buffered.
 * Buffered console events are only output when another console event fires.
 * So, if you have 10 console events before your console is open, you will
 * need to fire off another event (potentially manually) to get the buffer to
 * flush.
 *
 * If the console exists but the function you tried to call isn't there (not
 * all browsers define all of the functions made available here. IE8, for
 * example, doesn't support console.debug()),
 *
 * Tested:
 * <ul>
 * <li>Chrome 36 - OK</li>
 * <li>IE 9 - OK</li>
 * <li>IE 10 - OK</li>
 * <li>IE 11 - In IE11 and potentially other browsers, the console exists
 * even when not open but does not produce output. Therefore, the attempts
 * from this class to buffer the output will fail and console events can be
 * missed. This can be mitigated simply by keeping the console open. The only
 * real utility of the buffer is for older browsers without consoles that
 * take a while to get Firebug started up</li>
 * </ul>
 *
 * @example
 * jex.console.log('Log');
 * jex.console.error('Error');
 *
 * @const
 *
 * @namespace
 *
 * @link http://benalman.com/projects/javascript-debug-console-log/
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Console
 * @link https://developers.google.com/chrome-developer-tools/docs/console-api
 */
jex.console = {};


/**
 * Log a message and stack trace to console if first argument is false.
 *
 * @link https://developer.chrome.com/devtools/docs/console-api#consoleassertexpression-object
 *
 * @param {*} expression The expression to test.
 * @param {*} object Object to use for the assertion message. If no object is
 * provided, "Assertion Failure" will be displayed as default message.
 */
jex.console.assert = function(expression, object) {
  jex.console.add_to_buffer_('assert', arguments);
  jex.console.flush_buffer_();
};


/**
 * Clears the console.
 *
 * @link https://developer.chrome.com/devtools/docs/console-api#consoleclear
 */
jex.console.clear = function() {
  jex.console.add_to_buffer_('clear', arguments);
  jex.console.flush_buffer_();
};


/**
 * Logs the number of times that this particular call to count() has been
 * called. This function takes an optional argument label.
 *
 * If label is supplied, this function logs the number of times count() has been
 * called with that particular label.
 *
 * If label is omitted, the function logs the number of times count() has been
 * called at this particular line.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Console.count
 *
 * @param {string=} opt_label If this is supplied, count() outputs the number of
 * times it has been called at this line and with that label.
 */
jex.console.count = function(opt_label) {
  jex.console.add_to_buffer_('count', arguments);
  jex.console.flush_buffer_();
};


/**
 * Displays an interactive listing of the properties of a specified JavaScript
 * object. This listing lets you use disclosure triangles to examine the
 * contents of child objects.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Console.dir
 *
 * @param {string} object A JavaScript object whose properties should be output.
 */
jex.console.dir = function(object) {
  jex.console.add_to_buffer_('dir', arguments);
  jex.console.flush_buffer_();
};


/**
 * Outputs an error message to the Web Console.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/console.error
 *
 * @param {string} message The message to output.
 * @param {...Object} var_args Additional arguments for advanced output. See
 * official documentation for more detail.
 */
jex.console.error = function(message, var_args) {
  jex.console.add_to_buffer_('error', arguments);
  jex.console.flush_buffer_();
};


/**
 * An alias for error().
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/console.error
 *
 * @param {string} message The message to output.
 * @param {...Object} var_args Additional arguments for advanced output. See
 * official documentation for more detail.
 */
jex.console.exception = function(message, var_args) {
  jex.console.error(message, var_args);
};


/**
 * Creates a new inline group in the Web Console log. This indents all following
 * output by an additional level, until console.groupEnd() is called.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/console.group
 */
jex.console.group = function() {
  jex.console.add_to_buffer_('group', arguments);
  jex.console.flush_buffer_();
};


/**
 * Creates a new inline group in the Web Console. Unlike console.group(),
 * however, the new group is created collapsed. The user will need to use the
 * disclosure button next to it to expand it, revealing the entries created in
 * the group.
 *
 * Call console.groupEnd() to back out to the parent group.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/console.groupCollapsed
 */
jex.console.groupCollapsed = function() {
  jex.console.add_to_buffer_('groupCollapsed', arguments);
  jex.console.flush_buffer_();
};


/**
 * Exits the current inline group in the Web Console.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/console.groupEnd
 */
jex.console.groupEnd = function() {
  jex.console.add_to_buffer_('groupEnd', arguments);
  jex.console.flush_buffer_();
};


/**
 * Outputs an informational message to the Web Console.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/console.info
 *
 * @param {string} message The message to output.
 * @param {...Object} var_args Additional arguments for advanced output. See
 * official documentation for more detail.
 */
jex.console.info = function(message, var_args) {
  jex.console.add_to_buffer_('info', arguments);
  jex.console.flush_buffer_();
};


/**
 * Outputs a message to the Web Console.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/console.log
 *
 * @param {string} message The message to output.
 * @param {...Object} var_args Additional arguments for advanced output. See
 * official documentation for more detail.
 */
jex.console.log = function(message, var_args) {
  jex.console.add_to_buffer_('log', arguments);
  jex.console.flush_buffer_();
};


/**
 * Starts the JavaScript profiler. You can specify an optional label for the
 * profile.
 *
 * @link https://developer.chrome.com/devtools/docs/console-api#consoleprofilelabel
 *
 * @param {String=} opt_label An optional label for the profile.
 */
jex.console.profile = function(opt_label) {
  jex.console.add_to_buffer_('profile', arguments);
  jex.console.flush_buffer_();
};


/**
 * Stops the current JavaScript CPU profiling session, if one is in progress,
 * and prints the report to the Profiles panel.
 *
 * @link https://developer.chrome.com/devtools/docs/console-api#consoleprofileend
 *
 * @param {String=} opt_label An optional label for the profile.
 */
jex.console.profileEnd = function(opt_label) {
  jex.console.add_to_buffer_('profileEnd', arguments);
  jex.console.flush_buffer_();
};


/**
 * Output an object to a table. There is currently no official documentation on
 * this function.
 *
 * @param {Object} object The object to display.
 */
jex.console.table = function(object) {
  jex.console.add_to_buffer_('table', arguments);
  jex.console.flush_buffer_();
};


/**
 * Starts a timer you can use to track how long an operation takes. You give
 * each timer a unique name, and may have up to 10,000 timers running on a given
 * page. When you call console.timeEnd() with the same name, the browser will
 * output the time, in milliseconds, that elapsed since the timer was started.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/console.time
 *
 * @param {string} timer_name The name to give the new timer. This will identify
 * the timer; use the same name when calling console.timeEnd() to stop the timer
 * and get the time output to the console.
 */
jex.console.time = function(timer_name) {
  jex.console.add_to_buffer_('time', arguments);
  jex.console.flush_buffer_();
};


/**
 * Stops a timer that was previously started by calling console.time().
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/console.timeEnd
 *
 * @param {string} timer_name The name of the timer to stop. Once stopped, the
 * elapsed time is automatically displayed in the Web Console.
 */
jex.console.timeEnd = function(timer_name) {
  jex.console.add_to_buffer_('timeEnd', arguments);
  jex.console.flush_buffer_();
};


/**
 * Outputs a stack trace to the Web Console.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/console.trace
 *
 * @param {string} message The message to output.
 * @param {...Object} var_args Additional arguments for advanced output. See
 * official documentation for more detail.
 */
jex.console.trace = function(message, var_args) {
  jex.console.add_to_buffer_('trace', arguments);
  jex.console.flush_buffer_();
};


/**
 * Outputs a warning message to the Web Console.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/console.warn
 *
 * @param {string} message The message to output.
 * @param {...Object} var_args Additional arguments for advanced output. See
 * official documentation for more detail.
 */
jex.console.warn = function(message, var_args) {
  jex.console.add_to_buffer_('warn', arguments);
  jex.console.flush_buffer_();
};


/**
 * A buffer of console events that need to be flushed to the console when it
 * becomes available.
 *
 * @private
 *
 * @type {Array.<{console_function: string, console_arguments: Arguments}>}
 */
jex.console.buffer_ = [];


/**
 * Add a console function call to the buffer.
 *
 * @private
 *
 * @param {string} console_function The console function to buffer.
 * @param {Arguments} console_arguments The arguments to pass to the function
 * call.
 */
jex.console.add_to_buffer_ = function(console_function, console_arguments) {
  jex.console.buffer_.push({
    'console_function': console_function,
    'console_arguments': console_arguments
  });
};


/**
 * As long as window.console exists, flush the buffer to the console. The
 * execute_() call handles all of the cross-browser quirks.
 *
 * @private
 */
jex.console.flush_buffer_ = function() {
  if (window.console) {
    var buffer_item;
    while (buffer_item = jex.console.buffer_.shift()) {
      jex.console.execute_(
          buffer_item.console_function,
          buffer_item.console_arguments
      );
    }
  }
};


/**
 * First of all, IE sucks. Their console functions are of type 'object'
 * instead of 'function', so you can't call .apply on them. This is true for
 * IE9 and below. That's what the type check is all about here. More info at
 *
 * Next up, this falls back to console.log when the function you called fails.
 * For example, IE9 doesn't have console.debug so it will instead log so at
 * least something shows up in the console.
 *
 * @private
 *
 * @param {string} console_function The console function to execute.
 * @param {Object} console_arguments The arguments to pass to the console
 * function.
 *
 * @link http://stackoverflow.com/a/6514267
 */
jex.console.execute_ = function(console_function, console_arguments) {
  if (window.console[console_function]) {
    if (typeof window.console[console_function] === 'object') {
      Function.prototype.apply.apply(
          window.console[console_function],
          [window.console, console_arguments]
      );
    }
    else {
      /** @type {Function} */ (window.console[console_function])
        .apply(window.console, console_arguments);
    }
  }
  else if (console_function !== 'log') {
    // If the called console function doesn't exist, fall back to the log
    // function. Doesn't try to call log if log doesn't exist or this will loop
    // forever.
    jex.console.execute_('log', console_arguments);
  }
  else {
    // The console exists but didn't even have the log function...probably
    // shouldn't ever happen.
  }
};
