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
 * @namespace
 * @const
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
 * @param {string} message The message to output to the console.
 */
jex.console.log = function(message) {
  jex.console.add_to_buffer_('log', arguments);
  jex.console.flush_buffer_();
};


/**
 * Wrapper for native console.error().
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
 * @param {string} message The message to output to the console.
 */
jex.console.debug = function(message) {
  jex.console.add_to_buffer_('debug', arguments);
  jex.console.flush_buffer_();
};


/**
 * Wrapper for native console.warn().
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
 * @param {string} message The message to output to the console.
 */
jex.console.info = function(message) {
  jex.console.add_to_buffer_('info', arguments);
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
 * Returns the type of the provided object. It's pretty good but isn't
 * consistent cross-browser for odd things like window and doesn't support
 * custom types. It is, however, good for at least the following types, which
 * is what this function was designed for: null, undefined, boolean, number,
 * string, date, regexp, object, array, function, nan.
 *
 * Tested:
 * <ul>
 * <li>Chrome 30 - OK</li>
 * <li>IE 7 - OK</li>
 * <li>IE 8 - OK</li>
 * <li>IE 9 - OK</li>
 * <li>IE 10 - OK</li>
 * <li>IE 11 - OK</li>
 * </ul>
 *
 * @link http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
 *
 * @param {Object} object The object to get the type for.
 *
 * @return {string} The actual type of the object.
 */
jex.type = function(object) {
  // The generic type check doesn't work with null/undefined in IE8 or less.
  if (object === null) {
    return 'null';
  }
  else if (object === undefined) {
    return 'undefined';
  }

  var type = ({}).toString.call(object).match(/\s([a-zA-Z]+)/)[1].toLowerCase();

  // Because NaN is oddly a 'number'...
  if (type === 'number' && isNaN(object)) {
    return 'nan';
  }
  else {
    return type;
  }
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
 * @param {{rows: number, columns: number, header: boolean}} options
 * rows: How many rows are in the table. Default 1.<br/>
 * columns: How many columns are in the table. Default 1.<br/>
 * header: Whether or not a thead is placed on the table. A thead counts as
 * one of your rows. Default false.
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
 */
jex.table = function(options) {
  var rows = options.rows || 1;
  var columns = options.columns || 1;

  this.table_ = rocket.createElement('table');
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
    this.td(row, column).innerHTML(data[column]);
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
 * Get the actual td element at the specified row/column index.
 *
 * @param {number} row The index of the row the td is located in. Includes the
 * header row.
 * @param {number} column The index of the column the td is located in.
 *
 * @return {rocket.Elements} The actual td element.
 */
jex.table.prototype.td = function(row, column) {
  return this.tds_[row][column];
};


/**
 * Debug namespace for JeX. Debugging utilities go here. Console is exempt
 * only for brevity of those function calls.
 *
 * @namespace
 *
 * @const
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



/**
 * Add placeholder text to an element. If the browser already natively
 * implements placeholder text, then that implementation takes precedence. This
 * does not support password or select fields.
 *
 * Tested:
 * <ul>
 * <li>Chrome 30 - OK</li>
 * <li>IE 10 - OK</li>
 * </ul>
 *
 * @param {{class_name: string}} options
 * class_name: The name of the class to apply when the placeholder is active.
 * Default "jex_placeholder".
 *
 * @example
 * // Create an input and add a placeholder
 * var input = $.createElement('input').setAttribute('placeholder', 'First Name');
 * var placeholder = new jex.placeholder();
 * placeholder.decorate(input);
 *
 * @example
 * // Create an input and add a placeholder with a custom class
 * var input = $.createElement('input').setAttribute('placeholder', 'First Name');
 * var placeholder = new jex.placeholder({'class_name': 'my_placeholder_class'});
 * placeholder.decorate(input);
 *
 * @example
 * // Undecorate an input
 * var input = $.createElement('input').setAttribute('placeholder', 'First Name');
 * var placeholder = new jex.placeholder();
 * placeholder.decorate(input);
 * placeholder.undecorate();
 *
 * @constructor
 */
jex.placeholder = function(options) {
  if (options && options.class_name) {
    jex.placeholder.class_name_ = options.class_name;
  }
};


/**
 * Whether or not the element is currently decorated.
 *
 * @private
 *
 * @type {boolean}
 */
jex.placeholder.prototype.decorated_ = false;


/**
 * The element to get placeholder text.
 *
 * @private
 *
 * @type {rocket.Elements}
 */
jex.placeholder.prototype.element_;


/**
 * The placeholder text.
 *
 * @private
 *
 * @type {string}
 */
jex.placeholder.prototype.placeholder_text_;


/**
 * Whether or not the browser has native support for placeholders.
 *
 * @private
 *
 * @type {boolean}
 */
jex.placeholder.has_native_support_;


/**
 * The class to apply to the input element when the placeholder is active.
 * Simply setting and removing/resetting a font color is not appropriate
 * because that could potentially override user-defined class styles added
 * after the placeholder became active.
 *
 * @private
 *
 * @type {string}
 */
jex.placeholder.class_name_ = 'jex_placeholder';


/**
 * The original rocket value function. Need to "back up" this function because
 * it gets overridden. The override does some extra stuff and then potentially
 * calls this function anyways depending on the state of the placeholder. I'm
 * not 100% sure why this has to be a prototype on jex.placeholder, but this
 * is the only way this works and closure compiles properly.
 *
 * @private
 *
 * @type {function(string=): (rocket.Elements|string|Array.<string>|undefined)}
 */
jex.placeholder.prototype.rocket_value_ = rocket.Elements.prototype.value;


/**
 * Decorate
 *
 * @param {rocket.Elements} element The element to decorate.
 */
jex.placeholder.prototype.decorate = function(element) {
  if (this.decorated_ === false && jex.placeholder.get_has_native_support_() === false) {
    var self = this;

    // Grab the element and defined placeholder text. This uses the native
    // getAttribute() function because rocket will not return the attribute from
    // the HTML.
    this.element_ = element;
    this.placeholder_text_ = /** @type {HTMLInputElement} */
        (element[0]).getAttribute('placeholder');

    // Unfortunate but necessary. See comment on override of
    // rocket.Elements.prototype.value.
    this.element_.dataset('jex_placeholder', 'true');

    // Set the value to the current value using the overridden
    // rocket.Elements.value() function. This avoids a bunch of duplicate code
    // and keeps all of the value/style logic in one place. This basically
    // initializes the element while allowing for any initial value.
    this.element_.value( /** @type {string|undefined} */
        (this.element_.getAttribute('value'))
    );

    // Focus listener.
    this.element_.addEventListener('focus.jex_placeholder',
        /**
       * @this {HTMLInputElement}
       */
        function() {
          if (this.value === self.placeholder_text_) {
            rocket.$(this)
          .setAttribute('value', '')
          .removeClass('jex_placeholder');
          }
        });

    // Blur listener.
    this.element_.addEventListener('blur.jex_placeholder',
        /**
       * @this {HTMLInputElement}
       */
        function() {
          // Set the value to the current value using the overridden
          // rocket.Elements.value() function. This avoids a bunch of duplicate code
          // and keeps all of the value/style logic in one place.
          rocket.$(this).value(this.value);
        });

    this.decorated_ = true;
  }
};


/**
 * Undecorate.
 */
jex.placeholder.prototype.undecorate = function() {
  if (jex.placeholder.get_has_native_support_() === false && this.decorated_ === true) {
    this.decorated_ = false;

    this.element_.dataset('jex_placeholder', 'false');
    this.element_
      .removeEventListener('.jex_placeholder')
      .removeClass('jex_placeholder');

    if (this.element_.getAttribute('value') === this.placeholder_text_) {
      this.element_.setAttribute('value', '');
    }
  }
};


/**
 * Get the value of jex.placeholder.has_native_support_. If that variable is
 * currently undefined, then figure it out and save it there. This way this
 * logic only has to run once.
 *
 * @private
 *
 * @return {boolean} If the browser has native support for placeholders.
 */
jex.placeholder.get_has_native_support_ = function() {
  if (jex.placeholder.has_native_support_ === undefined) {
    var input = document.createElement('input');
    jex.placeholder.has_native_support_ = ('placeholder' in input);
  }
  return jex.placeholder.has_native_support_;
};


/**
 * This overrides the default value() function in Rocket. This is necessary
 * because calling something like $('#element').value() in a browser that does
 * not have native placeholder support will return the actual placeholder text
 * in my implementation. Ideally, this value should actually be an empty
 * string.
 *
 * So, instead of making the user worry about all that or forcing you to wrap
 * your placeheld inputs up any time you want to do this, I just handle it
 * automatically.
 *
 * First, if the element does not have any placeholder text, revert to the
 * original rocket value() function. Second, If there is placeholder text and
 * the browser has native support for them, revert to the original rocket
 * value() function. If, however, none of those two cases are true, then call
 * a custom value function.
 *
 * @param {string=} opt_value The value.
 *
 * @suppress {duplicate}
 *
 * @return {(rocket.Elements|string|Array.<string>|undefined)} The value or
 * these elements.
 */
rocket.Elements.prototype.value = function(opt_value) {
  // This is the only way I can determine if an input is decorated since this
  // value function is called without any knowledge of the actual placeholder
  // object. I'm just using the string 'true' or 'false'.
  var jex_placeholder = this.dataset('jex_placeholder');
  var decorated = (jex_placeholder === 'false' || jex_placeholder === undefined);

  if (/** @type {Element} */ (this[0]).getAttribute('placeholder') === undefined || decorated === true) {
    return jex.placeholder.prototype.rocket_value_.apply(this, arguments);
  }
  else {
    if (jex.placeholder.get_has_native_support_() === true) {
      return jex.placeholder.prototype.rocket_value_.apply(this, arguments);
    }
    else {
      return jex.placeholder.value_.apply(this, arguments);
    }
  }
};


/**
 * This is a 'static' value function that must be executed using .call(). The
 * this parameter should be the rocket element to set the value of. This
 * operates independently of the instantiated placeholder object.
 *
 * Note that if the user entered text into an input that matches the
 * placeholder text, this function will return an empty string when called
 * with no arguments or will revert to the placeholder text otherwise.
 *
 * @private
 *
 * @this {rocket.Elements}
 *
 * @param {string=} opt_value The value.
 *
 * @return {(rocket.Elements|string|Array.<string>|undefined)} The value or
 * these elements.
 */
jex.placeholder.value_ = function(opt_value) {
  var placeholder_text = /** @type {HTMLInputElement} */
      (this[0]).getAttribute('placeholder');

  if (arguments.length === 0) { // Get value
    var current_value = /** @type {string|undefined} */
        (this.getAttribute('value'));

    if (current_value === placeholder_text) {
      return '';
    }
    else {
      return current_value;
    }
  }
  else { // Set value
    if (opt_value === placeholder_text || opt_value === '') {
      this.addClass(jex.placeholder.class_name_);
      return this.setAttribute('value', placeholder_text);
    }
    else {
      this.removeClass(jex.placeholder.class_name_);
      return this.setAttribute('value', opt_value);
    }
  }
};


/**
 * Version number for this release.
 *
 * @const
 */
jex.version = '13.09';


