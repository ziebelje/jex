

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
 * <li>Chrome 30 - OK</li>
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
 * // You only need to call the constructor once; it just adds prototype
 * // methods to this class. By including this class, you can do the following
 * // or similar:
 * jex.console.log('Text');
 * jex.console.error('Error');
 *
 * @const
 *
 * @namespace
 *
 * @link http://benalman.com/projects/javascript-debug-console-log/
 * @link https://developers.google.com/chrome-developer-tools/docs/console-api
 */
jex.console = {};


/**
 * Wrapper for native console.log().
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/console.log
 *
 * @param {string} message The message to output to the console.
 */
jex.console.log = function(message) {
  jex.console.add_to_buffer_('log', arguments);
  jex.console.flush_buffer_();
};


/**
 * Wrapper for native console.error().
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/console.error
 *
 * @param {string} message The message to output to the console.
 */
jex.console.error = function(message) {
  jex.console.add_to_buffer_('error', arguments);
  jex.console.flush_buffer_();
};


/**
 * Wrapper for native console.debug().
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/console.debug
 *
 * @param {string} message The message to output to the console.
 */
jex.console.debug = function(message) {
  jex.console.add_to_buffer_('debug', arguments);
  jex.console.flush_buffer_();
};


/**
 * Wrapper for native console.warn().
 *
 * @see https://deveoper.mozilla.org/en-US/docs/Web/API/console.warn
 *
 * @param {string} message The message to output to the console.
 */
jex.console.warn = function(message) {
  jex.console.add_to_buffer_('warn', arguments);
  jex.console.flush_buffer_();
};


/**
 * Wrapper for native console.info().
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/console.info
 *
 * @param {string} message The message to output to the console.
 */
jex.console.info = function(message) {
  jex.console.add_to_buffer_('info', arguments);
  jex.console.flush_buffer_();
};


/**
 * Wrapper for native console.time(). This will not work as desired if called
 * when a console does not exist and the call goes to the buffer.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/console.time
 *
 * @param {string} timer_name The name of the timer.
 */
jex.console.time = function(timer_name) {
  jex.console.add_to_buffer_('time', arguments);
  jex.console.flush_buffer_();
};


/**
 * Wrapper for native console.timeEnd(). This will not work as desired if
 * called when a console does not exist and the call goes to the buffer.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/console.time
 *
 * @param {string} timer_name The name of the timer.
 */
jex.console.timeEnd = function(timer_name) {
  jex.console.add_to_buffer_('timeEnd', arguments);
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
 * For example, IE 9 doesn't have console.debug so it will instead log so at
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
