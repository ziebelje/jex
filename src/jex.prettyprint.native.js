


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
    'background': this.color_scheme_['background'] || jex.prettyprint.default_background_color_
  });

  var table = rocket.createElement('table');
  table.style({
    'font-family': 'Consolas, "Courier New", Courier, Monospace',
    'font-size': '14px'
  })
  .setAttribute({
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

        // value_td = tr.lastElementChild();
        value_td = tr.lastChild;

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

    // value_td = tr.lastElementChild();
    value_td = tr.lastChild;

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
  var tr = document.createElement('tr');

  if (this.display_line_numbers_ === true) {
    var line_number_td = document.createElement('td');
    line_number_td.style.textAlign = 'right';
    line_number_td.valign = 'top';
    line_number_td.appendChild(this.render_line_number_(line_number));
    tr.appendChild(line_number_td);
  }

  var value_td = document.createElement('td');
  tr.appendChild(value_td);

  return tr;
  // var tr = rocket.createElement('tr');

  // if (this.display_line_numbers_ === true) {
  //   var line_number_td = rocket.createElement('td')
  //     .style({'text-align': 'right'})
  //     .setAttribute({'valign': 'top'});
  //   line_number_td.appendChild(this.render_line_number_(line_number));
  //   tr.appendChild(line_number_td);
  // }

  // var value_td = rocket.createElement('td');
  // tr.appendChild(value_td);

  // return tr;
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
  var span = document.createElement('span');
  span.innerHTML = (line_number + '');
  span.style.marginRight = '15px';
  span.style.color = this.color_scheme_['line_number'] || jex.prettyprint.default_text_color_;
  return span;
  // var span = rocket.createElement('span');
  // span.innerHTML(line_number + '')
  //   .style({
  //       'margin-right': '15px',
  //       'color': this.color_scheme_['line_number'] || jex.prettyprint.default_text_color_
  //     });
  // return span;
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
  var span = document.createElement('span');
  span.innerHTML = rocket.padLeft('', indent).replace(/ /g, '&nbsp;') + key;
  span.style.color = this.color_scheme_['key'] || jex.prettyprint.default_text_color_;
  return span;
  // var style = {
  //   'color': this.color_scheme_['key'] || jex.prettyprint.default_text_color_
  // };
  // var span = rocket.createElement('span');
  // span.innerHTML(rocket.padLeft('', indent).replace(/ /g, '&nbsp;') + key)
  //   .style(style);
  // return span;
};


/**
 * Render the colon to separate the key and the value
 *
 * @private
 *
 * @return {rocket.Elements} The element containing the colon.
 */
jex.prettyprint.prototype.render_colon_ = function() {
  var span = document.createElement('span');
  span.innerHTML = ': ';
  span.style.color = this.color_scheme_['colon'] || jex.prettyprint.default_text_color_;
  return span;
  // var style = {
  //   'color': this.color_scheme_['colon'] || jex.prettyprint.default_text_color_
  // };
  // var span = rocket.createElement('span');
  // span.innerHTML(': ')
  //   .style(style);
  // return span;
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

  var span = document.createElement('span');
  span.style.color = this.color_scheme_[type] || jex.prettyprint.default_text_color_;

  var display_value = rocket.htmlEntities(value + '');
  // var style = {
  //   'color': this.color_scheme_[type] || jex.prettyprint.default_text_color_
  // };

  // A couple types have specialized values.
  switch (type) {
    case 'string':
      display_value = '"' + display_value + '"';
      break;
    case 'null':
      display_value = 'null';
      span.style.fontStyle = 'italic';
      break;
    case 'undefined':
      display_value = 'undefined';
      span.style.fontStyle = 'italic';
      break;
    case 'nan':
      display_value = 'NaN';
      span.style.fontStyle = 'italic';
      break;
  }

  span.innerHTML = display_value;
  return span;

  // var span = rocket.createElement('span');
  // span
  //   .innerHTML(display_value)
  //   .style(style);
  // return span;
};
