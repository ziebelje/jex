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
 * @param {Object} message The message to output to the console.
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
 * @param {Object} message The message to output to the console.
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
 * @param {Object} message The message to output to the console.
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
 * @param {Object} message The message to output to the console.
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
 * @param {Object} message The message to output to the console.
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
 * Wrapper for native console.clear().
 *
 * @see https://developers.google.com/chrome-developer-tools/docs/console-api#consoleclear
 */
jex.console.clear = function() {
  jex.console.add_to_buffer_('clear', arguments);
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
 * <li>IE 6 - OK</li>
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
 * elements inside the table.
 *
 * Tested:
 * <ul>
 * <li>Chrome 30 - OK</li>
 * <li>IE 10 - OK</li>
 * </ul>
 *
 * @example
 * // Create a table with one row and one column.
 * var table = new jex.table();
 *
 * @example
 * // Create a table with four rows and one column
 * var table = new jex.table({'rows': 4});
 *
 * @example
 * // Create a table with four columns and one row.
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
 * @constructor
 *
 * @param {{rows: number, columns: number, header: boolean}} options
 * rows: How many rows are in the table. Default 1.<br/>
 * columns: How many columns are in the table. Default 1.<br/>
 * header: Whether or not a thead is placed on the table. A thead counts as
 * one of your rows. Default false.
 */
jex.table = function(options) {
  var rows = options.rows || 1;
  var columns = options.columns || 1;

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
    this.thead_ = rocket.createElement('thead');
    tr = this.render_tr_(columns, 'th');
    this.trs_.push(tr);
    this.thead_.appendChild(tr);
    this.table_.appendChild(this.thead_);
    rows--;
  }

  var tbody = rocket.createElement('tbody');
  for (var i = 0; i < rows; i++) {
    tr = this.render_tr_(columns, 'td');
    this.trs_.push(tr);
    this.tbody_.appendChild(tr);
  }

  this.table_.appendChild(this.tbody_);
};


/**
 * Renders a tr with a specific number of columns.
 *
 * @private
 *
 * @param {number} columns The number of columns.
 * @param {string} cell_type
 *
 * @return {rocket.Elements}
 */
jex.table.prototype.render_tr_ = function(columns, cell_type) {
  var tr = rocket.createElement('tr');
  var tds = [];
  var cell;
  for (var i = 0; i < columns; i++) {
    cell = rocket.createElement(cell_type);
    tds.push(cell);
    tr.appendChild(cell);
  }
  this.tds_.push(tds);
  return tr;
};


/**
 * Fills a row in the table with the given data.
 *
 * @param {number} row The index of the row to fill in.
 * @param {Array.<string>} data The data to put in the row.
 */
jex.table.prototype.fill_row = function(row, data) {
  var column = 0;
  var len = data.length;
  for (; column < len; column++) {
    this.td(column, row).innerHTML(data[column]);
  }
};


/**
 * Get the actual table element from this instance of the jex.table class.
 *
 * @return {rocket.Elements} The actual table element.
 */
jex.table.prototype.table = function() {
  return this.table_;
};


/**
 * Get the actual tbody element from this instance of the jex.table class.
 *
 * @return {rocket.Elements} The actual tbody element.
 */
jex.table.prototype.tbody = function() {
  return this.tbody_;
};


/**
 * Get the actual tr element at the specified index.
 *
 * @param {number} row The index of the row to fetch. Includes the header row.
 *
 * @return {rocket.Elements} The actual tr element.
 */
jex.table.prototype.tr = function(row) {
  return this.trs_[row];
};


/**
 * Get the actual td element at the specified row/column index. The arguments
 * are ordered such that x and y both increment moving outward to the right
 * and down from the origin (top left).
 *
 * @param {number} column The index of the column the td is located in.
 * @param {number} row The index of the row the td is located in. Includes the
 * header row.
 *
 * @return {rocket.Elements} The actual td element.
 */
jex.table.prototype.td = function(column, row) {
  // The arguments get swapped because it's more convenient to store tds as they
  // get placed into the tr, which means they are organized somewhat counter-
  // intuitively.
  return this.tds_[row][column];
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
//todo: change object type to * since it can really be anything, not just objects



/**
 * Nice prettyprinting of JavaScript objects to HTML. Supports color schemes
 * and otherwise produces output fairly similar to that of the native
 * JSON.prettyprint.
 *
 * Tested:
 * <ul>
 * <li>Chrome 30 - OK</li>
 * <li>FF 24 - OK</li>
 * <li>FF 25 - OK</li>
 * <li>IE 7 - At the very least, will not iterate over any keys in an object
 * with the key "constructor" as it's not enumerable and is reserved so it
 * doesn't change.</li>
 * <li>IE 8 - At the very least, will not iterate over any keys in an object
 * with the key "constructor" as it's not enumerable and is reserved so it
 * doesn't change.</li>
 * <li>IE 9 - OK</li>
 * <li>IE 10 - OK</li>
 * </ul>
 *
 * @example
 * // Prettyprint an object with the defaults.
 * var object = {'foo': 'bar'};
 * prettyprint = new jex.prettyprint({'object': object});
 * prettyprint.decorate($("#prettyprint"));
 *
 * @example
 * // Prettyprint an object with the light color scheme.
 * var object = {'foo': 'bar'};
 * prettyprint = new jex.prettyprint({'object': object, 'color_scheme': 'light'});
 * prettyprint.decorate($("#prettyprint"));
 *
 * @example
 * // Prettyprint an object with a custom color scheme.
 * var object = {'foo': 'bar'};
 * prettyprint = new jex.prettyprint({'object': object, 'color_scheme': {'string': 'blue'}});
 * prettyprint.decorate($("#prettyprint"));
 *
 * @example
 * // Prettyprint any type of object.
 * var object = {'number': 1, 'string': 'string', 'array': [1, 2, 3], 'object': {'a': 1, 'b': 2}};
 * prettyprint = new jex.prettyprint({'object': object});
 * prettyprint.decorate($("#prettyprint"));
 *
 * @param {{object: Object, color_scheme: (string|Object), display_line_numbers: boolean}} options
 * object: The object to prettyprint. Required.<br/>
 * color_scheme: The color scheme. Either 'light', 'dark', or an object with
 * the custom scheme. Default 'dark'.<br/>
 * display_line_numbers: Whether or not to display line numbers. Default true.
 *
 * @constructor
 */
jex.prettyprint = function(options) {
  this.object_ = options.object;

  // Defaults
  var color_scheme = options.color_scheme || 'dark';
  if (options.display_line_numbers !== undefined) {
    this.display_line_numbers_ = options.display_line_numbers;
  }
  else {
    this.display_line_numbers_ = true;
  }

  // Default color scheme
  this.color_scheme_ = {};
  if (jex.type(color_scheme) === 'string') {
    rocket.extend(
        this.color_scheme_,
        jex.prettyprint.color_schemes_[/** @type {string} */ (color_scheme)]
    );
  }
  else {
    rocket.extend(
        this.color_scheme_,
        /** @type {Object} */ (color_scheme)
    );
  }
};


/**
 * The number of spaces to indent for each level.
 *
 * @private
 *
 * @type {number}
 */
jex.prettyprint.indent_amount_ = 2;


/**
 * The color to use then a custom color scheme is used but a needed text color
 * is not specified.
 *
 * @private
 *
 * @type {string}
 */
jex.prettyprint.default_text_color_ = '#000000';


/**
 * The color to use then a custom color scheme is used but the background
 * color is unspecified.
 *
 * @private
 *
 * @type {string}
 */
jex.prettyprint.default_background_color_ = '#ffffff';


/**
 * A couple color schemes for quick use. Taken pretty much directly from
 * Sublime Text 2.
 *
 * @private
 *
 * @type {Object.<string, Object.<string, string>>}
 */
jex.prettyprint.color_schemes_ = {
  'dark': {
    'background': '#272822',
    'line_number': '#8f908a',
    'key': '#f8f8f2',
    'colon': '#75715e',
    'string': '#e6db74',
    'number': '#f92672',
    'boolean': '#66d9ef',
    'date': '#f92672',
    'regexp': '#f92672',
    'function': '#66d9ef',
    'null': '#66d9ef',
    'undefined': '#66d9ef',
    'nan': '#66d9ef',
    'default': '#f8f8f2'
  },
  'light': {
    'background': '#ffffff',
    'line_number': '#8f908a',
    'key': '#272822',
    'colon': '#75715e',
    'string': '#baab21',
    'number': '#f92672',
    'boolean': '#66d9ef',
    'date': '#f92672',
    'regexp': '#f92672',
    'function': '#66d9ef',
    'null': '#66d9ef',
    'undefined': '#66d9ef',
    'nan': '#66d9ef',
    'default': '#272822'
  }
};


/**
 * The object to prettyprint.
 *
 * @private
 *
 * @type {Object}
 */
jex.prettyprint.prototype.object_;


/**
 * The current color scheme.
 *
 * @private
 *
 * @type {Object.<string, string>}
 */
jex.prettyprint.prototype.color_scheme_;


/**
 * Whether or not to show line numbers in the output.
 *
 * @private
 *
 * @type {boolean}
 */
jex.prettyprint.prototype.display_line_numbers_;


/**
 * Decorate the provided element with the prettyprinted object.
 *
 * @param {rocket.Elements} element The element to decorate.
 */
jex.prettyprint.prototype.decorate = function(element) {
  var div = rocket.createElement('div');
  div.style({
    'padding': '5px',
    'font-family': 'Consolas, "Courier New", Courier, Monospace',
    'background': this.color_scheme_['background'] || jex.prettyprint.default_background_color_
  });

  var table = rocket.createElement('table');
  table.setAttribute({
    'cellpadding': '0',
    'cellspacing': '0'
  });
  var tbody = rocket.createElement('tbody');

  this.do_prettyprint_(this.object_, tbody);

  table.appendChild(tbody);
  div.appendChild(table);
  element.appendChild(div);
};


/**
 * Recurse over the object and prettyprint it by adding trs to the tbody.
 *
 * @private
 *
 * @param {Object} object The object to prettyprint.
 * @param {rocket.Elements} tbody The tbody to prettyprint into.
 * @param {number=} opt_current_indent The current indent level.
 * @param {number=} opt_line_number The current line number.
 *
 * @return {number} The next line number.
 */
jex.prettyprint.prototype.do_prettyprint_ = function(object, tbody, opt_current_indent, opt_line_number) {
  var current_indent = opt_current_indent || 0;
  var line_number = opt_line_number || 1;

  var tr, line_number_td, value_td;
  if (jex.type(object) === 'array' || jex.type(object) === 'object') {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        tr = this.render_tr_(line_number++);

        value_td = tr.lastElementChild();

        tbody.appendChild(tr);

        value_td.appendChild(this.render_key_(key, current_indent));
        value_td.appendChild(this.render_colon_());

        if (jex.type(object[key]) === 'array' || jex.type(object[key]) === 'object') {
          line_number = this.do_prettyprint_(
              object[key],
              tbody,
              current_indent + jex.prettyprint.indent_amount_,
              line_number
              );
        }
        else {
          value_td.appendChild(this.render_value_(object[key]));
        }
      }
    }
  }
  else {
    tr = this.render_tr_(line_number++);

    value_td = tr.lastElementChild();

    tbody.appendChild(tr);

    value_td.appendChild(this.render_value_(object));
  }

  return line_number;
};


/**
 * Render a tr element for the current row of data. This includes all
 * applicable tds.
 *
 * @private
 *
 * @param {number} line_number The line number for this tr.
 *
 * @return {rocket.Elements} The tr.
 */
jex.prettyprint.prototype.render_tr_ = function(line_number) {
  var tr = rocket.createElement('tr');

  if (this.display_line_numbers_ === true) {
    var line_number_td = rocket.createElement('td')
      .style({'text-align': 'right'})
      .setAttribute({'valign': 'top'});
    line_number_td.appendChild(this.render_line_number_(line_number));
    tr.appendChild(line_number_td);
  }

  var value_td = rocket.createElement('td');
  tr.appendChild(value_td);

  return tr;
};


/**
 * Render the line number.
 *
 * @private
 *
 * @param {number} line_number The line number.
 *
 * @return {rocket.Elements} The element containing the line number.
 */
jex.prettyprint.prototype.render_line_number_ = function(line_number) {
  var span = rocket.createElement('span');
  span.innerHTML(line_number + '')
    .style({
        'margin-right': '15px',
        'color': this.color_scheme_['line_number'] || jex.prettyprint.default_text_color_
      });
  return span;
};


/**
 * Render the object key at the specified indent level.
 *
 * @private
 *
 * @param {string} key The key for this element in the object.
 * @param {number} indent The indent level for this key.
 *
 * @return {rocket.Elements} The element containing the key.
 */
jex.prettyprint.prototype.render_key_ = function(key, indent) {
  var style = {
    'color': this.color_scheme_['key'] || jex.prettyprint.default_text_color_
  };
  var span = rocket.createElement('span');
  span.innerHTML(rocket.padLeft('', indent).replace(/ /g, '&nbsp;') + key)
    .style(style);
  return span;
};


/**
 * Render the colon to separate the key and the value
 *
 * @private
 *
 * @return {rocket.Elements} The element containing the colon.
 */
jex.prettyprint.prototype.render_colon_ = function() {
  var style = {
    'color': this.color_scheme_['colon'] || jex.prettyprint.default_text_color_
  };
  var span = rocket.createElement('span');
  span.innerHTML(': ')
    .style(style);
  return span;
};


/**
 * Render the value with the appropriate style per the color scheme.
 *
 * @private
 *
 * @param {Object} value The value.
 *
 * @return {rocket.Elements} The element containing the value.
 */
jex.prettyprint.prototype.render_value_ = function(value) {
  var type = jex.type(value);

  var display_value = rocket.htmlEntities(value + '');
  var style = {
    'color': this.color_scheme_[type] || jex.prettyprint.default_text_color_
  };

  // A couple types have specialized values.
  switch (type) {
    case 'string':
      display_value = '"' + display_value + '"';
      break;
    case 'null':
      display_value = 'null';
      style.fontStyle = 'italic';
      break;
    case 'undefined':
      display_value = 'undefined';
      style.fontStyle = 'italic';
      break;
    case 'nan':
      display_value = 'NaN';
      style.fontStyle = 'italic';
      break;
  }

  var span = rocket.createElement('span');
  span
    .innerHTML(display_value)
    .style(style);
  return span;
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
 * @namespace
 */
jex.hotkey = {};


/**
 * A list of all defined hotkeys. These are organized first by group and then
 * by hotkey.
 *
 * @private
 *
 * @type {Object.<string, Object.<string, {callback: Function, inputs:
 * Array.<Element>}>>}
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
    // Normalize the hotkey
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

  // Some more alternative keys.
  hotkey = hotkey.replace('ins', 'insert');
  hotkey = hotkey.replace('del', 'delete');
  hotkey = hotkey.replace('pgup', 'pageup');
  hotkey = hotkey.replace('pgdn', 'pagedown');
  hotkey = hotkey.replace('pgdown', 'pagedown');
  hotkey = hotkey.replace('break', 'pause');
  hotkey = hotkey.replace('esc', 'escape');

  return hotkey;
};


/**
 * [keydown_handler_ description]
 *
 * @private
 *
 * @param {Event} e [description]
 */
jex.hotkey.keydown_handler_ = function(e) {
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
 * This class is used to send API requests to a Cora API. It handles building
 * the API call and can optionally execute a callback in the event of a
 * success/failure.
 *
 * @constructor
 */
jex.cora_request = function() {
  this.api_calls_ = [];
  this.xhr_ = new rocket.XMLHttpRequest();
};


/**
 * A list of API calls to make in this request. More than one here will send a
 * multi API-call request.
 *
 * @private
 *
 * @type {Array}
 */
jex.cora_request.prototype.api_calls_;


/**
 * The XHR object to use for this request.
 *
 * @private
 *
 * @type {rocket.XMLHttpRequest}
 */
jex.cora_request.prototype.xhr_;


/**
 * Function to call upon success.
 *
 * @private
 *
 * @type {Function}
 */
jex.cora_request.prototype.success_callback_;


/**
 * Function to call upon failure.
 *
 * @private
 *
 * @type {Function}
 */
jex.cora_request.prototype.error_callback_;


/**
 * Time API request execution began.
 *
 * @private
 *
 * @type {Date}
 */
jex.cora_request.prototype.execution_start_;


/**
 * Time API request execution ended.
 *
 * @private
 *
 * @type {Date}
 */
jex.cora_request.prototype.execution_end_;


/**
 * The API URI. Hardcode this to wherever the API is at.
 *
 * @private
 *
 * @type {string}
 */
jex.cora_request.api_uri_;


/**
 * The API Key. Hardcode this to the API key.
 *
 * @private
 *
 * @type {string}
 */
jex.cora_request.api_key_;


/**
 * Add an API call to this request. If more than one is added, this will
 * become a batch request.
 *
 * @param {string} resource The resource.
 * @param {string} method The method.
 * @param {Object=} opt_arguments The arguments.
 * @param {string=} opt_alias The alias.
 *
 * @return {jex.cora_request.api_call} The API call that was actually added.
 */
jex.cora_request.prototype.add_api_call = function(resource, method, opt_arguments, opt_alias) {
  var api_call = new jex.cora_request.api_call(resource, method, opt_alias);
  if (opt_arguments) {
    api_call.set_arguments(opt_arguments);
  }
  this.api_calls_.push(api_call);
  return api_call;
};


/**
 * Remove a specific API call from this API request. In general only useful if
 * you have a particular reason why this changed API request should override
 * whatever request you previously sent.
 *
 * @param {jex.cora_request.api_call} api_call The api_call to remove.
 */
jex.cora_request.prototype.remove_api_call = function(api_call) {
  this.api_calls_.splice(rocket.indexOf(this.api_calls_, api_call), 1);
};


/**
 * Remove all API calls from this API request. In general only useful if
 * you have a particular reason why this changed API request should override
 * whatever request you previously sent.
 */
jex.cora_request.prototype.remove_all_api_calls = function() {
  this.api_calls_ = [];
};


/**
 * Send this API request to the server. It will grab whatever the current API
 * calls are so you can technically send the same request twice but have it be
 * different. The benefit here is that if you re-use the same request it will
 * cancel the previouslly sent request if it is not complete. This means that
 * if you send two API calls from an autocomplete field really quickly, you
 * can guarantee that the second request will cancel the first one so the
 * callbacks on the first API request do not get executed after the second one
 * if that API request happens to take longer.
 */
jex.cora_request.prototype.send = function() {
  var self = this;

  // Reset times so they are gone in case of error.
  delete this.execution_start_;
  delete this.execution_end_;

  this.xhr_.data = {};
  if (this.api_calls_.length === 1) {
    rocket.extend(this.xhr_.data, this.api_calls_[0].get_object());
  }
  else {
    this.xhr_.data.batch = [];
    for (var i = 0, len = this.api_calls_.length; i < len; ++i) {
      // Auto-set the alias if it was not provided for a batch API call.
      if (!this.api_calls_[i].get_alias()) {
        this.api_calls_[i].set_alias(this.api_calls_[i].get_resource() + '.' + this.api_calls_[i].get_method());
      }
      this.xhr_.data.batch.push(this.api_calls_[i].get_object());
    }
    this.xhr_.data.batch = rocket.JSON.stringify(this.xhr_.data.batch);
  }

  this.xhr_.data.api_key = jex.cora_request.api_key_;
  this.xhr_.open('POST', jex.cora_request.api_uri_);
  this.xhr_.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  this.xhr_.addEventListener('success', function() {
    self.execution_end_ = new Date();
    try {
      var response = rocket.JSON.parse(this.responseText);
    }
    catch (e) {
      jex.console.error('API call failed (could not decode JSON)');
      if (self.error_callback_) {
        self.error_callback_();
        return;
      }
    }

    if (response.success === false) {
      jex.console.error('API call failed (success false)');
      if (self.error_callback_) {
        self.error_callback_();
      }
    }
    else {
      if (self.success_callback_) {
        self.success_callback_(response.data);
      }
    }
  });

  this.xhr_.addEventListener('error', function() {
    jex.console.error('API call failed (status not 200)');
    self.execution_end_ = new Date();
    if (self.error_callback_) {
      self.error_callback_();
    }
  });

  this.execution_start_ = new Date();
  this.xhr_.send();
};


/**
 * Aborts the current request. Callbacks will not fire but the server will
 * continue executing whatever it wants.
 */
jex.cora_request.prototype.abort = function() {
  this.xhr_.abort();
};


/**
 * Get the API call execution time in milliseconds
 * @return {[type]} [description]
 */
jex.cora_request.prototype.get_execution_time = function() {
  if (this.execution_end_ && this.execution_start_) {
    return this.execution_end_.getTime() - this.execution_start_.getTime();
  }
  else {
    return null; // todo: throw an error?
  }
};


/**
 * Set the success callback function.
 *
 * @param {Function} success_callback The function to call if the API request
 * succeeded. A single data argument will be passed to the callback that
 * contains the data key from the response.
 */
jex.cora_request.prototype.set_success_callback = function(success_callback) {
  this.success_callback_ = success_callback;
};


/**
 * Set the error callback function.
 *
 * @param {Function} error_callback The function to call if the API request
 * failed. A single data argument will be passed to the callback that contains
 * the data key from the response.
 */
jex.cora_request.prototype.set_error_callback = function(error_callback) {
  this.error_callback_ = error_callback;
};


/**
 * Set the API URI.
 *
 * @param {string} api_uri The API URI to set.
 */
jex.cora_request.set_api_uri = function(api_uri) {
  jex.cora_request.api_uri_ = api_uri;
};


/**
 * Set the API Key.
 *
 * @param {string} api_key The API Key to set.
 */
jex.cora_request.set_api_key = function(api_key) {
  jex.cora_request.api_key_ = api_key;
};



/**
 * This is a super-basic API call class that basically just holds data for the
 * POST parameters and exposes a method to make it easy to change the
 * arguments.
 *
 * @param {string} resource The resource.
 * @param {string} method The method.
 * @param {string|undefined=} opt_alias The alias.
 *
 * @constructor
 */
jex.cora_request.api_call = function(resource, method, opt_alias) {
  this.resource_ = resource;
  this.method_ = method;
  this.alias_ = opt_alias;
};


/**
 * Resource.
 *
 * @private
 *
 * @type {string}
 */
jex.cora_request.prototype.resource_;


/**
 * Method.
 *
 * @private
 *
 * @type {string}
 */
jex.cora_request.prototype.method_;


/**
 * Alias.
 *
 * @private
 *
 * @type {string}
 */
jex.cora_request.prototype.alias_;


/**
 * Arguments.
 *
 * @private
 *
 * @type {Object}
 */
jex.cora_request.prototype.arguments_;


/**
 * Set the arguments.
 *
 * @param {Object} args The arguments. With Cora, all arguments are
 * objects/associative arrays.
 */
jex.cora_request.api_call.prototype.set_arguments = function(args) {
  this.arguments_ = args;
};


/**
 * Set the alias.
 *
 * @param {string} alias The API call alias.
 */
jex.cora_request.api_call.prototype.set_alias = function(alias) {
  this.alias_ = alias;
};


/**
 * Get the alias.
 *
 * @return {string} alias The API call alias.
 */
jex.cora_request.api_call.prototype.get_alias = function() {
  return this.alias_;
};


/**
 * Get the resource.
 *
 * @return {string} resource The API call resource.
 */
jex.cora_request.api_call.prototype.get_resource = function() {
  return this.resource_;
};


/**
 * Get the method.
 *
 * @return {string} method The API call method.
 */
jex.cora_request.api_call.prototype.get_method = function() {
  return this.method_;
};


/**
 * Return the API call object prepped and ready to send to Cora. This excludes
 * the alias and arguments if not set because they are not strictly required.
 *
 * @return {Object} An object representing the API call.
 */
jex.cora_request.api_call.prototype.get_object = function() {
  var object = {
    'resource': this.resource_,
    'method': this.method_
  };

  if (this.alias_) {
    object.alias = this.alias_;
  }

  if (this.arguments_) {
    object.arguments = rocket.JSON.stringify(this.arguments_);
  }

  return object;
};


/**
 * Get or set cookie.
 *
 * @param {string} name The name of the cookie to get.
 * @param {string} value The value to set.
 *
 * @link http://stackoverflow.com/questions/5639346/shortest-function-for-reading-a-cookie-in-javascript
 *
 * @return {string} The value stored in that cookie.
 */
jex.cookie = function(name, value) {
  if (arguments.length === 1) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  }
};


/**
 * Version number for this release.
 *
 * @const
 */
jex.version = '14.01';
