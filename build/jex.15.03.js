/**
 * @preserve The JeX JavaScript library.
 *
 * This library is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * This library is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public
 * License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this library. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * Base namespace for JeX
 *
 * @const
 *
 * @namespace
 */
var jex = {};


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


/**
 * This is a quick helper class for determining which version of IE is
 * running. It's easier than remembering all of the feature detection and the
 * code used is self-documenting so it's clear what you're doing.
 *
 * Compatibility mode support is not guaranteed although it seems to be pretty
 * accurate.
 *
 * Tested:
 * <ul>
 * <li>Chrome 33 - ✓</li>
 * <li>FF 27 - ✓</li>
 * <li>IE 6 - ✓</li>
 * <li>IE 7 - ✓</li>
 * <li>IE 8 - ✓</li>
 * <li>IE 9 - ✓</li>
 * <li>IE 10 - ✓</li>
 * <li>IE 11 - ✓</li>
 * </ul>
 *
 * @const
 *
 * @namespace
 */
jex.ie = {};


/**
 * The IE version.
 *
 * @private
 *
 * @type {?number}
 */
jex.ie.version_;


/**
 * Check to see if the IE version is less than a specified version.
 *
 * @param {number} version
 *
 * @return {boolean}
 */
jex.ie.less_than = function(version) {
  if (!jex.ie.get_version()) {
    return false;
  }
  else {
    return jex.ie.get_version() < version;
  }
};


/**
 * Check to see if the IE version is greater than a specified version.
 *
 * @param {number} version
 *
 * @return {boolean}
 */
jex.ie.greater_than = function(version) {
  if (!jex.ie.get_version()) {
    return false;
  }
  else {
    return jex.ie.get_version() > version;
  }
};


/**
 * Check to see if the IE version matches a specified version.
 *
 * @param {number} version
 *
 * @return {boolean}
 */
jex.ie.equals = function(version) {
  return version === jex.ie.get_version();
};


/**
 * Get the current IE version. This just uses feature detection to look for
 * browsers that are both >= the desired version and <= the desired version.
 * If you "and" the two together you get what you want.
 *
 * @link http://tanalin.com/en/articles/ie-version-js/
 *
 * @return {?number} The current IE version. Supports IE 6-10.
 */
jex.ie.get_version = function() {
  if (!jex.ie.version_) {
    if (document.all && window.atob) {
      jex.ie.version_ = 10;
    }
    else if (document.all && !window.atob && document.addEventListener) {
      jex.ie.version_ = 9;
    }
    else if (document.all && !document.addEventListener && document.querySelector) {
      jex.ie.version_ = 8;
    }
    else if (document.all && !document.querySelector && window.XMLHttpRequest) {
      jex.ie.version_ = 7;
    }
    else if (document.all && !window.XMLHttpRequest && document.compatMode) {
      jex.ie.version_ = 6;
    }
    else {
      jex.ie.version_ = null;
    }
  }
  return jex.ie.version_;
};


/**
 * Returns the type of the provided object. This is optimized for speed and
 * also supports object types across frames. It's good for the following
 * types: array, boolean, date, function, number, null, object, regexp,
 * string, undefined.
 *
 * Tested:
 * <ul>
 * <li>Chrome 30 - OK</li>
 * <li>FF 22 - OK</li>
 * <li>IE 7 - OK</li>
 * <li>IE 8 - OK</li>
 * <li>IE 9 - Need to retest with optimizations</li>
 * <li>IE 10 - OK</li>
 * <li>IE 11 - Need to retest with optimizations</li>
 * </ul>
 *
 * @example
 * // Get the type of an object
 * var type = jex.type(1);
 * var type = jex.type(some_object);
 *
 * // Get the type of an object in another frame
 * var type = jex.type(some_object_in_another_frame);
 *
 * // Get the type of an object in another frame
 * // Set opt_respect_frames to true to optimize slightly when accessing across frames.
 * var type = jex.type(some_object_in_another_frame, true);
 *
 * @link http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
 * @link http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
 *
 * @param {*} object The object to get the type for.
 * @param {boolean=} opt_respect_frames Basically whether or not you're passing
 * objects around between different frames. Technically the function will work
 * 100% correctly across frames even with this set to false; it will just run a
 * tiny bit slower. Rudimentary benchmarks put it at mere milliseconds for
 * 100,000 calls to this function (in Chrome 30).
 *
 * @return {string} The actual type of the object.
 */
jex.type = function(object, opt_respect_frames) {
  if (arguments.length === 1) {
    opt_respect_frames = false;
  }

  // A couple shortcuts that always work. The generic type check doesn't work
  // with null/undefined in IE8 or less.
  if (object === null) {
    return 'null';
  }
  else if (object === undefined) {
    return 'undefined';
  }

  // Can only use these shortcuts if not accessing objects across frames. If you
  // do use these across frames they just won't return and the generic
  // Object.prototype check will still run.
  if (opt_respect_frames === false) {
    if (typeof object === 'string' || object instanceof String) {
      // var a = 'foo'
      // var b = new String('foo')
      // typeof a === 'string'
      // typeof b === 'object'
      // a instanceof String === false
      // b instanceof String === true
      return 'string';
    }
    else if (typeof object === 'number' || object instanceof Number) {
      // var a = 1
      // var b = new Number(1)
      // typeof a === 'number'
      // typeof b === 'object'
      // a instanceof Number === false
      // b instanceof Number === true
      return 'number';
    }
    else if (typeof object === 'boolean' || object instanceof Boolean) {
      // var a = true (works for false, too)
      // var b = new Boolean(true)
      // typeof a === 'boolean'
      // typeof b === 'object'
      // a instanceof Boolean === false
      // b instanceof Boolean === true
      return 'boolean';
    }
    else if (object instanceof Array) {
      // var a = []
      // var b = new Array()
      // typeof a === 'object'
      // typeof b === 'object'
      // a instanceof Array === true
      // b instanceof Array === true
      return 'array';
    }
    else if (object instanceof Function) {
      // var a = function() {}
      // var b = new Function()
      // typeof a === 'function'
      // typeof b === 'function'
      // a instanceof Function === true
      // b instanceof Function === true
      return 'function';
    }
    else if (object instanceof RegExp) {
      // var a = /foo/
      // var b = new RegExp('foo');
      // typeof a === 'object'
      // typeof b === 'object'
      // a instanceof RegExp === true
      // b instanceof RegExp === true
      return 'regexp';
    }
    else if (object instanceof Date) {
      // var b = new Date();
      // typeof b === 'object'
      // b instanceof Date === true
      return 'date';
    }
  }

  // If none of the shortcuts were allowed/were valid, fall back to this slow
  // method.
  var type = Object.prototype.toString.call(object);

  // Look up the type in the map and use it where possible. Trying to use the
  // regular expression match is a good catch-all but makes this run twice as
  // slow.
  if (jex.type.map_[type]) {
    return jex.type.map_[type];
  }
  else {
    return type.match(jex.type.regexp_)[1].toLowerCase();
  }
};


/**
 * Regular expression to extract the useful portion out of the toString()
 * call. This is only used when the object type isn't found in jex.type.map
 * because it's super slow.
 *
 * @private
 *
 * @type {RegExp}
 */
jex.type.regexp_ = /\s([a-zA-Z]+)/;


/**
 * Map of native object type strings to a nicer return format. This is used in
 * preference over a regular expression match which vastly improves the speed.
 *
 * @private
 *
 * @type {Object.<string, string>}
 */
jex.type.map_ = {
  '[object Array]': 'array',
  '[object Boolean]': 'boolean',
  '[object Date]': 'date',
  '[object Function]': 'function',
  '[object Number]': 'number',
  '[object Null]': 'null',
  '[object Object]': 'object',
  '[object RegExp]': 'regexp',
  '[object String]': 'string',
  '[object Undefined]': 'undefined'
};



/**
 * Creates a table with the chosen number of rows and columns. Makes it easy
 * and fast to create a table and offers a few functions for easily accessing
 * elements inside the table or appending rows/columns.
 *
 * @example
 * // Create a table with 0 rows and 0 columns.
 * var table = new jex.table();
 *
 * @example
 * // Create a table with four rows and 0 columns.
 * var table = new jex.table({'rows': 4});
 *
 * @example
 * // Create a table with four columns and 0 rows.
 * var table = new jex.table({'columns': 4});
 *
 * @example
 * // Create a table with four rows and two columns.
 * var table = new jex.table({'rows': 4, 'columns': 2});
 *
 * @example
 * // Create a table with four rows and two columns with the top row in a thead.
 * var table = new jex.table({'rows': 4, 'columns': 2, 'header': true});
 *
 * @example
 * // Create a table and then add a row to it, then add a row above that row.
 * var table = new jex.table();
 * table.add_row();
 * table.add_row(0);
 *
 * @constructor
 *
 * @param {{rows: number, columns: number, header: boolean}} options
 * <strong>rows</strong> - How many rows are in the table, including any header. Default 0.<br/>
 * <strong>columns</strong> - How many columns are in the table. Default 0.<br/>
 * <strong>header</strong> - Whether or not a thead is placed on the table. A thead counts as
 * one of your rows. Default false.
 */
jex.table = function(options) {
  var rows = options.rows || ((options.header === true) ? 1 : 0);
  this.columns_ = options.columns || 0;

  this.table_ = rocket.createElement('table');
  this.table_.setAttribute({
    'cellpadding': '0',
    'cellspacing': '0'
  });
  this.tbody_ = rocket.createElement('tbody');
  this.trs_ = [];
  this.tds_ = [];

  var tr;
  if (options.header === true) {
    // This is adding the first row, so subtract one from the row count to avoid
    // adding too many rows because the passed row count includes the header
    // row.
    rows--;

    this.thead_ = rocket.createElement('thead');
    tr = this.render_tr_('th');
    this.trs_.push(tr);
    this.thead_.appendChild(tr);
    this.table_.appendChild(this.thead_);
  }

  var tbody = rocket.createElement('tbody');
  for (var i = 0; i < rows; i++) {
    tr = this.render_tr_('td');
    this.trs_.push(tr);
    this.tbody_.appendChild(tr);
  }

  this.table_.appendChild(this.tbody_);
};


/**
 * The table element.
 *
 * @type {rocket.Elements}
 */
jex.table.prototype.table_;


/**
 * The tbody element.
 *
 * @type {rocket.Elements}
 */
jex.table.prototype.tbody_;


/**
 * The thead element. This will be undefined if there is no header on the table.
 *
 * @type {rocket.Elements}
 */
jex.table.prototype.thead_;


/**
 * The number of columns currently in the table.
 *
 * @type {number}
 */
jex.table.prototype.columns_;


/**
 * An array of all the trs in the table.
 *
 * @type {Array.<rocket.Elements>}
 */
jex.table.prototype.trs_;


/**
 * An array of arrays of all the tds in the table organized by row then column.
 *
 * @type {Array.<Array.<rocket.Elements>>}
 */
jex.table.prototype.tds_;


/**
 * Renders a tr with the number of columns specified on the table.
 *
 * @private
 *
 * @param {string} cell_type Either "th" or "td" depending on what type of row
 * this is.
 * @param {number=} opt_row_index The row to place these tds in. The placement
 * is important for the storage of this.tds_ so that it can be properly used
 * to place values.
 *
 * @return {rocket.Elements}
 */
jex.table.prototype.render_tr_ = function(cell_type, opt_row_index) {
  var row_index = opt_row_index || this.trs_.length;

  var tr = rocket.createElement('tr');
  var tds = [];
  var cell;
  for (var i = 0; i < this.columns_; i++) {
    cell = rocket.createElement(cell_type);
    tds.push(cell);
    tr.appendChild(cell);
  }
  this.tds_.splice(row_index, 0, tds);
  return tr;
};


/**
 * Fills a row in the table with the given data.
 *
 * @param {number} row_index The index of the row to fill in.
 * @param {Array.<string|rocket.Elements>} data The data to put in the row.
 * This can either be an array of strings or elements; they can be mixed.
 */
jex.table.prototype.fill_row = function(row_index, data) {
  var column = 0;
  var len = data.length;
  for (; column < len; column++) {
    if (jex.type(data[column]) === 'object') {
      // Allow placing of elements directly into the td.
      this.td(column, row_index).innerHTML('');
      this.td(column, row_index).appendChild(/** @type {rocket.Elements} */ (data[column]));
    }
    else {
      this.td(column, row_index).innerHTML(/** @type {string} */ (data[column]));
    }
  }
};


/**
 * Add a row to the table, either at the end or the position specified by
 * opt_row_index.
 *
 * @param {number=} opt_row_index Optional placement in the table, including
 * any header rows, 0-indexed. This will take that position and scoot
 * everything else below it. If ommitted, place the new row at the end.
 *
 * @return {number} The index of the row you just added. It will be
 * opt_row_index when provided, else the number of the rows in the table
 * (including headers) minus one.
 */
jex.table.prototype.add_row = function(opt_row_index) {
  var row_index = opt_row_index || this.trs_.length;
  var tr = this.render_tr_('td', opt_row_index);

  this.tbody_.insertBefore(tr, this.trs_[row_index]);
  this.trs_.splice(row_index, 0, tr);

  return row_index;
};


/**
 * Remove a specific row from the table specified by row_index.
 *
 * @param {number} row_index The row to remove, 0-indexed, beginning with the
 * header row as index 0.
 *
 * @return {number} The number of rows in the table (including headers) after
 * this adjustment.
 */
jex.table.prototype.remove_row = function(row_index) {
  this.trs_[row_index].parentNode().removeChild(this.trs_[row_index]);
  this.trs_.splice(row_index, 1);
  this.tds_.splice(row_index, 1);

  return this.trs_.length;
};


/**
 * Get the table element from this instance of the jex.table class.
 *
 * @return {rocket.Elements} The table element.
 */
jex.table.prototype.table = function() {
  return this.table_;
};


/**
 * Get the thead element from this instance of the jex.table class. Will return
 * undefined if there is no header.
 *
 * @return {rocket.Elements} The thead element.
 */
jex.table.prototype.thead = function() {
  return this.thead_;
};


/**
 * Get the tbody element from this instance of the jex.table class.
 *
 * @return {rocket.Elements} The tbody element.
 */
jex.table.prototype.tbody = function() {
  return this.tbody_;
};


/**
 * Get the tr element at the specified index.
 *
 * @param {number} row_index The index of the row to fetch. Includes the
 * header row.
 *
 * @return {rocket.Elements} The tr element.
 */
jex.table.prototype.tr = function(row_index) {
  return this.trs_[row_index];
};


/**
 * Get the td element at the specified row/column index. The arguments
 * are ordered such that x and y both increment moving outward to the right
 * and down from the origin (top left).
 *
 * @param {number} column_index The index of the column the td is located in.
 * @param {number} row_index The index of the row the td is located in.
 * Includes the header row.
 *
 * @return {rocket.Elements} The td element.
 */
jex.table.prototype.td = function(column_index, row_index) {
  // The arguments get swapped because it's more convenient to store tds as they
  // get placed into the tr, which means they are organized somewhat counter-
  // intuitively.
  return this.tds_[row_index][column_index];
};


/**
 * Debug namespace for JeX. Debugging utilities go here. Console is exempt
 * only for brevity of those function calls.
 *
 * @const
 *
 * @namespace
 */
jex.debug = {};


/**
 * Debug utilities for event listeners.
 *
 * Tested:
 * <ul>
 * <li>Chrome 30 - OK</li>
 * <li>IE 10 - OK</li>
 * </ul>
 *
 * @const
 *
 * @namespace
 */
jex.debug.listener = {};


/**
 * Render the event listener count in a div on the bottom right corner of the
 * body. It stays updated automatically. Note that this can only be called
 * inside a rocket.ready() callback or else after document.body exists.
 *
 * @example
 * // Call this to render the listener count on the page.
 * jex.debug.listener.render_count();
 */
jex.debug.listener.render_count = function() {
  var listener_count_container = rocket.createElement('div')
    .style({
        'position': 'fixed',
        'bottom': '0',
        'right': '0',
        'background': '#fff',
        'padding': '4px',
        'opacity': '.8'
      });
  listener_count_container.innerHTML(
      'Listeners: ' +
      jex.debug.listener.get_count()
  );
  document.body.appendChild(listener_count_container[0]);

  var add_event_listener = rocket.EventTarget.prototype.addEventListener;
  rocket.EventTarget.prototype.addEventListener = function() {
    add_event_listener.apply(this, arguments);
    listener_count_container.innerHTML(
        'Listeners: ' +
        jex.debug.listener.get_count()
    );
  };
  var remove_event_listener = rocket.EventTarget.prototype.removeEventListener;
  rocket.EventTarget.prototype.removeEventListener = function() {
    remove_event_listener.apply(this, arguments);
    listener_count_container.innerHTML(
        'Listeners: ' +
        jex.debug.listener.get_count()
    );
  };
};


/**
 * Count the current number of active event listeners. This loops over the
 * rocket listener tree, so it's not super effecient, but still runs pretty
 * quickly regardless.
 *
 * Note that this only counts listeners added using rocket.EventTarget. Native
 * listeners or inline listeners are not included here.
 *
 * @return {number} The number of currently active event listeners.
 */
jex.debug.listener.get_count = function() {
  var listener_count = 0;

  /**
   * Iterating over an object will give you strings, but the guid is typed as
   * a number in rocket so I have to fix that. I think rocket's type of number
   * for the guid index is incorrect.
   *
   * @type {number}
   */
  var guid_number;

  var listener_tree = rocket.EventTarget.getListenerTree();
  for (var guid in listener_tree) {
    guid_number = parseInt(guid, 10);
    for (var type in listener_tree[guid_number]) {
      for (var namespace in listener_tree[guid_number][type]) {
        listener_count += listener_tree[guid_number][type][namespace].length;
      }
    }
  }
  return listener_count;
};
// todo:  ; :, = + and - _, have different values

// todo: add meta key support (for mac and then windows key)

// todo: make ctrl / command be treated the same (or add a special 'mod' key or something)

// todo: replace map with String.fromCharCode() ?

// todo: Modifier keys pressed on their own do not work. For example, I cannot
// have a hotkey for 'shift' or use 'shift' in any sequence alone.

// todo: hotkeys bound to inputs should only fire INSIDE those inputs


/**
 * @const
 *
 * @namespace
 */
jex.hotkey = {};


/**
 * A list of all defined hotkeys. These are organized first by group and then
 * by hotkey.
 *
 * @private
 *
 * @type {Object.<string, Object.<string, {callback: Function, inputs: Array.<Element>}>>}
 */
jex.hotkey.hotkeys_ = {};


/**
 * The currently active group. By default, any hotkeys with no group will be
 * added to the '' group which is enabled by default.
 *
 * @private
 *
 * @type {Array.<string>}
 */
jex.hotkey.active_groups_ = [''];


/**
 * Whether or not hotkeys are currently enabled.
 *
 * @private
 *
 * @type {boolean}
 */
jex.hotkey.enabled_ = false;


/**
 * The current hotkey. Updates every keyup and resets after the timeout.
 *
 * @private
 *
 * @type {string}
 */
jex.hotkey.current_hotkey_ = '';


/**
 * Whether or not jex.hotkey is active. If not, there will be no global
 * keydown event lstener.
 *
 * @private
 *
 * @type {boolean}
 */
jex.hotkey.is_active_ = false;


/**
 * Timeout for time between sequence keypresses.
 *
 * @private
 *
 * @type {number}
 */
jex.hotkey.sequence_timeout_ = 1000;


/**
 * Whether or not detection of hotkeys is paused.
 *
 * @private
 *
 * @type {boolean}
 */
jex.hotkey.paused_ = false;


/**
 * The timeout handle so the timeout can be cancelled if necessary.
 *
 * @private
 *
 * @type {number}
 */
jex.hotkey.sequence_timeout_handle_;


/**
 * A list of all supported keys and their keycodes. This is the NON-SHIFT
 * version of these keycodes.
 *
 * @private
 *
 * @link http://unixpapa.com/js/key.html
 *
 * @type {Object.<string, string>}
 */
jex.hotkey.keycode_map_ = {
  // Letters
  65: 'a',
  66: 'b',
  67: 'c',
  68: 'd',
  69: 'e',
  70: 'f',
  71: 'g',
  72: 'h',
  73: 'i',
  74: 'j',
  75: 'k',
  76: 'l',
  77: 'm',
  78: 'n',
  79: 'o',
  80: 'p',
  81: 'q',
  82: 'r',
  83: 's',
  84: 't',
  85: 'u',
  86: 'v',
  87: 'w',
  88: 'x',
  89: 'y',
  90: 'z',

  // Numbers
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',

  // Symbols
  186: ';',
  187: '=',
  188: ',',
  109: '-',
  190: '.',
  191: '/',
  192: '`',
  219: '[',
  220: '\\',
  221: ']',
  222: '\'',

  // Arrows
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',

  // Functions
  112: 'f1',
  113: 'f2',
  114: 'f3',
  115: 'f4',
  116: 'f5',
  117: 'f6',
  118: 'f7',
  119: 'f8',
  120: 'f9',
  121: 'f10',
  122: 'f11',
  123: 'f12',

  // Etc
  13: 'enter',
  32: 'space',
  20: 'capslock',
  144: 'numlock',
  145: 'scrolllock',
  45: 'insert',
  46: 'delete',
  36: 'home',
  35: 'end',
  33: 'pageup',
  34: 'pagedown',
  9: 'tab',
  19: 'break',
  8: 'backspace',
  27: 'escape',

  // Numpad
  107: '+',
  // 109: '-', // See todo about this and a couple other keys
  106: '*',
  111: '/',
  110: '.',
  // numpad left, up, right down are same as arrow keys
  // 46: 'delete',
  // 45: 'insert',
  // 35: 'end',
  // 40: 'down',
  // 34: 'pagedown',
  // 37: 'left',
  // 39: 'right',
  // 36: 'home',
  // 38: 'up',
  // 33: 'pageup',
  96: '0',
  97: '1',
  98: '2',
  99: '3',
  100: '4',
  101: '5',
  102: '6',
  103: '7',
  104: '8',
  105: '9',

  // Vendor
  91: 'start',
  92: 'start',
  93: 'menu',
  224: 'command',

  // Modifier
  16: 'shift',
  17: 'ctrl',
  18: 'alt'
};


/**
 * Symbols for keycodes that should be used when the shift key is pressed.
 *
 * @private
 *
 * @type {Object.<string, string>}
 */
jex.hotkey.shift_keycode_map_ = {
  48: ')',
  49: '!',
  50: '@',
  51: '#',
  52: '$',
  53: '%',
  54: '^',
  55: '&',
  56: '*',
  57: '(',

  186: ':',
  187: '+',
  188: '<',
  109: '_',
  190: '>',
  191: '?',
  192: '~',
  219: '{',
  220: '|',
  221: '}',
  222: '"'
};


/**
 * Add a hotkey to the document. If at least one hotkey currently exists and
 * is enabled, an event listener will be attached to the document that fires
 * onkeydown.
 *
 * @param {{hotkey: (string|Array.<string>), callback: Function, group: string,
 * input: (rocket.Elements|Array.<rocket.Elements>)}}
 * options
 *
 * hotkey: The hotkey to add to the page. Hotkeys cannot be duplicated in the
 * same group.
 *
 * callback: The function to call when the hotkey conditions are met.
 *
 * group: The name of the group this hotkey belongs to. Default is '' (empty
 * string). One or more groups can be enabled at any given time. Hotkeys can
 * be re-used if they exist in different groups; all of their callbacks will
 * still fire in the order they were added.
 *
 * input: todo
 */
jex.hotkey.add = function(options) {
  var hotkeys = [].concat(options.hotkey);

  // Make input an array of inputs (or an empty array if not set). This also
  // converts to an array of HTML input elements instead of Rocket elements.
  // This is a bit quicker for the check function and it makes the object
  // comparisons work properly with e.target.
  var inputs = [].concat(options.input || []);
  for (var i = 0, len = inputs.length; i < len; ++i) {
    inputs[i] = inputs[i][0];
  }

  var hotkey, callback, group;
  for (var i = 0, len = hotkeys.length; i < len; ++i) {
    // Normalize the hotkey.
    hotkey = jex.hotkey.normalize_(hotkeys[i]);
    callback = options.callback;
    group = options.group || '';

    // Add the hotkey and create the group if it does not yet exist.
    if (jex.hotkey.hotkeys_.hasOwnProperty(group) === false) {
      jex.hotkey.hotkeys_[group] = {};
    }
    jex.hotkey.hotkeys_[group][hotkey] = {
      'callback': callback,
      'inputs': inputs
    };
  }

  jex.hotkey.check_listener_();
};


/**
 * Look at the currently active group(s) and all of the hotkeys in it and
 * determine if the event listener needs to be attached to the document.
 *
 * @private
 */
jex.hotkey.check_listener_ = function() {
  var need_listener = false;

  if (jex.hotkey.paused_ === false) {
    // Loop over all of the currently active groups.
    for (var i = 0, len = jex.hotkey.active_groups_.length; i < len; ++i) {
      // If any of these groups have at least one hotkey in them, hotkey detection
      // should be enabled.
      if (rocket.keys(/** @type {!Object} */ (jex.hotkey.hotkeys_[jex.hotkey.active_groups_[i]])).length > 0) {
        need_listener = true;
        break;
      }
    }
  }

  if (need_listener === true) {
    if (jex.hotkey.enabled_ === false) {
      rocket.$(window).addEventListener(
          'keydown.jex.hotkey',
          jex.hotkey.keydown_handler_
      );
      jex.hotkey.enabled_ = true;
    }
  }
  else {
    rocket.$(window).removeEventListener('.jex.hotkey');
    jex.hotkey.enabled_ = false;
  }
};


/**
 * Pause detection of hotkeys. All groups and hotkey definitions will remain
 * unchanged, they will just stop being detected.
 */
jex.hotkey.pause = function() {
  jex.hotkey.paused_ = true;
};


/**
 * Unpause detection of hotkeys.
 */
jex.hotkey.unpause = function() {
  jex.hotkey.paused_ = false;
};


/**
 * Remove a hotkey from an optionally specified group. If group is not
 * specified, the hotkey will be removed from the default group.
 *
 * @param {string} hotkey The hotkey to remove.
 * @param {string} group The group to remove the hotkey from.
 */
jex.hotkey.remove = function(hotkey, group) {
  group = group || '';

  // Normalize and delete the hotkey.
  hotkey = jex.hotkey.normalize_(hotkey);
  delete jex.hotkey.hotkeys_[group][hotkey];

  // Remove the document event listener if necessary.
  jex.hotkey.check_listener_();
};


/**
 * Remove a group of hotkeys entirely. Both the group and the hotkeys in the
 * group are completely removed, even if the group is currently active. They
 * will need to be re-added in order to be used again.
 *
 * @param {string} group The group to remove.
 */
jex.hotkey.remove_group = function(group) {
  // Delete the group.
  delete jex.hotkey.hotkeys_[group];

  // Remove this group from the active groups.
  jex.hotkey.active_groups_.splice(rocket.indexOf(jex.hotkey.active_groups_, group), 1);

  // Remove the document event listener if necessary.
  jex.hotkey.check_listener_();
};


/**
 * Enable a group or groups of hotkeys.
 *
 * @param {string|Array} group The group or groups to enable.
 */
jex.hotkey.enable_group = function(group) {
  group = rocket.arrayify(group);

  for (var i = 0, len = group.length; i < len; ++i) {
    jex.hotkey.active_groups_.push(group[i]);
  }

  // @param {(Array|rocket.Elements)} array The Array.
  // @param {function(this:Object, Object, number, Object):Object} fnct
  // The function to call for every value in this Array.
  // @param {Object=} opt_self The value to use as this when executing the function.
  // @return {Array}

  // Remove duplicates
  jex.hotkey.active_groups_ = rocket.filter(
      jex.hotkey.active_groups_,

      function(needle, index, haystack) {
        haystack = /** @type {Array} */ (haystack);
        var foo = (rocket.indexOf(haystack, needle) === index);
        return foo;
      }
      );
};


/**
 * Disable a group or groups of hotkeys.
 *
 * @param {string|Array} group The group or groups to disable. Disabled groups
 * still exist and can be re-enabled. If you wish to remove a group entirely,
 * use remove_group().
 */
jex.hotkey.disable_group = function(group) {
  group = rocket.arrayify(group);

  for (var i = 0, len = group.length; i < len; ++i) {
    jex.hotkey.active_groups_.splice(
        rocket.indexOf(jex.hotkey.active_groups_, group[i]),
        1
    );
  }

  // Remove the document event listener if necessary.
  jex.hotkey.check_listener_();
};


/**
 * Set the currently active group or groups.
 *
 * @param {string|Array.<string>} group The group or groups to make active. All
 * currently active groups not in this list will be disabled.
 */
jex.hotkey.set_group = function(group) {
  jex.hotkey.active_groups_ = rocket.arrayify(group);

  // Remove the document event listener if necessary.
  jex.hotkey.check_listener_();
};


/**
 * Remove all hotkeys. Only bother if there are known hotkeys to check for in
 * the first place.
 */
jex.hotkey.remove_all = function() {
  if (jex.hotkey.is_active_ === true) {
    // Get rid of all of the hotkeys.
    jex.hotkey.hotkeys_ = {};

    // Reset the active group.
    jex.hotkey.active_groups_ = [''];

    // Remove the document event listener if necessary.
    jex.hotkey.check_listener_();
  }
};


/**
 * Take a hotkey and fix it up by removing extra spaces, ordering modifiers,
 * and swapping a few things out to allow synonyms like ins/insert.
 *
 * @private
 *
 * @param {string} hotkey The original hotkey.
 *
 * @return {string} The normalized hotkey.
 */
jex.hotkey.normalize_ = function(hotkey) {
  // Fix up provided hotkey a bit. This removes extra spaces in, before, and
  // after the hotkey and sets it to lowercase.
  hotkey = rocket.trim(hotkey).replace(/\s{2,}/g, ' ').toLowerCase();

  // Without breaking down the entire keycode, make sure modifier keys all
  // appear in the proper order.
  hotkey = hotkey.replace('ctrl+shift', 'shift+ctrl');
  hotkey = hotkey.replace('alt+shift', 'shift+alt');
  hotkey = hotkey.replace('alt+ctrl', 'ctrl+alt');
  hotkey = hotkey.replace('shift+alt+ctrl', 'shift+ctrl+alt');
  hotkey = hotkey.replace('ctrl+shift+alt', 'shift+ctrl+alt');
  hotkey = hotkey.replace('ctrl+alt+shift', 'shift+ctrl+alt');
  hotkey = hotkey.replace('alt+shift+ctrl', 'shift+ctrl+alt');
  hotkey = hotkey.replace('alt+ctrl+shift', 'shift+ctrl+alt');

  // The 'plus' key is kind of special because it's used in the hotkey
  // definitions. This just makes it possible to use the string 'plus' if you
  // don't like seeing things like 'ctrl++'.
  hotkey = hotkey.replace('plus', '+');

  // Allow the use of 'return' instead of 'enter'.
  hotkey = hotkey.replace('return', 'enter');

  // Some more alternative keys. Note that if the replacement contains the
  // alias, then we have to use a more careful replacement to prevent 'escape'
  // from becoming 'escapeape'.
  hotkey = hotkey.replace(/\bins\b/g, 'insert');
  hotkey = hotkey.replace(/\bdel\b/g, 'delete');
  hotkey = hotkey.replace(/\besc\b/g, 'escape');
  hotkey = hotkey.replace('pgup', 'pageup');
  hotkey = hotkey.replace('pgdn', 'pagedown');
  hotkey = hotkey.replace('pgdown', 'pagedown');
  hotkey = hotkey.replace('break', 'pause');

  return hotkey;
};


/**
 * This handler executes when there are hotkeys to track on the page. It
 * appends to the current hotkey and runs any associated callbacks if a hotkey
 * was activated.
 *
 * @private
 *
 * @param {Event} e The event.
 */
jex.hotkey.keydown_handler_ = function(e) {
  // Not sure why I have to do this for closure. It should be able to know this.
  var target = /** @type {Element} */ (e.target);

  var target_is_input = (
      target.tagName === 'INPUT' ||
      target.tagName === 'SELECT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable === true
      );

  // For inputs, don't allow combination hotkeys (for now). Otherwise typing
  // something into an input and then pressing "enter" might trigger "j o n
  // enter" as the hotkey, which isn't really desirable. To prevent that,
  // hotkeys inside of inputs can only be single keystrokes (modifiers are
  // allowed).
  if (target_is_input === true) {
    jex.hotkey.reset_();
  }

  // Since the e parameter has to be of type {Event} for internal reasons, even
  // though it's a {rocket.Event}, cast it back right here so I can get access
  // to e.originalEvent.
  e = /** @type {rocket.Event} */ (e);

  // Ok this works but "a ctrl" will be replaced with "ctrl"
  /*  if (e.originalEvent.shiftKey === true || e.originalEvent.ctrlKey === true || e.originalEvent.altKey === true) {
    jex.console.log('modifier key down; before replace: "' + jex.hotkey.current_hotkey_ + '"');
    jex.hotkey.current_hotkey_ = jex.hotkey.current_hotkey_.replace(/ ?[\+a-z]+$/, '');
    // jex.hotkey.current_hotkey_ = jex.hotkey.current_hotkey_.replace(/ ?shift$| ?ctrl$| ?alt$| ?shift\+ctrl$| ?shift\+alt$| ?ctrl\+alt$| ?shift\+ctrl\+alt$/, '');
  }*/

  // TODO: this doesn't guarantee order. ctrl+shift isn't the same as shift+ctrl
  // as the modifiers get added in the order the keys are pressed...I have to
  // guarantee the order the modifiers will show up. It's because pressing ctrl
  // will be a key, then pressing additional keys will add modifiers to it...the
  // modifiers always appear in the same order but the original key screws it
  // up.

  // Add modifer keys to everything except for the modifier keys...that way
  // 'alt' doesn't come across as 'alt+alt'.
  var map = 'keycode_map_';
  var modifier_string = '';
  if (e.originalEvent.shiftKey === true && e.which !== 16) {
    if (jex.hotkey.shift_keycode_map_[e.which + '']) {
      map = 'shift_keycode_map_';
    }
    else {
      // jex.console.log('shift down; before replace: "' + jex.hotkey.current_hotkey_ + '"');
      // jex.hotkey.current_hotkey_ = jex.hotkey.current_hotkey_.replace(/ ?[\+a-z]+$/, '');
      // jex.hotkey.current_hotkey_ = jex.hotkey.current_hotkey_.replace(/ ?shift\+?/, '');
      // jex.console.log('adding shift to modifier string');
      modifier_string += 'shift+';
    }
  }
  if (e.originalEvent.ctrlKey === true && e.which !== 17) {
    // jex.console.log('ctrl down; before replace: "' + jex.hotkey.current_hotkey_ + '"');
    // jex.hotkey.current_hotkey_ = jex.hotkey.current_hotkey_.replace(/ ?[\+a-z]+$/, '');
    // jex.hotkey.current_hotkey_ = jex.hotkey.current_hotkey_.replace(/ ?ctrl\+?/, '');
    // jex.console.log('adding ctrl to modifier string');
    modifier_string += 'ctrl+';
  }
  if (e.originalEvent.altKey === true && e.which !== 18) {
    // jex.console.log('alt down; before replace: "' + jex.hotkey.current_hotkey_ + '"');
    // jex.hotkey.current_hotkey_ = jex.hotkey.current_hotkey_.replace(/ ?[\+a-z]+$/, '');
    // jex.hotkey.current_hotkey_ = jex.hotkey.current_hotkey_.replace(/ ?alt\+?/, '');
    // jex.console.log('adding alt to modifier string');
    modifier_string += 'alt+';
  }

  // jex.console.log('mod string = "' + modifier_string + '"');

  // Append the current keycode to the current hotkey. Ignore keycodes that are
  // not defined.
  if (jex.hotkey[map][e.which]) {
    if (jex.hotkey.current_hotkey_ !== '') {
      jex.hotkey.current_hotkey_ += ' ';
    }

    // jex.hotkey.current_hotkey_ += modifier_string;

    // The closure compiler can't/won't type check properly when using string
    // keys.
    jex.hotkey.current_hotkey_ += /** @type {string} */ (jex.hotkey[map][e.which]);
  }

  // 1. a b c ctrl+enter doesn't work
  // 2. need to handle hotkeys inside inputs better
  // jex.console.log('"' + jex.hotkey.current_hotkey_ + '"');

  // At this point we have determined what the current hotkey is. If hotkey
  // pressed, execute that callback and reset.
  var hotkey_pressed = false;
  var hotkey;
  for (var i = 0, len = jex.hotkey.active_groups_.length; i < len; ++i) {
    if (jex.hotkey.hotkeys_[jex.hotkey.active_groups_[i]][jex.hotkey.current_hotkey_]) {
      hotkey = jex.hotkey.hotkeys_[jex.hotkey.active_groups_[i]][jex.hotkey.current_hotkey_];

      // Look for conditions where the hotkey should not execute and handle
      // them.
      if (hotkey.inputs.length > 0) {
        // If the hotkey has inputs attached, then it should only work inside
        // those inputs.
        if (rocket.indexOf(hotkey.inputs, e.target) === -1) {
          jex.hotkey.reset_();
          return;
        }
        // jex.hotkey.reset_();
      }
      else {
        // If the hotkey does not have inputs attached, then it should not
        // trigger inside of inputs (or editable fields) so you can type in
        // them.
        if (target_is_input === true) {
          jex.hotkey.reset_();
          return;
        }
      }
      hotkey_pressed = true;
      hotkey.callback();
    }
  }

  // Callbacks have already been executed. Now, if a hotkey was pressed, reset
  // the hotkey so we can start over. Otherwise reset the timeout to allow for
  // another key to be pressed.
  if (hotkey_pressed === true) {
    jex.hotkey.reset_();
    e.preventDefault();
  }
  if (hotkey_pressed === false) {
    clearTimeout(jex.hotkey.sequence_timeout_handle_);
    jex.hotkey.sequence_timeout_handle_ = setTimeout(
        jex.hotkey.reset_,
        jex.hotkey.sequence_timeout_
        );
  }
};


/**
 * Clear the current hotkey and remove the timer.
 *
 * @private
 */
jex.hotkey.reset_ = function() {
  clearTimeout(jex.hotkey.sequence_timeout_handle_);
  jex.hotkey.current_hotkey_ = '';
};



/**
 * This provides a cross-browser way of watching for the hashchange event.
 * Modern browsers with support for onhashchange will use their
 * implementation, while older browsers will use polling every 100ms. Support
 * for back/forward in older browsers is also baked in.
 *
 * Note: Support for IE running in compatibility mode or legacy browser modes
 * is hit and miss. This works down to IE6 as long as you're not doing that.
 *
 * Tested:
 * <ul>
 * <li>Chrome 33 - ?</li>
 * <li>FF 22 - ?</li>
 * <li>IE 7 - ?</li>
 * <li>IE 8 - ?</li>
 * <li>IE 9 - ?</li>
 * <li>IE 10 - ?</li>
 * <li>IE 11 - ?</li>
 * </ul>
 *
 * @example var hashchange = new jex.hashchange();
 * hashchange.addEventListener('hashchange', function() { // Do something. });
 *
 * @extends {rocket.EventTarget}
 *
 * @constructor
 */
jex.hashchange = function() {
  var self = this;

  // Start things off the same.
  this.hash_ = location.hash;

  // http://tanalin.com/en/articles/ie-version-js/
  if (jex.ie.less_than(8) === true) {
    this.iframe_ = rocket.createElement('iframe');
    rocket.$('body').appendChild(this.iframe_);
    this.iframe_
    // .hide()
      .setAttribute({
          'src': 'javascript:void(0)'
        });
  }

  // http://stackoverflow.com/a/4030510
  if ('onhashchange' in window) {
    window.onhashchange = function() {
      self.dispatchEvent('hashchange');
    };
  } else {
    rocket.setInterval(function() {
      self.check_();
    }, 1000);
  }
};
rocket.inherits(jex.hashchange, rocket.EventTarget);


/**
 * The iFrame used to enable the back/forward buttons in IE7 and before.
 *
 * @private
 *
 * @type {rocket.Elements}
 */
jex.hashchange.prototype.iframe_;


/**
 * The current hash. This is only used when polling manually for changes as a
 * way to compare the existing hash with the hash on the window.
 *
 * @private
 *
 * @type {string}
 */
jex.hashchange.prototype.hash_;


/**
 * Check to see if the hash on the window changed. If so, trigger the
 * hashchange event. For older browsers, look at the hash on the iFrame as
 * well since that's what changes when navigation occurs.
 *
 * @private
 */
jex.hashchange.prototype.check_ = function() {
  if (location.hash !== this.hash_) {
    this.set_(location.hash);
    this.dispatchEvent('hashchange');
  }
  else if (this.iframe_) {
    var iframe = /** @type {!HTMLIFrameElement} */ (this.iframe_[0]);
    if (iframe.contentWindow.location.hash !== this.hash_) {
      this.set_(iframe.contentWindow.location.hash);
      this.dispatchEvent('hashchange');
    }
  }
};


/**
 * Set the internally stored hash (used for comparison when polling for
 * changes) as well as the has stored inside the iFrame.
 *
 * @private
 *
 * @param {string} hash The hash to set.
 */
jex.hashchange.prototype.set_ = function(hash) {
  this.hash_ = hash;
  if (this.iframe_) {
    // Closure needed some help...
    var iframe = /** @type {!HTMLIFrameElement} */ (this.iframe_[0]);
    /** @type {!HTMLDocument} */ (iframe.contentWindow.document).open();
    /** @type {!HTMLDocument} */ (iframe.contentWindow.document).close();
    iframe.contentWindow.location.hash = hash;
  }
};


/**
 * Version number for this release.
 *
 * @const
 */
jex.version = '15.03';
