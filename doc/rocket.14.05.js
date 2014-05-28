/**
@preserve The Rocket JavaScript library.

  This library is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with this library.  If not, see
  <http://www.gnu.org/licenses/>.
*/


/**
Base namespace for the Rocket library.

@namespace
@const
*/
var rocket = {};


/**
Reduces an Array using the given reducer function and an optional initial value.

@param {(Array|rocket.Elements)} array The Array.
@param {function(*=, *=, number=, (Array|rocket.Elements)=) : *} fnct
  The reducer function.
@param {*=} opt_initial_value The initial value.
@return {*} The reduced value (the return value of the reducer function).
*/
rocket.reduceRight = function(array, fnct, opt_initial_value) {

  if (Array.prototype.reduceRight) {

    rocket.reduceRight = function(array, fnct, opt_initial_value) {

      if (arguments.length === 3) {
        return Array.prototype.reduceRight.call(array, fnct, opt_initial_value);
      } else {
        return Array.prototype.reduceRight.call(array, fnct);
      }

    };

  } else {

    rocket.reduceRight = function(array, fnct, opt_initial_value) {

      var i;
      var len = array.length - 1;
      var reduced;

      if (arguments.length === 3) {

        i = len;
        reduced = opt_initial_value;

      } else {

        i = len - 1;
        reduced = /** @type {*} */ (array[len]);

      }

      for (; i < -1; --i) {
        reduced = fnct(reduced, array[i], i, array);
      }

      return reduced;

    };

  }

  if (arguments.length === 3) {
    return rocket.reduceRight(array, fnct, opt_initial_value);
  } else {
    return rocket.reduceRight(array, fnct);
  }

};


/**
Reduces an Array using the given reducer function and an optional initial value.

@param {(Array|rocket.Elements)} array The Array.
@param {function(*=, *=, number=, (Array|rocket.Elements)=) : *} fnct
  The reducer function.
@param {*=} opt_initial_value The initial value.
@return {*} The reduced value (the return value of the reducer function).
*/
rocket.reduce = function(array, fnct, opt_initial_value) {

  if (Array.prototype.reduce) {

    rocket.reduce = function(array, fnct, opt_initial_value) {

      if (arguments.length === 3) {
        return Array.prototype.reduce.call(array, fnct, opt_initial_value);
      } else {
        return Array.prototype.reduce.call(array, fnct);
      }

    };

  } else {

    rocket.reduce = function(array, fnct, opt_initial_value) {

      var i;
      var len = array.length;
      var reduced;

      if (arguments.length === 3) {

        i = 0;
        reduced = opt_initial_value;

      } else {

        i = 1;
        reduced = /** @type {*} */ (array[0]);

      }

      for (; i < len; ++i) {
        reduced = fnct(reduced, array[i], i, array);
      }

      return reduced;

    };

  }

  if (arguments.length === 3) {
    return rocket.reduce(array, fnct, opt_initial_value);
  } else {
    return rocket.reduce(array, fnct);
  }

};


/**
Calls the given handler function as soon as possible when the DOM is ready.

@param {function()} handler The function to call when the DOM is ready.
*/
rocket.ready = function(handler) {

  /** @type {Array.<function()>} */
  var handlers;

  var dom_loading;
  var window_rocket;
  var ready_handler;
  var scroll_left_test;
  var interval;

  if (document.readyState === 'complete') {

    rocket.ready = function(handler) {
      handler();
    };

    handler();

  } else {

    window_rocket = new rocket.Elements([window]);
    dom_loading = true;

    handlers = [handler];

    rocket.ready = function(handler) {
      /** @type {Array.<function()>} */ (handlers).push(handler);
    };

    ready_handler = function() {

      var i;
      var len;

      if (dom_loading) {

        dom_loading = false;

        /** @type {rocket.Elements} */ (window_rocket).removeEventListener(
            ['load.ready', 'DOMContentLoaded.ready'],
            ready_handler
        );

        if (interval) {
          clearInterval(interval);
        }

        rocket.ready = function(handler) {
          handler();
        };

        for (i = 0, len = handlers.length; i < len; ++i) {
          handlers[i]();
        }

      }

    };

    window_rocket.addEventListener(
        ['load.ready', 'DOMContentLoaded.ready'],
        ready_handler
    );

    if (document.documentElement && window.frameElement === null) {

      scroll_left_test = function() {

        if (dom_loading) {
          try {
            document.documentElement.doScroll('left');
          } catch (e) {
            return setTimeout(scroll_left_test, 17);
          }

          ready_handler();

        }

      };

      setTimeout(scroll_left_test, 0);

    } else {

      interval = setInterval(function() {
        if (document.readyState === 'complete') {
          ready_handler();
        }
      }, 17);

    }

  }
};


/**
Creates an Array of numbers.

@param {number} start_or_count
  The first number in the range or if this is the only given parameter, zero
  is assumed for the start and this is used as the count.
@param {number=} opt_stop The last number in the range.
@param {number=} opt_step The step of the range.
@return {Array.<number>} The Array of numbers.
@example
// the following all produce the same result
rocket.range(10);
rocket.range(0,9);
rocket.range(0,9,1);
// returns
[0,1,2,3,4,5,6,7,8,9]
*/
rocket.range = function(start_or_count, opt_stop, opt_step) {

  var start;
  var stop;
  var step = opt_step || 1;

  if (arguments.length === 1) {
    start = 0;
    stop = start_or_count;
  } else {
    start = start_or_count;
    stop = opt_stop + 1;
  }

  var results = [];
  for (var i = start; i < stop; i += step) {
    results.push(i);
  }

  return results;

};


/**
Generates a random integer inclusively between a min and max value.

When called with no parameters, returns a random number between 0 and 2^31 - 1.

@param {number=} opt_min_max
  The minimum number to generate or if this is the only given parameter,
  zero is assumed for the min and this is used as the max.
@param {number=} opt_max The maximum.
@return {number} The random number.
@example
rocket.random(1); // returns zero or one
rocket.random(6); // returns zero thru six

// the following all produce the same result
// a random number between 0 and 2147483647
rocket.random();
rocket.random(2147483647);
rocket.random(0, 2147483647);
*/
rocket.random = function(opt_min_max, opt_max) {

  if (arguments.length === 2) {

    return Math.floor(
        Math.random() * (opt_max - opt_min_max + 1)
    ) + opt_min_max;

  } else if (arguments.length === 1) {

    return rocket.random(0, opt_min_max);

  } else {

    return rocket.random(0, 2147483647);

  }

};


/**
Returns an Array of Elements or a NodeList of Elements that match the given
query.

Used by rocket.$.

@param {string} query
  The query used to match Elements.
@param {(HTMLDocument|Element)=} opt_context
  The context within which to constrain queries.
@return {(NodeList|Array.<Element>)}
  The Array of Elements or a NodeList of Elements that match the given query.
*/
rocket.querySelectorAll = function(query, opt_context) {

  if (arguments.length === 2 && !opt_context) {
    return [];
  } else {
    return rocket.querySelectorAll.helper_(query, opt_context);
  }

};


/**
Query the DOM for a CSS selector string.

@private
@param {string} query The query string.
@param {(HTMLDocument|Element)=} opt_context The context.
@return {(NodeList|Array.<Element>)} The matching Elements.
*/
rocket.querySelectorAll.helper_ = function(query, opt_context) {

  if (document.querySelectorAll) {

    rocket.querySelectorAll.helper_ = function(query, opt_context) {
      return (opt_context || document).querySelectorAll(query);
    };

  } else {

    rocket.querySelectorAll.helper_ = function(query, opt_context) {

      if (query.indexOf(',') !== -1) {
        var queries = query.split(',');
        var results = [];
        for (var i = 0; queries[i]; ++i) {
          var elements =
              rocket.querySelectorAll.helper_(queries[i], opt_context);
          for (var j = 0; elements[j]; ++j) {
            results.push(elements[j]);
          }
        }
        return results;
      }

      if (query.charAt(0) === '#') {
        if (!opt_context || opt_context === document) {
          var results = document.getElementById(query.substr(1));
          return results && [results] || [];
        } else {
          var elements = opt_context.getElementsByTagName('*');
          var results = [];
          for (var i = 0; elements[i]; ++i) {
            if (/** @type {Element} */ (elements[i]).id === query.substr(1)) {
              results.push(elements[i]);
            }
          }
          return results;
        }
      } else {

        var dot_pos = query.indexOf('.');
        if (dot_pos === -1) {

          return (opt_context || document).getElementsByTagName(query);

        } else {

          var node_name = query.substr(0, dot_pos);
          var class_name = query.substr(dot_pos + 1);
          var matches = [];
          var memo = {};
          var elements =
              (opt_context || document).getElementsByTagName(node_name || '*');

          for (var i = 0; elements[i]; ++i) {
            var this_class_name =
                /** @type {Element} */ (elements[i]).className;
            if (!(this_class_name in memo)) {
              var this_class_names = rocket.arrayify(this_class_name);
              memo[this_class_name] = false;
              for (var j = 0; this_class_names[j]; ++j) {
                if (this_class_names[j] === class_name) {
                  memo[this_class_name] = true;
                  break;
                }
              }
            }
            if (memo[this_class_name]) {
              matches.push(elements[i]);
            }
          }

          return matches;

        }

      }

    };

  }

  return rocket.querySelectorAll.helper_(query, opt_context);

};


/**
Plucks one key attribute from each Object in an Array of Objects and
returns those attributes in an Array.

@param {Array} array The Array.
@param {string} key The key in the given Array.
@return {Array} An Array of the key values from the given Array.
@example
rocket.pluck([{'foo':'bar1'},{'foo':'bar2'}], 'foo');
// returns
['bar1','bar2']
*/
rocket.pluck = function(array, key) {

  var results = [];

  for (var i in array) {
    results.push(array[i][key]);
  }

  return results;

};


/**
Pads the ending of a string.

The optional padding string can be more than one character in length.

@param {(string|number)} str The string to be padded.
@param {number} len The minimum length to make the string.
@param {string=} opt_pad The string to use to pad or a space is used.
@return {string} The padded string.
*/
rocket.padRight = function(str, len, opt_pad) {

  str += '';

  var length = len - str.length;

  return length > 0 ?
      str + new Array(length + 1).join(opt_pad || ' ').substr(0, length) :
      str;

};


/**
Pads the beginning of a string.

The optional padding string can be more than one character in length.

@param {(string|number)} str The string to be padded.
@param {number} len The minimum length to make the string.
@param {string=} opt_pad The string to use to pad or a space is used.
@return {string} The padded string.
*/
rocket.padLeft = function(str, len, opt_pad) {

  str += '';

  var length = len - str.length;

  return length > 0 ?
      new Array(length + 1).join(opt_pad || ' ').substr(0, length) + str :
      str;

};


/**
Returns an object with a key and value attribute.

@param {string} key The key.
@param {*} value The value.
@return {Object.<string, *>} The object.
@example
// this resolves a three line issue with javascript

// given a variable to be used as a key
var key = 'foo';

// without rocket.object
var bar = {};
bar[key] = 'foo';
do_something_with(bar);

// transforms instead into
do_something_with(rocket.object(key, 'foo'));
*/
rocket.object = function(key, value) {
  var obj = {};
  obj[key] = value;
  return obj;
};


/**
Formats a number or a string into a human readable string.

Adds commas, a decimal point, and sets the preceision of the given number or
string.

@param {(number|string)} number The number.
@param {number=} opt_number_of_decimals
  The number of decimals; defaults to 0.
@param {string=} opt_decimal_point
  The decimal point; defaults to '.'.
@param {string=} opt_thousands_separator
  The thousands separator; defaults to ','.
@return {string} The formatted string.
*/
rocket.numberFormat =
    function(
        number,
        opt_number_of_decimals,
        opt_decimal_point,
        opt_thousands_separator) {


  var number_of_decimals = opt_number_of_decimals;
  var decimal_point = opt_decimal_point;
  var thousands_separator = opt_thousands_separator;

  var formatted;
  var i;
  var decimal_point_index;
  var mod;
  var is_negative;

  switch (arguments.length) {

    case 1:
      number_of_decimals = 0;

    case 2:
      decimal_point = '.';

    case 3:
      thousands_separator = ',';

  }

  if (number_of_decimals) {

    mod = 0;

  } else {

    mod = 2;

  }

  number = parseFloat(number);

  is_negative = number < 0;

  number = number.toFixed(number_of_decimals);

  formatted = ('' + number).split('');

  if (formatted[0] === '-') {

    formatted.splice(0, 1);

  }

  decimal_point_index = formatted.length - 1 - number_of_decimals;

  if (number_of_decimals) {

    formatted[decimal_point_index] = /** @type {string} */ (decimal_point);

  }

  if (thousands_separator) {

    for (i = decimal_point_index - 1; i > 0; --i) {

      if (((decimal_point_index - i) % 3) === mod) {

        formatted.splice(i, 0, thousands_separator);

      }

    }

  }

  return (is_negative ? '-' : '') + formatted.join('');

};


/**
Returns the current client's unix time in milliseconds.

@return {number} The current client's unix time in milliseconds.
*/
rocket.now = function() {

  if (Date.now) {

    rocket.now = Date.now;

  } else {

    rocket.now = function() {
      return new Date().getTime();
    };

  }

  return rocket.now();

};


/**
Executes a given function on every value in the given Array and returns an Array
of the return values of that given function.

@param {(Array|rocket.Elements)} array The Array.
@param {function(this:Object, Object, number, Object):Object} fnct
  The function to call for every value in this Array.
@param {Object=} opt_self The value to use as this when executing the function.
@return {Array} An array of the returns of the given function.
*/
rocket.map = function(array, fnct, opt_self) {

  if (Array.prototype.map) {

    rocket.map = function(array, fnct, opt_self) {
      return Array.prototype.map.call(array, fnct, opt_self);
    };

  } else {

    rocket.map = function(array, fnct, opt_self) {

      var i = 0;
      var len = array.length;
      var results = [];

      for (; i < len; ++i) {
        results[i] = fnct.call(opt_self, array[i], i, array);
      }

      return results;
    };

  }

  return rocket.map(array, fnct, opt_self);
};


/**
Loads an external javascript source file.

@param {string} url The url of the source file to load.
@param {function()=} opt_callback The function to call when complete.
@example
rocket.load('js/foo.js', function(){
  alert('loaded foo.js!');
});
*/
rocket.load = function(url, opt_callback) {

  var head;
  var heads;
  var scripts;
  var script;

  var head_i;
  var script_i;

  if (document.head) {
    head = document.head;
  } else {
    head = /** @type {HTMLHeadElement} */
        (document.getElementsByTagName('head')[0]);
  }

  script = document.createElement('script');
  script.async = true;
  script.type = 'text/javascript';
  script.src = url;

  script.onload = script.onreadystatechange = function() {

    var ready_state =
        /** @type {Element} */ (rocket.load.elements_[script_i]).readyState;

    if (!ready_state ||
        ready_state === 'loaded' ||
        ready_state === 'complete') {

      if (opt_callback) {
        opt_callback();
      }

      rocket.load.elements_[head_i].removeChild(
          rocket.load.elements_[script_i]
      );

      delete rocket.load.elements_[head_i];
      delete rocket.load.elements_[script_i];

    }

  };

  head.insertBefore(script, head.firstChild);

  head_i = ++rocket.load.guid_;
  script_i = ++rocket.load.guid_;

  rocket.load.elements_[head_i] = head;
  rocket.load.elements_[script_i] = script;

  head = null;
  script = null;

};


/**
Guid used to prevent leaks to head or script.

@private
*/
rocket.load.guid_ = 0;


/**
Storage for pointers to Elements to prevent leaks.

@private
@type {Object.<number, (Element|Node)>}
*/
rocket.load.elements_ = {};


/**
Lexicographical analyzer.

Parses javascript code and returns an Array of Objects each containing
a string part of the code and the type of that string.

This is not a full stack based parser/interpreter.  It cannot check for errors.

There is a minor (will not fix) known issue with two division operators
appearing on the same line being incorrectly interpreted as a
regular expression.

@param {string} string String of JavaScript code.
@return {Array.<{type: string, value: string}>} The interpreted JavaScript.
@test {true} Lexicographically analyze a string.
rocket.equal(
    rocket.lexeme("var foo = 'bar'"),
    [
        {"type":"word","value":"var"},
        {"type":"whitespace","value":" "},
        {"type":"identifier","value":"foo"},
        {"type":"whitespace","value":" "},
        {"type":"operator","value":"="},
        {"type":"whitespace","value":" "},
        {"type":"string","value":"'bar'"}
    ]
);
*/
rocket.lexeme = function(string) {

  var position = 0;
  var len = string.length;
  var results = [];
  var character;
  var initial_position;
  var type;
  var value;

  while (character = string.charAt(position++)) {

    initial_position = position;

    if (character >= 'a' && character <= 'z' ||
        character >= 'A' && character <= 'Z' ||
        character === '$' || character === '_') {

      do {
        character = string.charAt(position++);
      } while (character >= 'a' && character <= 'z' ||
          character >= 'A' && character <= 'Z' ||
          character === '$' || character === '_' ||
          character >= '0' && character <= '9');

      type = 'identifier';
      --position;

    } else if (character === '/') {

      if (string.charAt(position) === '*') {

        do {
          character = string.charAt(position++);
        } while (position < len &&
            (character !== '*' || string.charAt(position) !== '/'));

        type = 'comment';
        ++position;

      } else if (string.charAt(position) === '/') {

        do {
          character = string.charAt(position++);
        } while (position < len && character !== '\n');

        type = 'comment';

        if (position !== len) {
          --position;
        }

      } else {

        do {
          character = string.charAt(position++);
        } while (position < len && character !== '\n' &&
            (character !== '/' ||
                string.charAt(position - 2) === '\\' &&
                    string.charAt(position - 3) !== '\\'));

        if (character === '\n' || position === len) {
          position = initial_position;
          type = 'operator';
        } else {
          type = 'regexp';
        }

      }
    } else if (character in rocket.lexeme.operators_) {

      type = 'operator';

    } else if (character === '\'' || character === '"') {

      var terminator = character;
      do {
        character = string.charAt(position++);
      } while (position < len &&
          (character !== terminator ||
          string.charAt(position - 2) === '\\' &&
          string.charAt(position - 3) !== '\\'));

      type = 'string';

    } else if (character >= '0' && character <= '9' ||
        character === '.' &&
            string.charAt(position + 1) >= '0' &&
                string.charAt(position + 1) <= '9') {

      do {
        character = string.charAt(position++);
      } while (position < len &&
          (character >= '0' && character <= '9' ||
          character === '.' || character === 'x' || character === 'e'));

      type = 'number';

      if (position !== len) {
        --position;
      }

    } else {

      do {
        character = string.charAt(position++);
      } while (position < len &&
          (character === ' ' ||
          character === '\t' || character === '\r' || character === '\n'));

      type = 'whitespace';

      if (position !== len) {
        --position;
      }

    }

    value =
        string.substr(initial_position - 1, position - initial_position + 1);

    results.push({
      'type':
          (type === 'identifier' && value in rocket.lexeme.words_) ?
              'word' :
              type,
      'value': value
    });

  }

  return results;

};


/**
@private
@type {Object.<string, number>}
*/
rocket.lexeme.operators_ = {
  '!': 1,
  '#': 1,
  '%': 1,
  '&': 1,
  '(': 1,
  ')': 1,
  '*': 1,
  '+': 1,
  ',': 1,
  '-': 1,
  '.': 1,
  '/': 1,
  ':': 1,
  ';': 1,
  '<': 1,
  '=': 1,
  '>': 1,
  '?': 1,
  '@': 1,
  '[': 1,
  ']': 1,
  '^': 1,
  '{': 1,
  '|': 1,
  '}': 1
};


/**
@private
@type {Object.<string, number>}
*/
rocket.lexeme.words_ = {
  'true': 1,
  'false': 1,
  'break': 1,
  'case': 1,
  'catch': 1,
  'continue': 1,
  'debugger': 1,
  'default': 1,
  'delete': 1,
  'do': 1,
  'else': 1,
  'finally': 1,
  'for': 1,
  'function': 1,
  'if': 1,
  'in': 1,
  'instanceof': 1,
  'new': 1,
  'return': 1,
  'switch': 1,
  'this': 1,
  'throw': 1,
  'try': 1,
  'typeof': 1,
  'var': 1,
  'void': 1,
  'while': 1,
  'with': 1,
  'undefined': 1,
  'prototype': 1,
  'arguments': 1
};


/**
Returns the last index at which a given property can be found in the given
Array, or the number negative one if the given property is not present in the
given Array.

@param {(Array|rocket.Elements)} array The Array.
@param {*} needle Property to locate in the Array.
@param {number=} opt_offset The position from which to start the search.
@return {number}
  The index of the located property or the number negative one if the property
  was not found.
*/
rocket.lastIndexOf = function(array, needle, opt_offset) {

  if (Array.prototype.lastIndexOf) {

    rocket.lastIndexOf = function(array, needle, opt_offset) {

      return Array.prototype.lastIndexOf.apply(
          array,
          Array.prototype.slice.call(arguments, 1)
      );

    };

  } else {

    rocket.lastIndexOf = function(array, needle, opt_offset) {

      var i;
      var len = array.length - 1;

      if (arguments.length === 2) {

        i = len;

      } else {

        i = Math.min(len, opt_offset);

      }

      for (; i > -1; --i) {
        if (needle === array[i]) {
          return i;
        }
      }

      return -1;

    };

  }

  return rocket.lastIndexOf.apply(window, arguments);

};


/**
Returns an Array of all of the keys of the given Object.

@param {!Object} object The Object or Array over which to iterate.
@return {Array.<string>} The keys of the given Object or Array.
@example
rocket.keys({'foo':'bar','foofoo':'barbar'});
// returns
['foo','foofoo']
*/
rocket.keys = function(object) {

  if (Object.keys) {

    rocket.keys = Object.keys;

  } else {

    rocket.keys = function(object) {

      var keys = [];

      for (var i in object) {
        keys.push(i);
      }

      return keys;

    };

  }

  return rocket.keys(object);

};


/**
An enum of character key codes for key events.

Used to compare to the which property of rocket.Event.

@const
@enum {number}
*/
rocket.KEY = {
  backspace: 8,
  tab: 9,
  enter: 13,
  shift: 16,
  ctrl: 17,
  control: 17,
  alt: 18,
  escape: 27,
  space: 32,
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  home: 36,
  end: 35,
  del: 46,
  pageUp: 33,
  pageDown: 34
};


/**
JSON namespace.

@const
@namespace
*/
rocket.JSON = {};


/**
Converts a given JSON string into an Object.

@param {string} str The String.
@return {*} The Object.
*/
rocket.JSON.parse = function(str) {

  if (window.JSON && window.JSON.parse) {

    rocket.JSON.parse = window.JSON.parse;

  } else {

    rocket.JSON.parse = function(json_string) {
      return eval('(' + json_string + ')');
    };

  }

  return rocket.JSON.parse(str);

};


/**
Quotes a string.

@private
@param {string} str The string to quote.
@return {string} The quoted string.
*/
rocket.JSON.quote_ = function(str) {

  rocket.JSON.quote_.escapable_.lastIndex = 0;

  if (rocket.JSON.quote_.escapable_.test(str)) {

    return '"' +
        str.replace(
            rocket.JSON.quote_.escapable_,
            rocket.JSON.quote_.replacer_
        ) +
        '"';

  } else {

    return '"' + str + '"';

  }

};


/**
Regular expression of escapable characters.

@private
@param {string} str The string to be replaced.
@return {string} The replaced string.
*/
rocket.JSON.quote_.replacer_ = function(str) {

  return rocket.JSON.quote_.meta_[str] ||
      '\\u' + ('0000' + str.charCodeAt(0).toString(16)).slice(-4);

};


/**
Regular expression of escapable characters.

@private
@type {RegExp}
*/
rocket.JSON.quote_.escapable_ =
    /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;


/**
Character substitutions.

@private
@type {Object.<string, string>}
*/
rocket.JSON.quote_.meta_ = {
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\f': '\\f',
  '\r': '\\r',
  '"' : '\\"',
  '\\': '\\\\'
};


/**
Converts an object to a JSON string.

@param {*} object The object.
@return {(string|undefined)} The JSON string.
*/
rocket.JSON.stringify = function(object) {

  if (window.JSON && window.JSON.stringify) {

    rocket.JSON.stringify = window.JSON.stringify;

  } else {

    rocket.JSON.stringify = function(object) {

      var i;
      var len;
      var string;
      var type;

      if (object === undefined) {

        return undefined;

      } else {

        type = typeof object;

        if (type === 'string') {

          return rocket.JSON.quote_(/** @type {string} */ (object));

        } else if (type === 'number' || type === 'boolean' || object === null) {

          return '' + object;

        } else if (
            typeof /** @type {{length: number}} */
                (object).length === 'number') {

          len = /** @type {{length: number}} */ (object).length;
          i = 0;
          string = [];

          for (; i < len; ++i) {

            if (object[i] === undefined) {
              string[i] = 'null';
            } else {
              string[i] = rocket.JSON.stringify(object[i]);
            }

          }

          return '[' + string.join(',') + ']';

        } else {

          string = [];

          for (i in object) {

            if (object[i] !== undefined) {

              string.push(
                  rocket.JSON.quote_(i) + ':' +
                      rocket.JSON.stringify(object[i])
              );

            }

          }

          return '{' + string.join(',') + '}';

        }
      }

    };

  }

  return rocket.JSON.stringify(object);

};


/**
Returns whether a given Object is empty.

Returns whether the given Object does not contain any properties.

@param {(Object|null|undefined)} obj The object.
@return {boolean} Whether the given Object is empty.
@example
rocket.isEmpty([]);
// returns
true;

rocket.isEmpty({});
// returns
true;

rocket.isEmpty({'foo': 'bar'});
// returns
false;
*/
rocket.isEmpty = function(obj) {

  for (var i in obj) {
    return false;
  }

  return true;

};


/**
Returns whether the given Object is an Array.

@param {(Object|{length: number})} obj The Object.
@return {boolean} Whether the object is an Array.
@test {true} An empty Array.
rocket.isArray([]);
@test {true} An Object with a length property that is a number.
rocket.isArray({'length': 0});
@test {false} A string.
rocket.isArray('foo');
@test {false} A function.
rocket.isArray(function(){});
*/
rocket.isArray = function(obj) {

  return (
      (obj &&
          (typeof /** @type {{length: (number|undefined)}} */
              (obj).length === 'number') &&
                  (typeof obj === 'object')) ||
      false
  );


};


/**
Adds a class to this document.

@param {string} rule The rule.
@example
$.insertRule('body {padding: 10px}');
*/
rocket.insertRule = function(rule) {

  var style_element = document.createElement('style');
  style_element.type = 'text/css';

  if (document.head) {
    document.head.appendChild(style_element);
  } else {
    /** @type {HTMLHeadElement} */ (document.getElementsByTagName('head')[0])
        .appendChild(style_element);
  }

  var style_sheet = /** @type {CSSStyleSheet} */
      (document.styleSheets[document.styleSheets.length - 1]);

  if (style_sheet.insertRule) {

    rocket.insertRule = function(rule) {
      style_sheet.insertRule(rule, 0);
    };

  } else {

    rocket.insertRule = function(rule) {
      var pos = rule.indexOf('{');
      style_sheet.addRule(
          rule.substr(0, pos),
          rule.substr(pos + 1, rule.lastIndexOf('}') - pos - 1)
      );
    };

  }

  rocket.insertRule(rule);

};


/**
Allows inheritance from a given parent class to a given child class.

@param {Function} child_class Child class.
@param {Function} parent_class Parent class.
*/
rocket.inherits = function(child_class, parent_class) {

  /**
  @ignore
  @constructor
  */
  function Temporary_Class() {};

  Temporary_Class.prototype = parent_class.prototype;

  child_class.prototype = new Temporary_Class();

  child_class.prototype.constructor = child_class;
  child_class.prototype.superClass_ = parent_class.prototype;

};


/**
Returns the first index at which a given property can be found in the given
Array, or the number negative one if the given property is not present in the
given Array.

@param {(Array|rocket.Elements)} array The Array.
@param {*} needle Property to locate in the Array.
@param {number=} opt_offset The position from which to start the search.
@return {number}
  The index of the located property or the number negative one if the property
  was not found.
*/
rocket.indexOf = function(array, needle, opt_offset) {

  if (Array.prototype.indexOf) {

    rocket.indexOf = function(array, needle, opt_offset) {
      return Array.prototype.indexOf.call(array, needle, opt_offset);
    };

  } else {

    rocket.indexOf = function(array, needle, opt_offset) {

      var i = opt_offset || 0;
      var len = array.length;

      for (; i < len; ++i) {
        if (needle === array[i]) {
          return i;
        }
      }

      return -1;

    };

  }

  return rocket.indexOf(array, needle, opt_offset);

};


/**
Returns the safely escaped html string representation of the given string.

@param {string} str The string.
@return {string} The escaped string.
*/
rocket.htmlEntities = function(str) {

  var element = document.createElement('span');

  element.innerText = element.textContent = str;

  return element.innerHTML;

};


/**
Sets the given Object's expando property if it is not present;
returns the given Object's expando property value.

@param {Object} obj The object to inspect.
@return {number} The object's rocket_guid.
*/
rocket.guid = function(obj) {
  return /** @type {undefined|number} */ (obj[rocket.expando]) ||
      (obj[rocket.expando] = ++rocket.guid.counter_);
};


/**
Returns the given Object's expando property or the number zero if the expando
property has never been assigned onto the given Object.

@param {Object} obj The object to inspect.
@return {number} The object's rocket_guid or zero.
*/
rocket.guid.peek = function(obj) {
  return /** @type {undefined|number} */ (obj[rocket.expando]) || 0;
};


/**
The rocket guid counter.  This is the last guid that was assigned.

@private
*/
rocket.guid.counter_ = 0;


/**
Executes the given function on every value in the given Array.

@param {(Array|rocket.Elements)} array The Array.
@param {function(this:Object, Object, number, Object)} fnct
  The function to call for every value in this Array.
@param {Object=} opt_self
  The value to use as this when executing the given function.
*/
rocket.forEach = function(array, fnct, opt_self) {

  if (Array.prototype.forEach) {

    rocket.forEach = function(array, fnct, opt_self) {
      Array.prototype.forEach.call(array, fnct, opt_self);
    };

  } else {

    rocket.forEach = function(array, fnct, opt_self) {

      var i = 0;
      var len = array.length;

      for (; i < len; ++i) {
        fnct.call(opt_self, array[i], i, array);
      }

    };

  }

  rocket.forEach(array, fnct, opt_self);

};



/**
Flips an Object's keys and values.

@param {Object} obj The Object.
@return {Object} The flipped Object.
@example
// given
var foo = {'a': 'b', 'c': 'd', 'e': 'd'};

rocket.flip(foo);
// returns
{'b': 'a', 'd': 'e'};
*/
rocket.flip = function(obj) {

  var results = {};

  for (var i in obj) {
    results[obj[i]] = i;
  }

  return results;

};


/**
Executes a given function on every value in this Array and returns an Array of
the values where the given function returned true.

@param {(Array|rocket.Elements)} array The Array.
@param {function(this:Object, Object, number, Object):*} fnct
  The function to call for every value in this Array.
@param {Object=} opt_self The value to use as this when executing the function.
@return {Array}
  An Array of values from this Array where the function returned true.
*/
rocket.filter = function(array, fnct, opt_self) {

  if (Array.prototype.filter) {

    rocket.filter = function(array, fnct, opt_self) {
      return Array.prototype.filter.call(array, fnct, opt_self);
    };

  } else {

    rocket.filter = function(array, fnct, opt_self) {

      var i = 0;
      var len = array.length;
      var results = [];

      for (; i < len; ++i) {
        if (fnct.call(opt_self, array[i], i, array)) {
          results.push(array[i]);
        }
      }

      return results;

    };

  }

  return rocket.filter(array, fnct, opt_self);

};


/**
Extends the given target Object with
the properties of the given source Object(s).

Performs a shallow copy that does not recursively descend properties.

@param {Object} target The target Object to receive the source's properties.
@param {...Object} var_args
  The source Object(s) to be extended onto the target Object.
@return {Object} The extended target Object.
*/
rocket.extend = function(target, var_args) {

  var source;

  for (var i = 1; source = /** @type {Object} */ (arguments[i]); ++i) {

    for (var option in source) {
      target[option] = source[option];
    }

  }

  return target;

};


/**
The name of the property that is used to uniquely identify EventTargets when
EventListeners are attached to them.

@type {string}
*/
rocket.expando = 'rocket_' + rocket.version;


/**
Executes a given function on every value in the given array and returns true if
and only if that given function never returns false.

@param {(Array|rocket.Elements)} array The Array.
@param {function(this:Object, Object, number, Object):Object} fnct
  The function to call for every value in this array.
@param {Object=} opt_self The value to use as this when executing the function.
@return {boolean} Whether the function never returns false.
*/
rocket.every = function(array, fnct, opt_self) {

  if (Array.prototype.every) {

    rocket.every = function(array, fnct, opt_self) {
      return Array.prototype.every.call(array, fnct, opt_self);
    };

  } else {

    rocket.every = function(array, fnct, opt_self) {

      var i = 0;
      var len = array.length;

      for (; i < len; ++i) {
        if (!fnct.call(opt_self, array[i], i, array)) {
          return false;
        }
      }

      return true;

    };

  }

  return rocket.every(array, fnct, opt_self);

};



/**
A wrapper class used to represent and easily manipulate the given EventTarget.

Can be extended by a child class to provide the methods:
addEventListener, removeEventListener,and dispatchEvent to the child class.

@implements {EventTarget}
@constructor
@example
// provide add/remove/dispatch EventListeners to Baz
var Baz = function() {};
rocket.inherits(Baz, rocket.EventTarget);
@see {rocket.Event}
@see {rocket.EventListener}
@link
http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
@link
https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
*/
rocket.EventTarget = function() {};


/**
If this is an Element, then nodeName will be populated.

@type {string}
@ignore
*/
rocket.EventTarget.prototype.nodeName;


/**
If this is the Window, then window will be itself.

@type {rocket.EventTarget}
@ignore
*/
rocket.EventTarget.prototype.window;


/**
If this is the Window, then self will be itself.

@type {rocket.EventTarget}
@ignore
*/
rocket.EventTarget.prototype.self;


/**
Functional definition used for compiler compatibility with IE.

@type {function(string, (EventListener|function(Event)))}
@ignore
*/
rocket.EventTarget.prototype.attachEvent;


/**
Functional definition used for compiler compatibility with IE.

@type {function(string, (EventListener|function(Event)))}
@ignore
*/
rocket.EventTarget.prototype.detachEvent;


/**
If this is an Element, then parentNode will be used
to propagate a dispatchEvent.

@type {rocket.EventTarget}
@ignore
*/
rocket.EventTarget.prototype.parentNode;


/**
Contains a tree of all of the current EventListeners for EventTargets.

@private
@type {Object.<number, Object.<string, Object.<string, Array.<EventListener>|undefined>|undefined>|undefined>}
*/
rocket.EventTarget.listener_tree_ = {};


/**
Gets current listener_tree_.

@return {Object.<number, Object.<string, Object.<string, Array.<EventListener>|undefined>|undefined>|undefined>}
*/
rocket.EventTarget.getListenerTree = function() {
  return rocket.EventTarget.listener_tree_;
};


/**
Removes all eventListeners from all eventTargets.
*/
rocket.EventTarget.removeAllEventListeners = function() {

  var tree = rocket.EventTarget.listener_tree_;

  for (var guid in tree) {

    for (var type in tree[+guid]) {

      for (var ns in tree[+guid][type]) {

        rocket.EventTarget.prototype.removeEventListener.call(
            /** @type {rocket.EventTarget} */ (
                /** @type {rocket.EventListener} */ (
                    tree[+guid][type][ns][0]
                ).get_target()
            )
        );

        break;

      }

      break;

    }

  }

};


/**
Adds an EventListener to be called when an Event occurs on this EventTarget.

An optional namespace can be provided within the type parameter.
The Event.type is every character up to until, but not including,
the first period. The namespace is every character after the first period.

Providing a namespace allows for easier, future
EventListener removal and dispatching.

@param {string} type The Event.type for which to listen.  An optional namespace
  can also be provided following a period "." character.
@param {(EventListener|function(!Event))} listener
  The EventListener or the function to call when the Event occurs.
@example
$('body').addEventListener('click',function(){
  alert('You just clicked the ' + this.nodeName);
});

$('body').addEventListener('click.foobar',function(){
  alert('This EventListener uses the namespace "foobar"!');
});
@link
https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
*/
rocket.EventTarget.prototype.addEventListener =
    function(type, listener) {

  var guid = rocket.guid(this);

  var name_space;
  var dot_pos = type.indexOf('.');
  if (dot_pos !== -1) {
    name_space = type.substr(dot_pos + 1);
    type = type.substr(0, dot_pos);
  } else {
    name_space = '';
  }

  switch (undefined) {

    case rocket.EventTarget.listener_tree_[guid]:
      rocket.EventTarget.listener_tree_[guid] = {};

    case rocket.EventTarget.listener_tree_[guid][type]:
      rocket.EventTarget.listener_tree_[guid][type] = {};

    case rocket.EventTarget.listener_tree_[guid][type][name_space]:
      rocket.EventTarget.listener_tree_[guid][type][name_space] = [];

  }

  var listeners = rocket.EventTarget.listener_tree_[guid][type][name_space];

  for (var i = 0, len = listeners.length; i < len; ++i) {
    if (listeners[i].handleEvent === listener ||
        listeners[i].handleEvent === listener.handleEvent) {
      return;
    }
  }

  var event_listener = new rocket.EventListener(this, type, listener);

  if (this.nodeName || this.window && this.window === this.self) {
    var bound_fnct = event_listener.get_bound();
    var bound_types = event_listener.get_bound_types();
    if (this.addEventListener) {
      for (var i = 0; bound_types[i]; ++i) {
        this.addEventListener(bound_types[i], bound_fnct, false);
      }
    } else {
      for (var i = 0; bound_types[i]; ++i) {
        this.attachEvent('on' + bound_types[i], bound_fnct);
      }
    }
  }

  listeners.push(event_listener);

};


/**
Removes an EventListener from being called when an Event occurs on
this EventTarget.

An optional namespace can be provided within the type parameter.
The Event.type is every character up to until, but not including,
the first period. The namespace is every character after the first period.

If no namespace is provided, then all namespaces are assumed.

If a namespace is provided, then only EventListeners added with the given
namespace will be removed.

@param {string=} opt_type
  The Event.type to be removed.
  If not given, then all Event.types will be removed.  An optional namespace
  can also be provided following a period "." character.
@param {(EventListener|function(!Event))=} opt_fnct
  The EventListener or the function to be removed.
  If not given, then all EventListeners or functions will be removed.
@example
// remove a previously added EventListener from the document
$(document).removeEventListener('click', some_event_listener);

// remove all click EventListeners from the document
$(document).removeEventListener('click');

// remove all EventListeners from the document
$(document).removeEventListener();

// remove all EventListeners from the document that were added with
// the namespace "foobar"
$(document).removEventListener('.foobar');

// remove all clik EventListeners from the document that were added with
// the namespace "foobar"
$(document).removEventListener('click.foobar');
@link
https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.removeEventListener
*/
rocket.EventTarget.prototype.removeEventListener =
    function(opt_type, opt_fnct) {

  var guid = rocket.guid.peek(this);

  if (guid) {

    var listeners = rocket.EventTarget.listener_tree_[guid];

    if (listeners) {

      var name_space;
      var dot_pos;
      if (arguments.length !== 0 && (dot_pos = opt_type.indexOf('.')) !== -1) {
        name_space = opt_type.substr(dot_pos + 1);
        opt_type = opt_type.substr(0, dot_pos);
      } else {
        name_space = '';
      }

      for (var type in listeners) {

        if (arguments.length === 0 || opt_type === '' || opt_type === type) {

          for (var ns in listeners[type]) {

            if (name_space === '' || ns === name_space) {

              for (var i = 0; listeners[type][ns][i]; ++i) {

                var fnct = listeners[type][ns][i].handleEvent;

                if (arguments.length !== 2 || opt_fnct === fnct ||
                    opt_fnct.handleEvent === fnct) {

                  if (this.nodeName ||
                      this.window && this.window === this.self) {

                    var listener = /** @type {rocket.EventListener} */
                        (listeners[type][ns][i]);
                    var bound = listener.get_bound();
                    var bound_types = listener.get_bound_types();
                    if (this.removeEventListener) {
                      for (var j = 0; bound_types[j]; ++j) {
                        this.removeEventListener(bound_types[j], bound, false);
                      }
                    } else {
                      for (var j = 0; bound_types[j]; ++j) {
                        this.detachEvent('on' + bound_types[j], bound);
                      }
                    }
                    listener.remove_bound();

                  }

                  listeners[type][ns].splice(i, 1);

                  if (rocket.isEmpty(listeners[type][ns])) {
                    delete listeners[type][ns];
                    if (rocket.isEmpty(listeners[type])) {
                      delete listeners[type];
                      if (
                          rocket.isEmpty(
                              rocket.EventTarget.listener_tree_[guid]
                          )
                      ) {
                        delete rocket.EventTarget.listener_tree_[guid];
                      }
                    }
                    break;
                  }

                  i -= 1;

                }

              }

            }

          }

        }

      }

    }

  }

};


/**
Calls the EventListeners that have been added for an Event on this EventTarget.

An optional namespace can be provided within the type parameter.
The Event.type is every character up to until, but not including,
the first period. The namespace is every character after the first period.

If no namespace is provided, then all namespaces are assumed.

If a namespace is provided, then only EventListeners added with the given
namespace will be called.

@param {(Event|string)} event_or_type The Event.type for which to listen.
  An optional namespace can also be provided following a period "." character.
@return {boolean} Whether any EventListener called Event.preventDefault.
@link
https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.dispatchEvent
*/
rocket.EventTarget.prototype.dispatchEvent = function(event_or_type) {

  var guid = rocket.guid.peek(this);
  /** @type {Event} */
  var evt;
  /** @type {string} */
  var type;

  if (event_or_type.type) {
    evt = /** @type {Event} */ (event_or_type);
    type = event_or_type.type;
  } else {
    evt = new rocket.Event(event_or_type);
    type = /** @type {string} */ (event_or_type);
  }

  if (!evt.target) {
    evt.target = this;
  }

  if (guid) {

    var name_space;
    var dot_pos = type.indexOf('.');
    if (dot_pos !== -1) {
      name_space = type.substr(dot_pos + 1);
      type = type.substr(0, dot_pos);
    } else {
      name_space = '';
    }

    var listeners = rocket.EventTarget.listener_tree_[guid];

    if (listeners) {

      if (listeners[type]) {

        for (var ns in listeners[type]) {

          if (name_space === '' || ns === name_space) {

            /** @type {Array.<rocket.EventListener>} */
            var queue = [];
            for (var i = 0; listeners[type][ns][i]; ++i) {
              queue.push(listeners[type][ns][i]);
            }

            for (var i = 0; queue[i]; ++i) {

              if (rocket.indexOf(
                  /** @type {Array.<rocket.EventListener>} */
                  (listeners[type][ns]),
                  queue[i]) !== -1) {

                (queue[i]).handleEvent.call(
                    this,
                    evt
                );

                if (/** @type {rocket.Event} */
                    (evt).immediatePropagationStopped) {
                  return !evt.defaultPrevented;
                }

              }

            }

          }

        }

      }

    }

  }

  if (this.nodeName && this.parentNode && !evt.propagationStopped) {
    rocket.EventTarget.prototype.dispatchEvent.call(
        /** @type {rocket.EventTarget} */ (this.parentNode),
        evt
    );
  }

  return !evt.defaultPrevented;

};



/**
A wrapper class used to represent and easily manipulate the given EventListener.

@implements {EventListener}
@constructor
@param {EventTarget} target
@param {string} type
@param {(EventListener|function(!Event))} fnct
*/
rocket.EventListener = function(target, type, fnct) {

  this.target_ = target;
  this.type_ = type;
  this.handleEvent =
      /** @type {function(this:EventTarget, Event)} */
      (fnct.handleEvent || fnct);

};


/**
todo.

@private
*/
rocket.EventListener.listener_key_ = 0;


/**
todo.

@private
@type {Object.<number, rocket.EventListener>}
*/
rocket.EventListener.listeners_ = {};


/**
Get current listeners_.

@return {Object.<number, rocket.EventListener>}
*/
rocket.EventListener.getListeners = function() {
  return rocket.EventListener.listeners_;
};


/**
@type {function(this:EventTarget, Event)}
*/
rocket.EventListener.prototype.handleEvent;


/**
target.

@private
@type {EventTarget}
*/
rocket.EventListener.prototype.target_;


/**
Get the target.

@return {EventTarget}
*/
rocket.EventListener.prototype.get_target = function() {
  return this.target_;
};


/**
type.

@private
@type {string}
*/
rocket.EventListener.prototype.type_;


/**
This listener_key_.

@type {number}
*/
rocket.EventListener.prototype.listener_key_;


/**
bound.

@type {function(Event)}
*/
rocket.EventListener.prototype.bound_handler_;


/**
getbound.

@return {function(Event)} Bound function.
*/
rocket.EventListener.prototype.get_bound = function() {

  if (!this.bound_handler_) {

    var listener_key_ = ++rocket.EventListener.listener_key_;
    this.listener_key_ = listener_key_;
    rocket.EventListener.listeners_[listener_key_] = this;

    this.bound_handler_ = /** @type {function(Event)} */ (function(evt) {
      if (rocket.EventListener.listeners_[listener_key_]) {
        rocket.EventListener.listeners_[listener_key_].handleEvent.call(
            rocket.EventListener.listeners_[listener_key_].target_,
            new rocket.Event(evt)
        );
      }
    });

    var transformer =
        rocket.EventListener.event_listener_transformers_[this.type_];

    if (transformer) {
      this.bound_handler_ = transformer.transformer(this.bound_handler_);
    }

  }

  return this.bound_handler_;

};


/**
getboundtypes.

@return {Array.<string>}
*/
rocket.EventListener.prototype.get_bound_types = function() {
  var transformer =
      rocket.EventListener.event_listener_transformers_[this.type_];
  if (transformer) {
    return transformer.types;
  } else {
    return [this.type_];
  }
};


/**
remove bound.
*/
rocket.EventListener.prototype.remove_bound = function() {

  delete rocket.EventListener.listeners_[this.listener_key_];
  delete this.bound_handler_;
  delete this.listener_key_;

};


/**
Creates a wrapper function to only call listener on
a mouse enter or leave event.

@private
@param {function(Event)} listener The event listener.
@return {function(Event)}
  The listener to be bound using addEventListener.
*/
rocket.EventListener.event_listener_transformer_after_key_down_ =
    function(listener) {

  var interval;
  var time_out;

  var time_out_function = function() {

    if (interval) {

      clearInterval(interval);
      interval = 0;

    }

    time_out = 0;

  };

  /** @type {HTMLInputElement} */
  var self;
  /** @type {string} */
  var value;
  /** @type {Event} */
  var event;

  var interval_function = function() {

    if (self.value !== value) {

      clearInterval(interval);
      interval = 0;

      listener.call(self, event);

    }

  };


  return (/**
  @this {HTMLInputElement}
  @param {Event} the_event The event.
  */ (function(the_event) {

        listener.call(this, the_event);

        if (the_event.type === 'keyup') {

          if (interval) {

            clearInterval(interval);
            interval = 0;

            if (time_out) {

              clearTimeout(time_out);
              time_out = 0;

            }

          }

        } else {

          if (!interval) {

            self = this;
            value = this.value;
            event = the_event;

            interval = setInterval(interval_function, 17);

          }

          if (time_out) {

            clearTimeout(time_out);

          }

          time_out = setTimeout(time_out_function, 1000);

        }

      })
  );

};


/**
Creates a wrapper function to only call listener on
a mouse enter or leave event.

@private
@param {function(Event)} listener The event listener.
@return {function(Event)}
  The listener to be bound using addEventListener.
*/
rocket.EventListener.event_listener_transformer_mouse_enter_leave_ =
    function(listener) {

  return (/**
  @this {EventTarget}
  @param {Event} the_event The event.
  */(function(the_event) {

        /** @type {(EventTarget|Node)} */
        var related_target = the_event.relatedTarget;

        if (related_target) {

          while ((/** @type {EventTarget} */ (related_target) !== this) &&
              (related_target =
                  /** @type {Node} */ (related_target).parentNode)) {}

        }

        if (!related_target) {
          listener.call(this, the_event);
        }

      })
  );

};


/**
Custom DOM Events.

@const
@private
@type {Object.<string,{transformer: function(function(Event)):function(Event), types: Array.<string>}>}
*/
rocket.EventListener.event_listener_transformers_ = {
  'afterkeydown': {
    'transformer':
        rocket.EventListener.event_listener_transformer_after_key_down_,
    'types': ['keydown', 'keyup']
  },
  'mouseenter': {
    'transformer':
        rocket.EventListener.event_listener_transformer_mouse_enter_leave_,
    'types': ['mouseover']
  },
  'mouseleave': {
    'transformer':
        rocket.EventListener.event_listener_transformer_mouse_enter_leave_,
    'types': ['mouseout']
  }
};




/**
A wrapper class used to represent and easily manipulate the given Event.

Also normalizes Event properties and methods.

@extends {Event}
@constructor
@param {(Event|string)} evt_or_type
  The given native Event or an Event.type for which to create an Event.
@param {boolean=} opt_bubbles Whether this Event should bubble.
@param {boolean=} opt_cancelable Whether this Event can be cancelled.
@see {rocket.EventTarget}
@see {rocket.EventListener}
@link
http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Event
@link
https://developer.mozilla.org/en-US/docs/Web/API/Event
*/
rocket.Event = function(evt_or_type, opt_bubbles, opt_cancelable) {

  if (evt_or_type.type) {

    this.type = evt_or_type.type;
    this.originalEvent = /** @type {Event} */ (evt_or_type);

    var property;

    for (var i = 0; property = rocket.Event.properties_[i]; ++i) {
      this[property] = evt_or_type[property];
    }

    if (this.defaultPrevented === true || this.returnValue === false) {
      this.defaultPrevented = true;
    } else {
      this.defaultPrevented = false;
    }

    if (this.cancelBubble === true) {
      this.propagationStopped = true;
    } else {
      this.propagationStopped = false;
    }

    if (this.which === undefined && this.keyCode !== undefined) {
      this.which = this.keyCode;
    }

    if (this.target === undefined && this.srcElement !== undefined) {
      this.target = this.srcElement;
    }

    if (this.relatedTarget === undefined &&
        this.fromElement !== undefined &&
        this.toElement !== undefined) {

      this.relatedTarget = (this.fromElement === this.target) ?
          this.toElement :
          this.fromElement;

    }

    if (this.pageX === undefined && this.clientX !== undefined) {

      this.pageX = this.clientX;

      var body = document.body;
      var documentElement = document.documentElement;

      if (documentElement) {
        this.pageX += documentElement.scrollLeft - documentElement.clientLeft;
      } else if (body) {
        this.pageX += body.scrollLeft - body.clientLeft;
      }

      this.pageY = this.clientY;

      if (documentElement) {
        this.pageY += documentElement.scrollTop - documentElement.clientTop;
      } else if (body) {
        this.pageY += body.scrollTop - body.clientTop;
      }

    }


  } else {
    this.type = /** @type {string} */ (evt_or_type);
  }

  if (arguments.length === 1) {
    this.bubbles = true;
    this.cancelable = true;
  } else if (arguments.length === 2) {
    this.bubbles = true;
    this.cancelable = /** @type {boolean} */ (opt_cancelable);
  } else {
    this.bubbles = /** @type {boolean} */ (opt_bubbles);
    this.cancelable = /** @type {boolean} */ (opt_cancelable);
  }

};


/**
Array of properties to extend from Event.

@private
@type {Array.<string>}
*/
rocket.Event.properties_ = [
  'which',
  'keyCode',
  'target',
  'srcElement',
  'relatedTarget',
  'fromElement',
  'toElement',
  'pageX',
  'pageY',
  'clientX',
  'clientY'
];


/**
A reference to the original Event.

This can be used to access properties that are not extended from the
original Event; or to access their original non-normalized values.

@type {Event}
*/
rocket.Event.prototype.originalEvent;


/**
Normalized propagationStopped.

This property should be considered read-only.

To stop propagation call Event.stopPropagation().

@type {boolean}
*/
rocket.Event.prototype.propagationStopped = false;


/**
Normalized immediatePropagationStopped.

This property should be considered read-only.

To immediately stop propagation call Event.stopImmediatePropagation().

@type {boolean}
*/
rocket.Event.prototype.immediatePropagationStopped = false;


/**
Normalized defaultPrevented.

This property should be considered read-only.

To prevent the default related Event action call Event.preventDefault().

@type {boolean}
*/
rocket.Event.prototype.defaultPrevented = false;


/**
Normalized stopPropagation.

@link
https://developer.mozilla.org/en-US/docs/Web/API/event.stopPropagation
*/
rocket.Event.prototype.stopPropagation = function() {

  if (this.originalEvent) {

    if (typeof this.originalEvent.stopPropagation === 'function') {

      this.originalEvent.stopPropagation();

    } else {

      this.originalEvent.cancelBubble = true;

    }

  }

  this.propagationStopped = true;

};


/**
Normalized stopImmediatePropagation().

@link
https://developer.mozilla.org/en-US/docs/Web/API/event.stopImmediatePropagation
*/
rocket.Event.prototype.stopImmediatePropagation = function() {

  if (this.originalEvent &&
      typeof this.originalEvent.stopImmediatePropagation === 'function') {

    this.originalEvent.stopImmediatePropagation();

  }

  this.immediatePropagationStopped = true;

};


/**
Normalized preventDefault().

@link
https://developer.mozilla.org/en-US/docs/Web/API/event.preventDefault
*/
rocket.Event.prototype.preventDefault = function() {

  if (this.originalEvent) {

    if (typeof this.originalEvent.preventDefault === 'function') {

      this.originalEvent.preventDefault();

    } else {

      this.originalEvent.returnValue = false;

    }

  }

  this.defaultPrevented = true;

};


/**
Compare two Objects and determines if they contain identical properties.

Descends recursively into Objects.

@param {Object} a An Object to compare.
@param {Object} b An Object to compare.
@return {boolean} Whether the given Objects contain identical properties.
@test {true} Objects with same properties.
rocket.equal({'a': 'b', 'c': [0, 1]}, {'a': 'b', 'c': [0, 1]});
@test {false} Objects tested with equal operator.
({'a': 'b', 'c': [0, 1]} === {'a': 'b', 'c': [0, 1]});
@test {false} Objects without same properties.
rocket.equal({'a': 'b'}, {'a': 'b', 'c': [0, 1]});
@test {true} HTMLBodyElement.
rocket.equal(document.body, document.body);
@test {true} Equivalent HTMLDivElement.
rocket.equal(document.createElement('div'), document.createElement('div'));
@test {false} Equivalent HTMLDivElement but appended to another Element.
var foo = document.createElement('div');
var bar = document.createElement('div');
var baz = document.createElement('div');
baz.appendChild(foo);
baz.appendChild(bar);
rocket.equal(foo, bar);
@test {false} Two different HTMLElement.
rocket.equal(document.createElement('div'), document.createElement('span'));
@test {true} Circular references that are equal.
var foo = {};
var bar = {};
var baz = {};

foo.foo = baz;
bar.foo = baz;

baz.foo = foo;
baz.bar = bar;

baz.baz = 'baz';

rocket.equal(foo, bar);
@test {false} Circular references that are not equal.
var foo = {};
var bar = {};
var baz = {};

foo.foo = baz;
bar.foo = bar; // self circular reference

baz.foo = foo;
baz.bar = bar;

baz.baz = 'baz';

rocket.equal(foo, bar);
@test {true} HTMLDocumentElement.
rocket.equal(document, document);
@test {false} HTMLDocumentElement and HTMLBodyElement.
rocket.equal(document.body, document);
@test {false} HTMLDocumentElement and HTMLBodyElement.
rocket.equal(document, document.body);
@test {true} HTMLBodyElement.
rocket.equal(document.body, document.body);
*/
rocket.equal = function(a, b) {

  return rocket.equal.equal_(a, b, [], []);

};


/**
Equal function with reference Array.

@private
@param {Object} a
@param {Object} b
@param {Array.<Object>} as
@param {Array.<Object>} bs
@return {boolean}
*/
rocket.equal.equal_ = function(a, b, as, bs) {

  if (a === b) {
    return true;
  }

  for (var i = 0; as[i]; ++i) {
    if ((as[i] === a) && (bs[i] === b)) {
      return true;
    }
  }

  if (
      a === null || typeof a !== 'object' ||
      b === null || typeof b !== 'object'
  ) {

    return a === b;

  } else {

    var a_is_array = rocket.isArray(a);
    var b_is_array = rocket.isArray(b);

    if (
        (a_is_array && !b_is_array) ||
        (!a_is_array && b_is_array)
    ) {
      return false;
    }

    as.push(a);
    bs.push(b);

    for (var i in a) {

      if (!rocket.equal.equal_(a[i], b[i], as, bs)) {
        return false;
      }

    }

    for (var i in b) {
      if (!(i in a)) {
        return false;
      }
    }

  }

  return true;

};



/**
A wrapper class used to represent and easily manipulate the given Array of
Elements.

Returned from the rocket.$ query function.

@constructor
@param {(NodeList|Array.<Element>)} elements An Array of Elements to represent.
@see {rocket.$}
*/
rocket.Elements = function(elements) {
  this.length = elements.length;
  for (var i = 0; elements[i]; ++i) {
    this[i] = elements[i];
  }
};


/**
Adds a class or a list of classes to these Elements.

The class_names given will be added to every one of these Elements.

The class_names are arrayify'd.

@param {(string|Array.<string>)} class_names The class names to add.
@return {rocket.Elements} These elements.
@see {rocket.arrayify}
@example
// any of the following lines will add the two classes "foo" and "bar" to "body"
$('body').addClass('foo').addClass('bar');
$('body').addClass('foo bar');
$('body').addClass('foo,bar');
$('body').addClass('foo, bar');
$('body').addClass('foo bar');
$('body').addClass(['foo','bar']);
*/
rocket.Elements.prototype.addClass = function(class_names) {

  class_names = rocket.arrayify(class_names);

  var memo = {};

  var i = 0;
  var len = this.length;

  var j;
  var jlen = class_names.length;

  var initial_class_name;

  var final_class_name;
  var joined_class_names = class_names.join(' ');

  for (; i < len; ++i) {

    initial_class_name =
        /** @type {Element} */ (this[i]).className;

    if (initial_class_name in memo) {

      this[i].className = memo[initial_class_name];

    } else {

      if (initial_class_name === '' ||
          initial_class_name === joined_class_names) {

        final_class_name = class_names;

      } else {

        final_class_name = rocket.arrayify(initial_class_name);

        for (j = 0; j < jlen; ++j) {
          if (rocket.indexOf(final_class_name, class_names[j]) === -1) {
            final_class_name.push(class_names[j]);
          }
        }

      }

      this[i].className = memo[initial_class_name] = final_class_name.join(' ');

    }

  }

  return this;

};


/**
Adds an EventListener to the these Elements.

The types are arrayify'd.

@param {(string|Array.<string>)} types
@param {(EventListener|function(Event))} fnct
@return {rocket.Elements}
@see {rocket.EventListener}
@see {rocket.EventTarget}
@example
$('body').addEventListener('click',function(){
  alert('You just clicked the ' + this.nodeName);
});

$('body').addEventListener('mouseenter', function(){
  alert('Your mouse entered the ' + this.nodeName);
});

$('body').addEventListener('mouseenter, mouseleave', function(){
  alert('Your mouse entered or left the ' + this.nodeName);
});

$('body').addEventListener(['mouseenter', 'mouseleave'], function(){
  alert('Your mouse entered or left the ' + this.nodeName);
});
*/
rocket.Elements.prototype.addEventListener = function(types, fnct) {

  var i = 0;
  var len = this.length;

  types = rocket.arrayify(types);
  for (; i < len; ++i) {
    for (var j = 0; types[j]; ++j) {
      rocket.EventTarget.prototype.addEventListener.call(
          this[i],
          types[j],
          fnct
      );
    }
  }

  return this;

};


/**
Appends a child Element to these Elements.

Returns a rocket.Elements of the appended child node(s).

The given child can be a rocket.Elements wrapped array of Elements or an
Element created directly from document.createElement.

@param {(Element|Array.<Element>|rocket.Elements)} child_node
  The node(s) to append.
@return {rocket.Elements} Appended child node(s).
@link https://developer.mozilla.org/en-US/docs/Web/API/Node.appendChild
@example
$('body').appendChild($.createElement('div'));
$('body').appendChild(document.createElement('div'));
$('body').appendChild($('div'));
*/
rocket.Elements.prototype.appendChild = function(child_node) {

  var i;
  var len;
  var child_nodes;

  if (this.length) {

    if (child_node.nodeType) {
      child_nodes = [child_node];
    } else {
      child_nodes =
          /** @type {Array.<Element>} */ (child_node);
    }

    i = 0;
    len = child_nodes.length;

    for (; i < len; ++i) {
      /** @type {Element} */ (this[0]).appendChild(child_nodes[i]);
    }

  } else {
    child_nodes = [];
  }

  return new rocket.Elements(child_nodes);

};


/**
Maps malformed attributes to their proper cased attribute names.

@private
@type {Object.<string, string>}
*/
rocket.Elements.attribute_map_ = {
  'acceptcharset': 'acceptCharset',
  'accesskey': 'accessKey',
  'cellindex': 'cellIndex',
  'cellpadding': 'cellPadding',
  'cellspacing': 'cellSpacing',
  'characterset': 'characterSet',
  'classlist': 'classList',
  'classname': 'className',
  'clientheight': 'clientHeight',
  'clientleft': 'clientLeft',
  'clienttop': 'clientTop',
  'clientwidth': 'clientWidth',
  'colspan': 'colSpan',
  'contenteditable': 'contentEditable',
  'datetime': 'dateTime',
  'defaultcharset': 'defaultCharset',
  'defaultchecked': 'defaultChecked',
  'defaultselected': 'defaultSelected',
  'defaultvalue': 'defaultValue',
  'defaultview': 'defaultView',
  'documentelement': 'documentElement',
  'for': 'htmlFor',
  'frameborder': 'frameBorder',
  'htmlfor': 'htmlFor',
  'innerhtml': 'innerHTML',
  'innertext': 'innerText',
  'keytype': 'keyType',
  'maxlength': 'maxLength',
  'noresize': 'noResize',
  'offsetheight': 'offsetHeight',
  'offsetleft': 'offsetLeft',
  'offsetparent': 'offsetParent',
  'offsettop': 'offsetTop',
  'offsetwidth': 'offsetWidth',
  'outerhtml': 'outerHTML',
  'outertext': 'outerText',
  'readonly': 'readOnly',
  'readystate': 'readyState',
  'rowindex': 'rowIndex',
  'rowspan': 'rowSpan',
  'screenleft': 'screenLeft',
  'screentop': 'screenTop',
  'scrollheight': 'scrollHeight',
  'scrollleft': 'scrollLeft',
  'scrolltop': 'scrollTop',
  'scrollwidth': 'scrollWidth',
  'sectionrowindex': 'sectionRowIndex',
  'selectedindex': 'selectedIndex',
  'selectionend': 'selectionEnd',
  'selectionstart': 'selectionStart',
  'sourceindex': 'sourceIndex',
  'tabindex': 'tabIndex',
  'tagname': 'tagName',
  'tbodies': 'tBodies',
  'tfoot': 'tFoot',
  'thead': 'tHead',
  'usemap': 'useMap',
  'valign': 'vAlign'
};


/**
Calls blur on the first Element of these Elements.

@return {rocket.Elements} These elements.
@example
$('input').blur();
*/
rocket.Elements.prototype.blur = function() {

  if (this.length) {
    /** @type {Element} */ (this[0]).blur();
  }

  return this;

};


/**
Checks/unchecks these Elements or returns the first of these Elements
checked state.

If opt_checked is given, then check or uncheck these Elements.  If not,
then return whether the first of these Elements is checked.

@param {boolean=} opt_checked Check/uncheck these Elements.
@return {(rocket.Elements|boolean|undefined)}
  Whether the first of these Elements is checked.
*/
rocket.Elements.prototype.checked = function(opt_checked) {

  if (arguments.length === 0) {
    return /** @type {boolean|undefined} */ (this.getAttribute('checked'));
  } else {
    return this.setAttribute('checked', opt_checked);
  }

};


/**
Returns a rocket.Elements of these elements children (replaces childNodes).

If you don't know the difference between this and childNodes,
this is the method that you actually want to use.

@return {rocket.Elements} These elements.
@link
https://developer.mozilla.org/en-US/docs/Web/API/ParentNode.children
@example
$('body').children();
*/
rocket.Elements.prototype.children = function() {

  var i = 0;
  var len = this.length;
  var children = [];
  var j;
  var jlen;
  var this_i_children;
  var this_i_children_j;

  for (; i < len; ++i) {

    this_i_children =
        /** @type {Element} */ (this[i]).children;
    j = 0;
    jlen = this_i_children.length;

    for (; j < jlen; ++j) {

      this_i_children_j =
          /** @type {Element} */ (this_i_children[j]);

      if (this_i_children_j.nodeType === 1) {
        children.push(this_i_children_j);
      }

    }

  }

  return new rocket.Elements(children);

};


/**
cloneNode

@param {boolean} deep
@return {rocket.Elements}
*/
rocket.Elements.prototype.cloneNode = function(deep) {

  var results = [];

  for (var i = 0, len = this.length; i < len; ++i) {

    results[i] = /** @type {Element} */ (this[i]).cloneNode(deep);

  }

  return new rocket.Elements(results);

};


/**
Checks if all of these Elements contain the given Element.

@param {(Element|rocket.Elements)} element The Element.
@return {boolean} Whether the Element is contained by all of these Elements.
*/
rocket.Elements.prototype.contains = function(element) {

  var elements = rocket.$(element);

  for (var i = 0, len = this.length, jlen = elements.length; i < len; ++i) {
    for (var j = 0; j < jlen; ++j) {
      if (!(/** @type {Element} */ (this[i])).contains(elements[j])) {
        return false;
      }
    }
  }

  return true;

};


/**
Set/get the dataset attributes on these Elements.

@param {(string|Object.<string, string>)} attribute The attribute.
@param {string=} opt_value The value to set.
@return {(string|undefined|rocket.Elements)} This Elements.
@link
https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.dataset
@example
// set the value of 'foo' to 'bar' two different ways
$('body').dataset('foo','bar');
$('body').dataset({'foo': 'bar'});

// get the value of 'foo'
$('body').dataset('foo');
*/
rocket.Elements.prototype.dataset = function(attribute, opt_value) {

  var attributes;

  /** @type {string} */
  var key;

  var i = 0;
  var len = this.length;

  if (arguments.length === 1) {

    if (typeof attribute === 'string') {

      if (len) {
        return this.dataset_get_(this[0], attribute);
      } else {
        return undefined;
      }

    } else {

      attributes = attribute;

    }

  } else {

    attributes = {};
    attributes[attribute] = opt_value;

  }


  for (; i < len; ++i) {
    for (key in attributes) {
      this.dataset_set_(this[i], key, attributes[key]);
    }
  }

  return this;

};


/**
Get a dataset attribute from an element.

@private
@param {HTMLElement} element The Element.
@param {string} attribute The attribute.
@return {string} The value.
*/
rocket.Elements.prototype.dataset_get_ = function(element, attribute) {

  if (element.dataset) {

    rocket.Elements.prototype.dataset_get_ = function(element, attribute) {
      return element.dataset[attribute];
    };

  } else {

    rocket.Elements.prototype.dataset_get_ = function(element, attribute) {
      return element.getAttribute('data-' + attribute);
    };

  }

  return rocket.Elements.prototype.dataset_get_(element, attribute);

};


/**
Set a dataset attribute on an element.

@private
@param {HTMLElement} element The Element.
@param {string} key The attribute key.
@param {string} value The value.
*/
rocket.Elements.prototype.dataset_set_ = function(element, key, value) {

  if (element.dataset) {

    rocket.Elements.prototype.dataset_set_ = function(element, key, value) {
      element.dataset[key] = value;
    };

  } else {

    rocket.Elements.prototype.dataset_set_ = function(element, key, value) {
      element.setAttribute('data-' + key, value);
    };

  }

  rocket.Elements.prototype.dataset_set_(element, key, value);

};


/**
Enables and disables these Elements.

@param {boolean=} opt_disabled Disabled state.
@return {(rocket.Elements|boolean|undefined)}
  The disabled state or these elements.
*/
rocket.Elements.prototype.disabled = function(opt_disabled) {

  if (arguments.length === 0) {
    return /** @type {boolean|undefined} */ (this.getAttribute('disabled'));
  } else {
    return this.setAttribute('disabled', opt_disabled);
  }

};


/**
dispatch.

@param {(Event|string)} event_or_type
@return {rocket.Elements}
*/
rocket.Elements.prototype.dispatchEvent = function(event_or_type) {

  var events;
  var i = 0;
  var len = this.length;

  if (event_or_type.type) {
    events = [event_or_type];
  } else {
    events = rocket.arrayify(/** @type {string} */ (event_or_type));
  }

  for (; i < len; ++i) {
    for (var j = 0; events[j]; ++j) {
      rocket.EventTarget.prototype.dispatchEvent.call(
          this[i],
          events[j]
      );
    }
  }

  return this;

};


/**
Elements every.

@param {function(this:Object, Object, number, Object)} fnct The fnct.
@param {Object=} opt_self The value to use as this when executing fnct.
@return {boolean} True if every; else false.
*/
rocket.Elements.prototype.every = function(fnct, opt_self) {

  if (Array.prototype.every) {

    rocket.Elements.prototype.every = Array.prototype.every;

  } else {

    rocket.Elements.prototype.every = function(fnct, opt_self) {
      return rocket.every(this, fnct, opt_self);
    };

  }

  return this.every(fnct, opt_self);

};


/**
Fades these elements to a given opacity.

@param {number} to_opacity
  The opacity to which to fade. A number between zero and one.
@param {number=} opt_duration
  The duration of the fade in milliseconds or defaults to rocket.step duration.
@param {function(this:rocket.Elements)=} opt_callback
  Callback to execute after the fade on these elements.
@return {rocket.Elements} These Elements.
@example
// fade away the body in three seconds
$('body').fade(0, 3000, function(){
  alert('I am done fading!');
});
@see {rocket.step}
@link http://www.w3schools.com/cssref/css3_pr_opacity.asp
*/
rocket.Elements.prototype.fade =
    function(to_opacity, opt_duration, opt_callback) {

  var i = 0;
  var len = this.length;
  var self = this;

  /** @type {Array.<number>} */
  var opacity_initials = [];
  /** @type {Array.<number>} */
  var opacity_deltas = [];
  /** @type {Array.<rocket.Elements>} */
  var elementses = [];

  var callback;

  if (opt_callback) {

    callback = function() {
      opt_callback.call(self);
    };

  }

  for (; i < len; ++i) {

    elementses[i] = new rocket.Elements([this[i]]);
    opacity_initials[i] =
        /** @type {number} */ (elementses[i].style('opacity'));
    opacity_deltas[i] = to_opacity - opacity_initials[i];

  }

  rocket.step(
      function(x, trig_x) {

        for (i = 0; i < len; ++i) {

          elementses[i].style(
              'opacity',
              opacity_initials[i] +
              trig_x * opacity_deltas[i]
          );

        }

      },
      opt_duration,
      callback
  );

  return this;

};


/**
Elements filter.

@param {function(this:Object, Object, number, Object)} fnct The fnct.
@param {Object=} opt_self The value to use as this when executing fnct.
@return {rocket.Elements} Filtered Elements.
*/
rocket.Elements.prototype.filter = function(fnct, opt_self) {
  return new rocket.Elements(rocket.filter(this, fnct, opt_self));
};


/**
Returns a rocket.Elements of these elements firstElementChild.

If you don't know the difference between this and firstChild,
this is the method that you actually want to use.

@return {rocket.Elements} These elements.
*/
rocket.Elements.prototype.firstElementChild = function() {

  if (this.length === 0) {

    return new rocket.Elements([]);

  } else {

    if (/** @type {Element} */ (this[0]).firstElementChild !== undefined) {

      rocket.Elements.prototype.firstElementChild = function() {

        var i = 0;
        var len = this.length;
        var children = [];
        var child;

        for (; i < len; ++i) {

          child = /** @type {Element} */ (this[i]).firstElementChild;

          if (child) {
            children.push(child);
          }

        }

        return new rocket.Elements(children);

      };

    } else {

      rocket.Elements.prototype.firstElementChild = function() {

        var i = 0;
        var len = this.length;
        var children = [];
        var child;

        for (; i < len; ++i) {

          child = /** @type {Element} */ (this[i]).firstChild;

          while (child && child.nodeType !== 1) {
            child = child.nextSibling;
          }

          if (child) {
            children.push(child);
          }

        }

        return new rocket.Elements(children);

      };

    }

    return this.firstElementChild();

  }

};


/**
Fits these Elements within a container.

@param {rocket.Elements=} opt_container
@return {rocket.Elements} These Elements.
*/
rocket.Elements.prototype.fit = function(opt_container) {

  var container;

  if (arguments.length) {

    container = opt_container.getBoundingClientRect();

  } else {

    var body = document.body;
    var documentElement = document.documentElement;

    container = {
      'left': 0,
      'top': 0,
      'right':
          window.innerWidth ||
          documentElement && documentElement.clientWidth ||
          body && body.clientWidth ||
          0,
      'bottom':
          window.innerHeight ||
          documentElement && documentElement.clientHeight ||
          body && body.clientHeight ||
          0
    };

  }

  var i = 0;
  var len = this.length;

  for (; i < len; ++i) {

    var element = this.i(i);

    var rect = element.getBoundingClientRect();

    if (rect.right > container.right) {
      element.style(
          'left',
          element.style('left') - rect.right + container.right - 20
      );
    }

    if (rect.bottom > container.bottom) {
      element.style(
          'top',
          element.style('top') - rect.bottom + container.bottom - 20
      );
    }

    if (rect.left < container.left) {
      element.style(
          'right',
          element.style('right') - container.left + rect.left + 20
      );
    }

    if (rect.top < container.top) {
      element.style(
          'bottom',
          element.style('bottom') - container.bottom + rect.bottom + 20
      );
    }

  }

  return this;

};


/**
Focus on the first element of these Elements.

@return {rocket.Elements} These elements.
*/
rocket.Elements.prototype.focus = function() {

  if (this.length) {
    /** @type {Element} */ (this[0]).focus();
  }

  return this;

};


/**
Elements forEach.

@param {function(this:Object, Object, number, Object)} fnct The fnct.
@param {Object=} opt_self The value to use as this when executing fnct.
*/
rocket.Elements.prototype.forEach = function(fnct, opt_self) {

  if (Array.prototype.forEach) {

    rocket.Elements.prototype.forEach = Array.prototype.forEach;

  } else {

    rocket.Elements.prototype.forEach = function(fnct, opt_self) {
      return rocket.forEach(this, fnct, opt_self);
    };

  }

  this.forEach(fnct, opt_self);

};


/**
Gets an attribute from the first of these element(s).

Case sensitive attributes are automatically properly cased.

Reserved word attributes are properly remapped.

This returns undefined if there are no elements in this rocket.Elements.

For getting the value of an HTMLSelectElement:
if a value is present on the selected option,
then that value will be returned.  If a value is not present on the
selected option, then that option's innerHTML will be returned.

For getting the value of an HTMLSelectElement with the multiple property
set: an array of selected option values is returned.

@param {string} attribute The attribute.
@return {(string|boolean|number|Array.<string>|undefined)} The first value.
*/
rocket.Elements.prototype.getAttribute = function(attribute) {

  var element;
  var option;
  var options;
  var i;
  var len;
  var values;
  var value;

  if (this.length) {

    element = /** @type {Element} */ (this[0]);

    if (attribute === 'value' && element.nodeName === 'SELECT') {

      element = /** @type {HTMLSelectElement} */ (element);

      if (element.multiple) {

        options = element.options;

        i = 0;
        len = options.length;
        values = [];

        for (; i < len; ++i) {

          option = /** @type {HTMLOptionElement} */ (options[i]);

          if (option.selected) {

            values.push(option.value || option.innerHTML);

          }

        }

        return values;

      } else {

        value = element.value;

        if (value) {

          return value;

        } else {

          option = /** @type {HTMLOptionElement} */
              (element.options[element.selectedIndex]);

          return option.value || option.innerHTML;

        }

      }

    } else {

      return element[rocket.Elements.attribute_map_[attribute] || attribute];

    }

  } else {

    return undefined;

  }

};


/**
Normalized getBoundingClientRect.

Use this to determine an element's horizontal and vertical
offset, width, and height.

This returns an object that has the following numeric properties:
<ul>
  <li>top
  <li>right
  <li>bottom
  <li>left
  <li>width
  <li>height
</ul>

@param {boolean=} opt_no_offset
  Set to true to ignore the window's current scroll position.
@return {ClientRect} The bounding client rectangle.
*/
rocket.Elements.prototype.getBoundingClientRect = function(opt_no_offset) {

  if (this.length) {

    var rect = /** @type {Element} */ (this[0]).getBoundingClientRect();
    var documentElement = document.documentElement;
    var body = document.body;

    var y_offset;
    var x_offset;

    if (opt_no_offset) {

      y_offset = 0;
      x_offset = 0;

    } else {

      y_offset =
          ((window.pageYOffset === 0) ?
              0 :
              (window.pageYOffset ||
              documentElement && documentElement.scrollTop ||
              body && body.scrollTop ||
              0)) -
          (documentElement && documentElement.clientTop ||
          body && body.clientTop ||
          0);

      x_offset =
          ((window.pageXOffset === 0) ?
              0 :
              (window.pageXOffset ||
              documentElement && documentElement.scrollLeft ||
              body && body.scrollLeft ||
              0)) -
          (documentElement && documentElement.clientLeft ||
          body && body.clientLeft ||
          0);

    }

    return /** @type {ClientRect} */ ({
      top: rect.top + y_offset,
      right: rect.right + x_offset,
      bottom: rect.bottom + y_offset,
      left: rect.left + x_offset,
      width: rect.width || (rect.right - rect.left),
      height: rect.height || (rect.bottom - rect.top)
    });

  } else {

    return /** @type {ClientRect} */ ({
      top: NaN,
      right: NaN,
      bottom: NaN,
      left: NaN,
      width: NaN,
      height: NaN
    });

  }

};


/**
Checks to see if any of these elements have any of class_names.

@param {(string|Array.<string>)} class_names The class names to check.
@return {boolean} True if an element exists in these Elements that has a class
  found in class_names.
*/
rocket.Elements.prototype.hasClass = function(class_names) {

  class_names = rocket.arrayify(class_names);

  /** @type {Array.<RegExp>} */
  var reg_exps = [];
  var this_class_name;

  var i = 0;
  var len = this.length;

  var j;
  var jlen = class_names.length;

  for (; i < len; ++i) {

    this_class_name = /** @type {Element} */ (this[i]).className;

    for (j = 0; j < jlen; ++j) {

      if (!reg_exps[j]) {
        reg_exps[j] = new RegExp('(?:\\s|^)' + class_names[j] + '(?:\\s|$)');
      }

      if (reg_exps[j].test(this_class_name)) {
        return true;
      }

    }
  }

  return false;

};


/**
Hides these elements.

Sets the display style of these Elements to none.

If the opt_visibility parameter is true, then visibility,
instead of display is used; visibility is set to hidden.

@param {boolean=} opt_visibility Use visibility.
@return {rocket.Elements} These elements.
*/
rocket.Elements.prototype.hide = function(opt_visibility) {

  return /** @type {rocket.Elements} */ (this.style(
      opt_visibility ?
          {'visibility': 'hidden'} :
          {'display': 'none'}
      ));

};


/**
Return a new rocket.Elements containing only the Element at offset i.

@param {number} i The offset.
@return {rocket.Elements} The new rocket.Elements.
*/
rocket.Elements.prototype.i = function(i) {

  if (this[i]) {
    return new rocket.Elements([this[i]]);
  } else {
    return new rocket.Elements([]);
  }

};


/**
Returns the first index at which a given element can be found in the array,
or -1 if it is not present.

@param {(Element|rocket.Elements|Array.<Element>)} needle
  The Element to locate in the array.
@param {number=} opt_offset The position from which to start the search.
@return {number}
  The index of the located element or -1 if the element was not found.
*/
rocket.Elements.prototype.indexOf = function(needle, opt_offset) {

  var element;

  if (needle.nodeType) {
    element = needle;
  } else {
    element = /** @type {Element} */ (needle[0]);
  }

  return rocket.indexOf(
      this,
      element,
      opt_offset
  );

};


/**
Sets/gets this innerHTML text.

@param {string=} opt_html The innerHTML.
@return {(rocket.Elements|string|undefined)} The string or these elements.
*/
rocket.Elements.prototype.innerHTML = function(opt_html) {

  if (arguments.length === 0) {
    return /** @type {(string|undefined)} */ (this.getAttribute('innerHTML'));
  } else {
    return this.setAttribute('innerHTML', opt_html);
  }

};


/**
Returns a rocket.Elements of the appended child nodes.

@param {(Element|Array.<Element>|rocket.Elements)} child_node
  The node(s) to append.
@param {(Element|Array.<Element>|rocket.Elements)} before_these
  The node before which to insert.
@return {rocket.Elements} Appended child nodes.
*/
rocket.Elements.prototype.insertBefore = function(child_node, before_these) {

  var i;
  var len;

  var before_this;
  var child_nodes;

  if (this.length) {

    if (child_node.nodeType) {
      child_nodes = [child_node];
    } else {
      child_nodes = /** @type {Array.<Element>} */ (child_node);
    }


    if (!before_these) {
      before_this = null;
    } else {
      if (before_these.nodeType) {
        before_this = before_these;
      } else {
        before_this = /** @type {Element} */ (before_these[0]);
      }
    }

    i = 0;
    len = child_nodes.length;

    for (; i < len; ++i) {
      /** @type {Element} */ (this[0]).insertBefore(
          child_nodes[i],
          /** @type {Element} */ (before_this) || null
      );
    }

  } else {

    child_nodes = [];

  }

  return new rocket.Elements(child_nodes);

};


/**
Returns a rocket.Elements of these elements lastElementChild.

If you don't know the difference between this and lastChild,
this is the method that you actually want to use.

@return {rocket.Elements} These elements.
*/
rocket.Elements.prototype.lastElementChild = function() {

  if (this.length === 0) {

    return new rocket.Elements([]);

  } else {

    if (/** @type {Element} */ (this[0]).lastElementChild !== undefined) {

      rocket.Elements.prototype.lastElementChild = function() {

        var i = 0;
        var len = this.length;
        var children = [];
        var child;

        for (; i < len; ++i) {

          child = /** @type {Element} */ (this[i]).lastElementChild;

          if (child) {
            children.push(child);
          }

        }

        return new rocket.Elements(children);

      };

    } else {

      rocket.Elements.prototype.lastElementChild = function() {

        var i = 0;
        var len = this.length;
        var children = [];
        var child;

        for (; i < len; ++i) {

          child = /** @type {Element} */ (this[i]).lastChild;

          while (child && child.nodeType !== 1) {
            child = child.previousSibling;
          }

          if (child) {
            children.push(child);
          }

        }

        return new rocket.Elements(children);

      };

    }

    return this.lastElementChild();

  }


};


/**
Returns the last index at which a given element can be found in the array,
or -1 if it is not present.

@param {(Element|rocket.Elements|Array.<Element>)} needle
  The Element to locate in the array.
@param {number=} opt_offset The position from which to start the search.
@return {number}
  The index of the located element or -1 if the element was not found.
*/
rocket.Elements.prototype.lastIndexOf = function(needle, opt_offset) {

  var element;

  if (needle.nodeType) {

    element = needle;

  } else {

    element = /** @type {Element} */ (needle[0]);

  }

  return rocket.lastIndexOf(
      this,
      element,
      opt_offset
  );

};


/**
The number of Elements.

@type {number}
*/
rocket.Elements.prototype.length;


/**
Binds a live event handler to these elements.

@param {string} selector The CSS selector to match descendant elements.
@param {(string|Array.<string>)} handles The event types and
  namespaces to be used to attach the given handler.
@param {function(Event)} handler The event handler.
@return {rocket.Elements} This Elements.
*/
rocket.Elements.prototype.live = function(selector, handles, handler) {

  return this.addEventListener(
      handles,
      /**
      @this {Element}
      @param {Event} event The event.
      */
      function(event) {

        var element = /** @type {Event} */ (event).target;

        while (element && element !== this) {

          if (
              rocket.Elements.matches_helper_(
                  /** @type {Element} */ (element),
                  selector
              )
          ) {

            handler.call(element, event);

          }

          element = /** @type {Node} */ (element).parentNode;

        }

      }

  );

};


/**
Elements map.

@param {function(this:Object, Object, number, Object)} fnct The fnct.
@param {Object=} opt_self The value to use as this when executing fnct.
@return {Array} Array of return values.
*/
rocket.Elements.prototype.map = function(fnct, opt_self) {

  if (Array.prototype.map) {

    rocket.Elements.prototype.map = Array.prototype.map;

  } else {

    rocket.Elements.prototype.map = function(fnct, opt_self) {
      return rocket.map(this, fnct, opt_self);
    };

  }

  return this.map(fnct, opt_self);

};


/**
matches matchesSelector.

@param {string} query
@return {boolean}
*/
rocket.Elements.prototype.matches = function(query) {

  var i = 0;
  var len = this.length;

  for (; i < len; ++i) {
    if (!rocket.Elements.matches_helper_(this[i], query)) {
      return false;
    }
  }

  return true;

};


/**
matches.

@private
@param {Element} element
@param {string} query
@return {boolean}
*/
rocket.Elements.matches_helper_ = function(element, query) {

  if (document.body.webkitMatchesSelector) {

    rocket.Elements.matches_helper_ = function(element, query) {
      return element.webkitMatchesSelector(query);
    };

  } else if (document.body.mozMatchesSelector) {

    rocket.Elements.matches_helper_ = function(element, query) {
      return element.mozMatchesSelector(query);
    };

  } else if (document.body.msMatchesSelector) {

    rocket.Elements.matches_helper_ = function(element, query) {
      return element.msMatchesSelector(query);
    };

  } else if (document.body.matches) {

    rocket.Elements.matches_helper_ = function(element, query) {
      return element.matches(query);
    };

  } else {

    rocket.Elements.matches_helper_ = function(element, query) {

      if (query.charAt(0) === '#') {
        return element.id === query.substr(1);
      } else {

        var dot = query.indexOf('.');

        if (dot === -1) {
          return element.nodeName === query.toUpperCase();
        } else {
          var node_name = query.substr(0, dot).toUpperCase();
          if (!node_name || node_name === element.nodeName) {
            var class_name = query.substr(dot + 1);
            var class_names = rocket.arrayify(element.className);
            for (var i = 0; class_names[i]; ++i) {
              if (class_names[i] === class_name) {
                return true;
              }
            }
          }
          return false;
        }

      }

    };

  }

  return rocket.Elements.matches_helper_(element, query);

};


/**
Returns a rocket.Elements of these elements nextElementSibling.

If you don't know the difference between this and nextSibling,
this is the method that you actually want to use.

@return {rocket.Elements} These elements.
*/
rocket.Elements.prototype.nextElementSibling = function() {

  if (this.length === 0) {

    return new rocket.Elements([]);

  } else {

    if (/** @type {Element} */ (this[0]).nextElementSibling !== undefined) {

      rocket.Elements.prototype.nextElementSibling = function() {

        var i = 0;
        var len = this.length;
        var siblings = [];
        var sibling;

        for (; i < len; ++i) {

          sibling = /** @type {Element} */ (this[i]).nextElementSibling;

          if (sibling) {

            siblings.push(sibling);

          }

        }

        return new rocket.Elements(siblings);

      };

    } else {

      rocket.Elements.prototype.nextElementSibling = function() {

        var i = 0;
        var len = this.length;
        var siblings = [];
        var sibling;

        for (; i < len; ++i) {

          sibling = /** @type {Element} */ (this[i]).nextSibling;

          while (sibling && sibling.nodeType !== 1) {
            sibling = sibling.nextSibling;
          }

          if (sibling) {

            siblings.push(sibling);

          }

        }

        return new rocket.Elements(siblings);

      };

    }

    return this.nextElementSibling();

  }

};


/**
Returns a rocket.Elements of these elements parentNode.

@return {rocket.Elements} These elements.
*/
rocket.Elements.prototype.parentNode = function() {

  var i = 0;
  var len = this.length;
  var parent;
  var parents = [];

  for (; i < len; ++i) {
    parent = /** @type {Element} */ (this[i]).parentNode;
    if (parent) {
      parents.push(parent);
    }
  }

  return new rocket.Elements(parents);

};


/**
Pops an element from the end of this Elements.

@return {(undefined|rocket.Elements)} The pop'd Element.
*/
rocket.Elements.prototype.pop = function() {

  if (this.length) {

    var element = /** @type {Element} */ (this[--this.length]);

    delete this[this.length];

    return new rocket.Elements([element]);

  } else {

    return new rocket.Elements([]);

  }

};


/**
Prevents these elements from being selected or "highlighted".

@return {rocket.Elements} These elements.
*/
rocket.Elements.prototype.preventSelect = function() {

  return this.addEventListener(
      [
        'selectstart.preventSelect',
        'mousedown.preventSelect'
      ],
      /** @type {function(Event)} */
      (function(the_event) {
        the_event.preventDefault();
      })
  );

};


/**
Returns a rocket.Elements of these elements previousElementSibling.

If you don't know the difference between this and previousSibling,
this is the method that you actually want to use.

@return {rocket.Elements} These elements.
*/
rocket.Elements.prototype.previousElementSibling = function() {

  if (this.length === 0) {

    return new rocket.Elements([]);

  } else {

    if (/** @type {Element} */ (this[0]).previousElementSibling !== undefined) {

      rocket.Elements.prototype.previousElementSibling = function() {

        var i = 0;
        var len = this.length;
        var siblings = [];
        var sibling;

        for (; i < len; ++i) {

          sibling = /** @type {Element} */ (this[i]).previousElementSibling;

          if (sibling) {

            siblings.push(sibling);

          }

        }

        return new rocket.Elements(siblings);

      };

    } else {

      rocket.Elements.prototype.previousElementSibling = function() {

        var i = 0;
        var len = this.length;
        var siblings = [];
        var sibling;

        for (; i < len; ++i) {

          sibling = /** @type {Element} */ (this[i]).previousSibling;

          while (sibling && sibling.nodeType !== 1) {
            sibling = sibling.previousSibling;
          }

          if (sibling) {

            siblings.push(sibling);

          }

        }

        return new rocket.Elements(siblings);

      };

    }

    return this.previousElementSibling();

  }

};


/**
Pushes an element onto the end of this Elements.

@param {...Element} var_args The Element(s).
@return {number} The new number of Elements in this.
*/
rocket.Elements.prototype.push = function(var_args) {
  return Array.prototype.push.apply(this, arguments);
};


/**
Reduces these elements.

@param {function(*=, *=, number=, (Array|rocket.Elements)=) : *} fnct
  The reducer.
@param {*=} opt_initial_value The initial value.
@return {*} The reduced value (the return value of the reducer function).
*/
rocket.Elements.prototype.reduce = function(fnct, opt_initial_value) {

  if (Array.prototype.reduce) {

    rocket.Elements.prototype.reduce = Array.prototype.reduce;

  } else {

    rocket.Elements.prototype.reduce = function(fnct, opt_initial_value) {

      if (arguments.length === 2) {

        return rocket.reduce(this, fnct, opt_initial_value);

      } else {

        return rocket.reduce(this, fnct);

      }

    };

  }

  if (arguments.length === 2) {

    return this.reduce(fnct, opt_initial_value);

  } else {

    return this.reduce(fnct);

  }

};


/**
Reduces these elements from the right.

@param {function(*=, *=, number=, (Array|rocket.Elements)=) : *} fnct
  The reducer.
@param {*=} opt_initial_value The initial value.
@return {*} The reduced value (the return value of the reducer function).
*/
rocket.Elements.prototype.reduceRight = function(fnct, opt_initial_value) {

  if (Array.prototype.reduceRight) {

    rocket.Elements.prototype.reduceRight = Array.prototype.reduceRight;

  } else {

    rocket.Elements.prototype.reduceRight = function(fnct, opt_initial_value) {

      if (arguments.length === 2) {
        return rocket.reduceRight(this, fnct, opt_initial_value);
      } else {
        return rocket.reduceRight(this, fnct);
      }

    };

  }

  if (arguments.length === 2) {
    return this.reduceRight(fnct, opt_initial_value);
  } else {
    return this.reduceRight(fnct);
  }

};


/**
Returns a rocket.Elements of the removed child nodes.

@param {(Element|Array.<Element>|rocket.Elements)} child_node
  The node(s) to remove.
@return {rocket.Elements} Removed child nodes.
*/
rocket.Elements.prototype.removeChild = function(child_node) {

  var i;
  var len;
  var child_nodes;

  if (this.length) {

    if (child_node.nodeType) {

      child_nodes = [child_node];

    } else {

      child_nodes = /** @type {Array.<Element>} */ (child_node);

    }

    i = 0;
    len = child_nodes.length;

    for (; i < len; ++i) {
      /** @type {Element} */ (this[0]).removeChild(child_nodes[i]);
    }

  } else {

    child_nodes = [];

  }

  return new rocket.Elements(child_nodes);

};


/**
Removes a class or a list of classes from these Elements.

@param {(string|Array.<string>)} class_names The class names to remove.
@return {rocket.Elements} These elements.
*/
rocket.Elements.prototype.removeClass = function(class_names) {

  class_names = rocket.arrayify(class_names);

  var memo = {};

  var i = 0;
  var len = this.length;

  var j;
  var jlen = class_names.length;

  var initial_class_name;
  var final_class_name;
  var index;
  var joined_class_names = class_names.join(' ');

  for (; i < len; ++i) {

    initial_class_name = /** @type {Element} */ (this[i]).className;

    if (initial_class_name in memo) {

      this[i].className = memo[initial_class_name];

    } else {

      if (initial_class_name === '' ||
          initial_class_name === joined_class_names) {

        final_class_name = [];

      } else {

        final_class_name = rocket.arrayify(initial_class_name);

        for (j = 0; j < jlen; ++j) {

          index = rocket.indexOf(final_class_name, class_names[j]);

          if (index !== -1) {
            final_class_name.splice(index, 1);
          }
        }

      }

      this[i].className = memo[initial_class_name] = final_class_name.join(' ');

    }

  }

  return this;

};


/**
removeeventlistener.

@param {(string|Array.<string>)=} opt_types
@param {(EventListener|function(Event))=} opt_fnct
@return {rocket.Elements}
*/
rocket.Elements.prototype.removeEventListener = function(opt_types, opt_fnct) {

  var types;
  var i = 0;
  var len = this.length;

  if (arguments.length === 0) {

    for (; i < len; ++i) {
      rocket.EventTarget.prototype.removeEventListener.call(this[i]);
    }

  } else {

    types =
        rocket.arrayify(
            /** @type {(string|Array.<string>)} */ (opt_types)
        );
    for (; i < len; ++i) {
      for (var j = 0; types[j]; ++j) {
        if (arguments.length === 1) {
          rocket.EventTarget.prototype.removeEventListener.call(
              this[i],
              types[j]
          );
        } else {
          rocket.EventTarget.prototype.removeEventListener.call(
              this[i],
              types[j],
              opt_fnct
          );
        }
      }
    }

  }

  return this;

};


/**
Returns a rocket.Elements of the removed child node.

@param {(Element|Array.<Element>|rocket.Elements)} new_children
  The new node.
@param {(Element|Array.<Element>|rocket.Elements)} old_children
  The node to replace.
@return {rocket.Elements} Removed child node.
*/
rocket.Elements.prototype.replaceChild = function(new_children, old_children) {

  var new_child;
  var old_child;

  if (this.length) {

    if (new_children.nodeType) {
      new_child = new_children;
    } else {
      new_child = /** @type {Element} */ (new_children[0]);
    }

    if (old_children.nodeType) {
      old_child = old_children;
    } else {
      old_child = /** @type {Element} */ (old_children[0]);
    }

    /** @type {Element} */ (this[0]).replaceChild(
        /** @type {Element} */ (new_child),
        /** @type {Element} */ (old_child)
    );

    return new rocket.Elements([old_child]);

  } else {

    return new rocket.Elements([]);

  }

};


/**
Scrolls the first of these Elements into view.

@param {boolean=} opt_align_with_top
  If true, align the Element with the top of;
  else align the Element with the bottom of the page.
  Defaults to true.
@return {rocket.Elements} These elements.
*/
rocket.Elements.prototype.scrollIntoView = function(opt_align_with_top) {

  if (this.length) {

    if (arguments.length === 1) {
      /** @type {Element} */ (this[0]).scrollIntoView(opt_align_with_top);
    } else {
      /** @type {Element} */ (this[0]).scrollIntoView();
    }

  }

  return this;

};


/**
Sets/gets these selected states.

@param {boolean=} opt_selected Selected state.
@return {(rocket.Elements|boolean|undefined)}
  The selected state or these elements.
*/
rocket.Elements.prototype.selected = function(opt_selected) {

  if (arguments.length === 0) {
    return /** @type {boolean|undefined} */ (this.getAttribute('selected'));
  } else {
    return this.setAttribute('selected', opt_selected);
  }

};


/**
Returns the end of the selection for this Elements.

@return {number} The selection end.
*/
rocket.Elements.prototype.selectionEnd = function() {

  var len = this.length;

  if (this.length) {

    if (/** @type {HTMLInputElement} */ (this[0]).selectionEnd !==
            undefined) {

      rocket.Elements.prototype.selectionEnd = function() {
        return this.length ?
            /** @type {HTMLInputElement} */ (this[0]).selectionEnd :
            -1;
      };

    } else {

      rocket.Elements.prototype.selectionEnd = function() {

        if (this.length) {

          var range = document.selection.createRange();
          var value_length =
              /** @type {HTMLInputElement} */ (this[0]).value.length;

          return value_length - range.moveEnd('character', value_length);

        } else {

          return -1;

        }

      };

    }

    return this.selectionEnd();
  }

  return -1;

};


/**
Returns the start of the selection for this Elements.

@return {number} The selection start.
*/
rocket.Elements.prototype.selectionStart = function() {

  var len = this.length;

  if (this.length) {

    if (/** @type {HTMLInputElement} */ (this[0]).selectionStart !==
            undefined) {

      rocket.Elements.prototype.selectionStart = function() {
        return this.length ?
            /** @type {HTMLInputElement} */ (this[0]).selectionStart :
            -1;
      };

    } else {

      rocket.Elements.prototype.selectionStart = function() {

        if (this.length) {

          var range = document.selection.createRange();
          var value_length =
              /** @type {HTMLInputElement} */ (this[0]).value.length;

          return Math.abs(range.moveStart('character', -value_length));

        } else {

          return -1;

        }

      };

    }

    return this.selectionStart();
  }

  return -1;

};


/**
Sets attributes on all of these elements.

Either an object of zero or more key and value pairs
can be used as the attribute; or setting a single key and
value pair can be done using both parameters.

Case sensitive attributes are automatically properly cased.

Reserved word attributes are properly remapped.

For setting the value of an HTMLSelectElement: first all option Elements
are checked for an equivalent value attribute.  If an equivalent value
attribute is found on an HTMLOptionElement, then that HTMLOptionElement
is selected.  If an equivalent value attribute is not found, then all
HTMLOptionElement's innerHTML attributes are checked for an equivalent value,
if found, that HTMLOptionElement is selected.

For setting the value of an HTMLSelectElement with the multiple property
set: any HTMLOptionElement that has an equivalent value or innerHTML attribute
is selected.  If an Array is used as the value, then all values in the Array
will be used.

@param {(string|Object.<string, (string|boolean|number)>)} attribute
  The attributes.
@param {(string|boolean|number)=} opt_value The value.
@return {rocket.Elements} These elements.
@example
$('table').setAttribute('border','0');
$('table').setAttribute({'border':'0'});
$('table').setAttribute({'border':'0','cellpadding':'0'});
$('select').setAttribute({'value': 'foo'});

// only if select multiple="multiple"
$('select').setAttribute({'value': ['foo','bar']});
*/
rocket.Elements.prototype.setAttribute = function(attribute, opt_value) {

  var attributes;

  if (arguments.length === 1) {

    attributes = attribute;

  } else {

    attributes = {};
    attributes[attribute] = opt_value;

  }

  var i = 0;
  var len = this.length;
  var j;
  var jlen;
  var k;
  var klen;
  var options;
  var index;
  var string_value;
  var atts;
  var selected;

  for (; i < len; ++i) {

    for (var key in attributes) {

      if (key === 'value' &&
          /** @type {Element} */ (this[i]).nodeName === 'SELECT') {

        options = /** @type {HTMLSelectElement} */ (this[i]).options;

        j = 0;
        jlen = options.length;

        if (/** @type {HTMLSelectElement} */ (this[i]).multiple) {

          if (rocket.isArray(attributes[key])) {

            atts =
                /** @type {Array.<(string|boolean|number)>} */
                   (attributes[key]);

          } else {

            atts = [attributes[key]];

          }

          klen = atts.length;

          for (; j < jlen; ++j) {

            /** @type {HTMLOptionElement} */
            (options[j]).selected = selected = false;

            for (k = 0; k < klen && selected === false; ++k) {

              string_value = (atts[k] + '');

              if (/** @type {HTMLOptionElement} */
                  (options[j]).value === string_value ||
                  /** @type {HTMLOptionElement} */
                  (options[j]).innerHTML === string_value) {

                options[j].selected = selected = true;

              }

            }

          }

        } else {

          index = -1;

          for (; j < jlen && index === -1; ++j) {
            if (/** @type {HTMLOptionElement} */ (options[j]).value ===
                (/** @type {string} */ (attributes[key]) + '')) {

              index = j;

            }
          }

          if (index === -1) {

            j = 0;

            for (; j < jlen && index === -1; ++j) {
              if (/** @type {HTMLOptionElement} */ (options[j]).innerHTML ===
                  (/** @type {string} */ (attributes[key]) + '')) {

                index = j;

              }
            }

          }

          if (index !== -1) {
            this[i].selectedIndex = index;
          }

        }

      } else {

        /** @type {Element} */ (this[i])[
            rocket.Elements.attribute_map_[key] || key] = attributes[key];

      }

    }

  }

  return this;

};


/**
Sets the selected text in the first of these elements.

@param {number} begin The beginning of the selection.
@param {number} end The ending of the selection.
@return {rocket.Elements} These elements.
*/
rocket.Elements.prototype.setSelectionRange = function(begin, end) {

  if (this.length) {

    if (/** @type {HTMLInputElement} */ (this[0]).setSelectionRange) {

      rocket.Elements.prototype.setSelectionRange = function(begin, end) {

        if (this.length) {

          /** @type {HTMLInputElement} */ (this[0]).setSelectionRange(
              begin,
              end
          );

          /** @type {Element} */ (this[0]).focus();

        }

        return this;

      };

    } else {

      rocket.Elements.prototype.setSelectionRange = function(begin, end) {

        var range;

        if (this.length) {

          range = /** @type {HTMLInputElement} */ (this[0]).createTextRange();

          range.moveStart('character', begin);
          range.moveEnd(
              'character',
              end - /** @type {HTMLInputElement} */ (this[0]).value.length
          );

          range.select();

        }

        return this;

      };

    }

    return this.setSelectionRange(begin, end);

  }

  return this;

};


/**
Shifts an Element from the beginning of this Elements.

@return {rocket.Elements} The shift'd Element.
*/
rocket.Elements.prototype.shift = function() {

  if (this.length) {

    var element = /** @type {Element} */ (this[0]);
    var i = 1;
    var len = this.length;

    for (; i < len; ++i) {
      this[i - 1] = this[i];
    }

    delete this[--this.length];

    return new rocket.Elements([element]);

  } else {

    return new rocket.Elements([]);

  }

};


/**
Shows these elements.

Resets the display style of these Elements an empty string value.

If the opt_visibility parameter is true, then visibility,
instead of display is used; visibility to an empty string.

@param {boolean=} opt_visibility Use visibility.
@return {rocket.Elements} These elements.
*/
rocket.Elements.prototype.show = function(opt_visibility) {

  return /** @type {rocket.Elements} */ (this.style(
      opt_visibility ?
          {'visibility': ''} :
          {'display': ''}
      ));

};


/**
Selects part of this Elements and returns a new Elements.

@param {number} start Where to star the slice.
@param {number=} opt_end Where to stop the slice.
@return {rocket.Elements} The sliced part of this Elements.
*/
rocket.Elements.prototype.slice = function(start, opt_end) {
  return new rocket.Elements(
      Array.prototype.slice.apply(this, arguments)
  );
};


/**
Elements some.

@param {function(this:Object, Object, number, Object)} fnct The fnct.
@param {Object=} opt_self The value to use as this when executing fnct.
@return {boolean} True if any; else false.
*/
rocket.Elements.prototype.some = function(fnct, opt_self) {

  if (Array.prototype.some) {

    rocket.Elements.prototype.some = Array.prototype.some;

  } else {

    rocket.Elements.prototype.some = function(fnct, opt_self) {
      return rocket.some(this, fnct, opt_self);
    };

  }

  return this.some(fnct, opt_self);

};


/**
Mutates this Elements and returns a new Elements of the removed elements.

@param {number} index The index to start changing this Rocket.
@param {number=} opt_how_many How many elements to remove.
@param {...Element} var_args The elements to add.
@return {rocket.Elements} A Elements of the removed elements.
*/
rocket.Elements.prototype.splice = function(index, opt_how_many, var_args) {
  return new rocket.Elements(
      Array.prototype.splice.apply(this, arguments)
  );
};


/**
Converts a hyphenated property to a camelCase'd property.

@private
@param {string} property The property possibly hyphenated.
@return {string} The property camelCase'd.
*/
rocket.Elements.prototype.style_camel_case_ = function(property) {

  var split;
  var len;
  var i;

  if (property.indexOf('-') === -1) {

    return property;

  } else {

    split = property.split('-');
    len = split.length;
    i = 1;

    for (; i < len; ++i) {
      split[i] = split[i].charAt(0).toUpperCase() + split[i].substr(1);
    }

    return split.join('');

  }

};


/**
Set/get styles.

@param {(string|Object.<string, (string|number)>)} styles Styles.
@param {(string|number)=} opt_value The value to set.
@return {(string|number|undefined|rocket.Elements)} This Elements.
*/
rocket.Elements.prototype.style = function(styles, opt_value) {

  var map;

  if (arguments.length === 1) {

    if (typeof styles === 'string') {
      return this.style_get_(styles);
    } else {
      map = styles;
    }

  } else {

    map = {};
    map[styles] = opt_value;

  }

  this.style_set_(map);

  return this;

};


/**
Get a style attribute.

@private
@param {string} style The style.
@return {(string|number|undefined)} The vaule.
*/
rocket.Elements.prototype.style_get_ = function(style) {

  var camel_cased_style = this.style_camel_case_(style);
  var transformer;

  if (this.length) {

    if (transformer = rocket.Elements.style_transformers_[camel_cased_style]) {

      return transformer.get(this[0]);

    } else {

      /** @type {string} */
      var ret = /** @type {Element} */ (this[0]).style[camel_cased_style];

      if (ret.match(/^\d+(\.\d+)?px$/)) {
        return parseFloat(ret) || 0;
      } else {
        return ret;
      }

    }

  } else {

    return undefined;

  }

};


/**
Set a style attribute.

@private
@param {Object.<string, (string|number)>} styles The styles map.
*/
rocket.Elements.prototype.style_set_ = function(styles) {

  var i = 0;
  var len = this.length;
  var style;
  var camel_cased_style;
  var transformer;

  /** @type {string} */
  var key;

  for (; i < len; ++i) {

    style = /** @type {Element} */ (this[i]).style;

    for (key in styles) {

      camel_cased_style = this.style_camel_case_(key);

      if (transformer =
              rocket.Elements.style_transformers_[camel_cased_style]) {

        transformer.set(this[i], styles[key]);

      } else {

        if (typeof styles[key] === 'number') {
          style[camel_cased_style] = styles[key] + 'px';
        } else {
          style[camel_cased_style] = styles[key];
        }

      }

    }

  }

};


/**
Gets the float from an element.

@private
@param {Element} element The element.
@return {string} The float.
*/
rocket.Elements.style_transformer_float_get_ = function(element) {

  var style = element.style;

  return style.cssFloat || style.styleFloat || '';

};


/**
Set a float on an element.

@private
@param {Element} element The element.
@param {string} value The float.
*/
rocket.Elements.style_transformer_float_set_ =
    function(element, value) {

  var style = element.style;

  style.cssFloat = value;
  style.styleFloat = value;

};


/**
Gets an opacity from an element.

@private
@param {Element} element The element.
@return {number} The opacity between zero and one.
*/
rocket.Elements.style_transformer_opacity_get_ = function(element) {

  if (element.style.opacity === undefined) {

    rocket.Elements.style_transformer_opacity_get_ = function(element) {

      var filter = element.style.filter;
      var result;

      if (filter) {

        result = /opacity=(\d+)/.exec(filter);

        if (result) {
          return result[1] / 100;
        } else {
          return 1;
        }

      } else {

        return 1;

      }

    };

  } else {

    rocket.Elements.style_transformer_opacity_get_ = function(element) {

      return parseFloat(element.style.opacity) ||
          element.style.opacity === '' && 1 ||
          0;

    };

  }

  return rocket.Elements.style_transformer_opacity_get_(element);

};


/**
Set an opacity on an element.

@private
@param {Element} element The element.
@param {number} value The opacity between zero and one.
*/
rocket.Elements.style_transformer_opacity_set_ =
    function(element, value) {

  if (element.style.opacity === undefined) {

    rocket.Elements.style_transformer_opacity_set_ =
        function(element, value) {

      var style = element.style;
      var style_filter = style.filter;
      var filter_regexp = /alpha\(opacity=\d+(\.\d+)?\)/;
      var filter_string;
      var other_filter;

      if (!style.zoom) {

        style.zoom = 1;

      }

      if (value === 1) {

        if (style_filter) {

          if (filter_regexp.test(style_filter)) {

            if (other_filter = style_filter.replace(filter_regexp, '')) {
              style.filter = other_filter.replace(/^,|,$|,,/, '');
            } else {
              style.removeAttribute('filter');
            }

          }

        }

      } else {

        filter_string = 'alpha(opacity=' + (value * 100) + ')';

        if (style_filter) {

          if (filter_regexp.test(style_filter)) {
            style.filter = style_filter.replace(filter_regexp, filter_string);
          } else {
            style.filter += ',' + filter_string;
          }


        } else {

          style.filter = filter_string;

        }

      }

    };

  } else {

    rocket.Elements.style_transformer_opacity_set_ =
        function(element, value) {

      element.style.opacity = value;

    };

  }

  rocket.Elements.style_transformer_opacity_set_(element, value);

};


/**
Transformers for setting/getting CSS Styles.

@private
@const
@ignore
@type {Object.<string, {get:function(Element): (string|number), set: function(Element, (string|number))}>}
*/
rocket.Elements.style_transformers_ = {
  'float': {
    'get': rocket.Elements.style_transformer_float_get_,
    'set': rocket.Elements.style_transformer_float_set_
  },
  'opacity': {
    'get': rocket.Elements.style_transformer_opacity_get_,
    'set': rocket.Elements.style_transformer_opacity_set_
  }
};


/**
Submit this form.

@return {rocket.Elements} These elements.
*/
rocket.Elements.prototype.submit = function() {

  if (this.length) {
    /** @type {HTMLFormElement} */ (this[0]).submit();
  }

  return this;

};


/**
Toggles a class or a list of classes on these Elements.

@param {(string|Array.<string>)} class_names The class names to toggle.
@return {rocket.Elements} These elements.
*/
rocket.Elements.prototype.toggleClass = function(class_names) {

  class_names = rocket.arrayify(class_names);

  var memo = {};

  var i = 0;
  var len = this.length;

  var j;
  var jlen = class_names.length;

  var initial_class_name;
  var final_class_name;
  var index;
  var joined_class_names = class_names.join(' ');

  for (; i < len; ++i) {

    initial_class_name = /** @type {Element} */ (this[i]).className;

    if (initial_class_name in memo) {

      this[i].className = memo[initial_class_name];

    } else {

      if (initial_class_name === '') {

        final_class_name = class_names;

      } else if (initial_class_name === joined_class_names) {

        final_class_name = [];

      } else {

        final_class_name = rocket.arrayify(initial_class_name);

        for (j = 0; j < jlen; ++j) {

          index = rocket.indexOf(final_class_name, class_names[j]);

          if (index === -1) {
            final_class_name.push(class_names[j]);
          } else {
            final_class_name.splice(index, 1);
          }
        }

      }

      this[i].className = memo[initial_class_name] = final_class_name.join(' ');

    }

  }

  return this;

};


/**
Unshifts an Element(s) onto the beginning of this Elements.

@param {...Element} var_args The Element(s).
@return {number} The new number of Elements in this.
*/
rocket.Elements.prototype.unshift = function(var_args) {

  return Array.prototype.unshift.apply(this, arguments) || this.length;

};


/**
Sets/gets this value text.

Can be used to set selected value(s) on both single and multiple
select elements as well.

Returns an array of selected values for a multiple select.

Paramter of an array of values to set a multiple select.

@param {string=} opt_value The value.
@return {(rocket.Elements|string|Array.<string>|undefined)}
  The value or these elements.
*/
rocket.Elements.prototype.value = function(opt_value) {

  if (arguments.length === 0) {
    return /** @type {string|undefined} */ (this.getAttribute('value'));
  } else {
    return this.setAttribute('value', opt_value);
  }

};




/**
Any class that encapsulate DOM Elements should implement this class.

@interface
*/
rocket.Disposable = function() {};


/**
Remove any and all EventListeners and Elements created and attached to the DOM.
*/
rocket.Disposable.prototype.dispose = function() {};


/**
Returns a function that limits or debounces a function's executions
regardless of how many times it's called.

Returns a function that will not execute the given handler function until the
returned function has been called once but has not been called again for at the
the very least the given period of milliseconds.

Preserves both arguments and the value of this in the given function.

@param {number} period The period in milliseconds during which to ignore
repeated attempts to execute the given function.
@param {function(...):(Object|undefined)} handler
  The bouncing handler function.
@return {function(this:Object, ...)} The debounced function.
@example
// calls resize_something after it's been called once but
// not called again for another 1000 milliseconds
rocket.$(window).addEventListener(
    'resize',
    rocket.debounce(1000, resize_something)
);
*/
rocket.debounce = function(period, handler) {

  var time_out;

  return /** @this {*} */ (function() {

    clearTimeout(time_out);

    var self = this;
    var args = arguments;

    time_out =
        setTimeout(
            function() {
              handler.apply(self, args);
            },
            period
        );

  });
};


/**
Returns the ISO-8601 string date format of either the optionally given Date or
of the current Date if one is not given.

@param {Date=} opt_date The date.
@return {string} The ISO-8601 string date format.

@example
rocket.dateISOString();

// could return

"2014-03-18T01:15:22.030Z"

@test {1} Use a RegExp to match the dateISOString.
var regexp = /^\d{4}\-\d\d\-\d\dT\d\d\:\d\d\:\d\d\.\d{3}Z$/;
rocket.dateISOString().match(regexp).length;

*/
rocket.dateISOString = function(opt_date) {

  var date = opt_date || new Date();

  if (date.toISOString) {

    rocket.dateISOString = function(opt_date) {
      return (opt_date || new Date()).toISOString();
    };

  } else {

    rocket.dateISOString = function(opt_date) {

      var date = opt_date || new Date();

      return date.getUTCFullYear() + '-' +
          rocket.padLeft((date.getUTCMonth() + 1) + '', 2, '0') + '-' +
          rocket.padLeft(date.getUTCDate() + '', 2, '0') + 'T' +
          rocket.padLeft(date.getUTCHours() + '', 2, '0') + ':' +
          rocket.padLeft(date.getUTCMinutes() + '', 2, '0') + ':' +
          rocket.padLeft(date.getUTCSeconds() + '', 2, '0') + '.' +
          rocket.padLeft(date.getUTCMilliseconds() + '', 3, '0') + 'Z';

    };

  }

  return rocket.dateISOString(date);

};


/**
Shorcut method for creating a rocket.Elements object that contains only a newly
created Element.

@param {string} tag_name
  The tagName of the DOM element to create.
@return {rocket.Elements} The new rocket.Elements containing the newly created
Element.
@example
rocket.createElement('div');
*/
rocket.createElement = function(tag_name) {
  return new rocket.Elements([document.createElement(tag_name)]);
};


/**
Sets/gets cookie values.

@param {(string|Object.<string, string>)=} opt_values
  Value to get or key/values to set.
@param {string=} opt_value Value to set.
@return {(Object.<string, string>|string)} The cookie.

@test {'bar'} Set and get the value of foo.
rocket.cookie('foo', 'bar');
rocket.cookie('foo');

@test {'foo'} Set and get the value of bar.
rocket.cookie({'bar': 'foo'});
rocket.cookie('bar');

@test {'bar=foo'} Set and get the value of "foo=bar".
rocket.cookie({'foo=bar': 'bar=foo'});
rocket.cookie('foo=bar');

*/
rocket.cookie = function(opt_values, opt_value) {

  var key_value_obj;

  if (arguments.length === 2) {

    key_value_obj = {};
    key_value_obj[opt_values] = opt_value;

  } else if (arguments.length === 1) {

    if (typeof opt_values === 'string') {

      return rocket.cookie.parse_cookie_()[opt_values] || '';

    } else {

      key_value_obj = opt_values;

    }

  }

  if (key_value_obj) {

    for (var key in key_value_obj) {
      document.cookie =
          encodeURIComponent(key) + '=' +
              encodeURIComponent(key_value_obj[key]);
    }

  }

  return rocket.cookie.parse_cookie_();

};


/**
@private
@return {Object.<string, string>}
*/
rocket.cookie.parse_cookie_ = function() {

  var cookie = document.cookie;
  var ret = {};

  if (cookie) {

    cookie = cookie.split('; ');

    for (var i = 0, len = cookie.length; i < len; ++i) {

      var pos = cookie[i].indexOf('=');
      ret[decodeURIComponent(cookie[i].substr(0, pos))] =
          decodeURIComponent(cookie[i].substr(pos + 1));

    }

  }

  return ret;

};


/**
Allows passing an array of parameters to a constructor.

Used for allowing a variable number of arguments to be passed to a constructor.

@param {Function} constructor The class constructor.
@param {Array} args An Array of arguments.
@return {Object} The instantiated object.

@example
// given
var Baz = function(a,b,c,var_args){};

// the following two statements produce equivalent results
var bar = new Baz(a, b, c, d, e);

var foo = [a, b, c, d, e];
var bar = rocket.construct(Baz, foo);
*/
rocket.construct = function(constructor, args) {

  /**
  @ignore
  @constructor
  */
  function Temporary_Class() {

    constructor.apply(this, args);

  };

  Temporary_Class.prototype = constructor.prototype;

  return new Temporary_Class();

};



/**
A helper class for creating classes that interact with the DOM.

The intention is that children classes will inherit this class and override
the decorate/create prototype methods.

If necessary, a child class can override this prototype dispose method.

@constructor
@implements {rocket.Disposable}
@extends {rocket.EventTarget}
*/
rocket.Component = function() {};
rocket.inherits(rocket.Component, rocket.EventTarget);


/**
@private
@type {boolean}
*/
rocket.Component.prototype.component_rendered_ = false;


/**
@return {boolean}
*/
rocket.Component.prototype.rendered = function() {
  return this.component_rendered_;
};


/**
@private
@type {boolean}
*/
rocket.Component.prototype.component_disposed_ = false;


/**
@return {boolean}
*/
rocket.Component.prototype.disposed = function() {
  return this.component_disposed_;
};


/**
@private
@type {rocket.Elements}
*/
rocket.Component.prototype.component_element_;


/**
@return {rocket.Elements}
*/
rocket.Component.prototype.create = function() {
  return rocket.createElement('div');
};


/**
@param {rocket.Elements} element
*/
rocket.Component.prototype.decorate = function(element) {};


/**
@param {rocket.Elements=} opt_parent
*/
rocket.Component.prototype.render = function(opt_parent) {

  this.component_rendered_ = true;

  this.component_element_ = this.create();

  this.decorate(this.component_element_);

  if (arguments.length) {

    opt_parent.appendChild(this.component_element_);

  } else {

    new rocket.Elements([document.body]).appendChild(this.component_element_);

  }

};


/**
@param {rocket.Elements} element
*/
rocket.Component.prototype.setComponentElement = function(element) {
  this.component_element_ = element;
};


/**
dispose
*/
rocket.Component.prototype.dispose = function() {

  this.disposeInternal();

};


/**
disposeInternal
*/
rocket.Component.prototype.disposeInternal = function() {

  if (!this.component_disposed_) {

    this.component_disposed_ = true;

    if (this.component_rendered_) {
      this.component_element_.parentNode().removeChild(this.component_element_);
    }

    delete this.component_element_;

    this.removeEventListener();

  }

};



/**
Allows an Element to be moved by clicking and dragging the mouse.

An empty filler HTMLDivElement is created with the moving Element's width and
height and placed in the moving Element's original position.

An HTMLDivElement container is created with its position set to absolute and
with the moving Element's width and height.  This container is placed on top of
the empty filler HTMLDivElement.  The moving Element is appended to this
container.  This container is then moved via setting the left and right style
attributes.

The moving Element's style attributes are not touched.

When disposed, if decorated, the moving Element will be returned to its original
position.

@constructor
@extends {rocket.Component}
*/
rocket.Draggable = function() {};
rocket.inherits(rocket.Draggable, rocket.Component);


/**
@private
@type {rocket.Elements}
*/
rocket.Draggable.prototype.container_;


/**
@private
@type {number}
*/
rocket.Draggable.prototype.current_left_;


/**
@private
@type {number}
*/
rocket.Draggable.prototype.current_top_;


/**
@private
@type {boolean}
*/
rocket.Draggable.prototype.fixX_ = false;


/**
@private
@type {boolean}
*/
rocket.Draggable.prototype.fixY_ = false;


/**
Prevent the Element from being moved on the horizontal x axis.

@param {boolean=} opt_fix
@return {boolean} Whether the horizontal x axis is currently fixed.
*/
rocket.Draggable.prototype.fixX = function(opt_fix) {

  if (arguments.length) {
    this.fixX_ = /** @type {boolean} */ (opt_fix);
  }

  return this.fixX_;

};


/**
Prevent the Element from being moved on the vertical y axis.

@param {boolean=} opt_fix
@return {boolean} Whether the vertical y axis is currently fixed.
*/
rocket.Draggable.prototype.fixY = function(opt_fix) {

  if (arguments.length) {
    this.fixY_ = /** @type {boolean} */ (opt_fix);
  }

  return this.fixY_;

};


/**
@private
@type {ClientRect}
*/
rocket.Draggable.prototype.bounds_;


/**
Define a bounding rectangle to restrict the movement of the Element.

@param {ClientRect} rect
  An Object with: left, top, right, bottom number properties.
@return {ClientRect}
  The current bounding ClientRect.
*/
rocket.Draggable.prototype.bound = function(rect) {

  if (arguments.length) {
    this.bounds_ = rect;
  }

  return this.bounds_;

};


/**
@private
@type {ClientRect}
*/
rocket.Draggable.prototype.rect_;


/**
@private
@type {rocket.Elements}
*/
rocket.Draggable.prototype.filler_;


/**
@private
@type {rocket.Elements}
*/
rocket.Draggable.prototype.element_;


/**
@private
@type {function()}
*/
rocket.Draggable.prototype.mouse_up_leave_handler_;


/**
Decorate.

@param {rocket.Elements} element
*/
rocket.Draggable.prototype.decorate = function(element) {

  this.element_ = element;

  var doc = new rocket.Elements([document]);

  var mouse_x;
  var mouse_y;

  var self = this;

  var mouse_down_handler = /** @param {Event} e */ (function(e) {

    mouse_x = e.pageX;
    mouse_y = e.pageY;

    doc
      .addEventListener('mousemove', mouse_move_handler)
      .addEventListener(
            ['mouseup', 'mouseleave'],
            self.mouse_up_leave_handler_
        );

  });

  var mouse_move_handler = /** @param {Event} e */ (function(e) {

    if (!self.fixX_) {

      var left = self.current_left_ + e.pageX - mouse_x;

      if (
          self.bounds_ &&
              (
              (left < self.bounds_.left) ||
              ((left + self.rect_.width) > self.bounds_.right)
              )
      ) {

        left = self.current_left_;

      } else {

        self.current_left_ = left;

      }

      self.container_.style({
        'left': left
      });

      mouse_x = e.pageX;

    }

    if (!self.fixY_) {

      var top = self.current_top_ + e.pageY - mouse_y;

      if (
          self.bounds_ &&
              (
              (top < self.bounds_.top) ||
              ((top + self.rect_.height) > self.bounds_.bottom)
              )
      ) {

        top = self.current_top_;

      } else {

        self.current_top_ = top;

      }

      self.container_.style({
        'top': top
      });

      mouse_y = e.pageY;

    }

  });

  this.mouse_up_leave_handler_ = function() {
    doc
      .removeEventListener('mousemove', mouse_move_handler)
      .removeEventListener(
            ['mouseup', 'mouseleave'],
            self.mouse_up_leave_handler_
        );
  };

  this.rect_ = element.getBoundingClientRect();

  this.current_left_ = this.rect_.left;
  this.current_top_ = this.rect_.top;

  this.container_ =
      rocket.createElement('div')
      .preventSelect()
      .style({
        'position': 'absolute',
        'left': this.rect_.left,
        'top': this.rect_.top,
        'width': this.rect_.width,
        'height': this.rect_.height
      })
      .addEventListener('mousedown', mouse_down_handler);

  this.setComponentElement(this.container_);

  var parent = element.parentNode();

  if (parent.length) {

    parent.insertBefore(this.container_, element);

    this.filler_ =
        /** @type {rocket.Elements} */ (
        rocket.createElement('div').style({
          'width': this.rect_.width,
          'height': this.rect_.height
        }));

    parent.insertBefore(this.filler_, element);

  }

  this.container_.appendChild(element);

};


/**
Disposes this Component.

if decorated, the moving Element will be returned to its original position.
*/
rocket.Draggable.prototype.dispose = function() {

  if (this.container_) {

    if (!this.rendered()) {
      this.container_.parentNode().insertBefore(this.element_, this.container_);
    }

    this.container_.removeEventListener();

    this.mouse_up_leave_handler_();

    this.container_.parentNode().removeChild(this.container_);
    this.filler_.parentNode().removeChild(this.filler_);

    this.removeEventListener();

  }

};



/**
A helper class for creating components that improve an HTMLInputElement.

This class handles showing/hiding when appropriate.

The intention is that children components will inherit this class and override
the show/hide prototype methods.

@constructor
@extends {rocket.Component}
*/
rocket.Input = function() {};
rocket.inherits(rocket.Input, rocket.Component);


/**
@return {rocket.Elements}
*/
rocket.Input.prototype.create = function() {
  return rocket.createElement('input');
};


/**
@type {rocket.Elements}
@private
*/
rocket.Input.prototype.input_element_;


/**
@type {boolean}
@private
*/
rocket.Input.prototype.input_shown_ = false;


/**
@param {boolean=} opt_hidden
@return {boolean}
*/
rocket.Input.prototype.hidden = function(opt_hidden) {

  if (arguments.length) {

    if (opt_hidden) {
      this.input_shown_ = false;
    } else {
      this.input_shown_ = true;
    }

  }

  return !this.input_shown_;

};


/**
@return {rocket.Elements}
*/
rocket.Input.prototype.getInput = function() {
  return this.input_element_;
};


/**
@private
@type {function(Event)}
*/
rocket.Input.prototype.input_document_listener_;


/**
@param {rocket.Elements} input
*/
rocket.Input.prototype.decorate = function(input) {

  this.input_element_ = input;

  var self = this;

  this.input_document_listener_ = /** @param {Event} e */ (function(e) {
    if (self.input_shown_) {
      self.input_shown_ = false;
      self.cancel();
      self.hide();
    }
  });

  new rocket.Elements([document]).addEventListener(
      'mousedown.Input',
      this.input_document_listener_
  );

  input
      .addEventListener(
          'keyup.Input',
          /** @param {Event} e */
          function(e) {

            if (e.which === rocket.KEY.tab) {
              if (!self.input_shown_) {
                self.input_shown_ = true;
                self.show();
                self.change();
              }
            }

          }
      )
      .addEventListener(
          'mousedown.Input',
          /** @param {Event} e */
          function(e) {

            e.stopPropagation();
            if (!self.input_shown_) {
              new rocket.Elements([document]).dispatchEvent('mousedown');
              self.input_shown_ = true;
              self.show();
              self.change();
            }

          }
      )
      .addEventListener(
          ['afterkeydown.Input', 'cut.Input', 'paste.Input'],
          /** @param {Event} e */
          function(e) {

            if (
                (e.type !== 'keyup') ||
                (e.which !== rocket.KEY.enter)
            ) {

              if (!self.input_shown_) {
                self.input_shown_ = true;
                self.show();
              }

              if (e.type === 'keydown') {

                if (e.which === rocket.KEY.down) {
                  self.down();
                } else if (e.which === rocket.KEY.up) {
                  self.up();
                } else if (e.which === rocket.KEY.pageDown) {
                  for (var i = 0; i < 5; ++i) {
                    self.down();
                  }
                } else if (e.which === rocket.KEY.pageUp) {
                  for (var i = 0; i < 5; ++i) {
                    self.up();
                  }
                } else if (e.which === rocket.KEY.escape) {
                  self.cancel();
                  self.hide();
                } else if (
                    (e.which === rocket.KEY.enter) ||
                    (e.which === rocket.KEY.tab)
                ) {
                  self.enter();
                  self.input_shown_ = false;
                  self.hide();
                } else {

                  self.change();

                }

              }

            }

          }
      );

};


/**
Override this.
*/
rocket.Input.prototype.show = function() {};


/**
Override this.
*/
rocket.Input.prototype.hide = function() {};


/**
Override this.
*/
rocket.Input.prototype.cancel = function() {};


/**
Override this.
*/
rocket.Input.prototype.enter = function() {};


/**
Override this.
*/
rocket.Input.prototype.up = function() {};


/**
Override this.
*/
rocket.Input.prototype.down = function() {};


/**
Override this.
*/
rocket.Input.prototype.change = function() {};


/**
*/
rocket.Input.prototype.dispose = function() {

  if (this.input_element_) {

    if (this.input_shown_) {
      this.hide();
    }

    this.input_element_.removeEventListener('.Input');
    new rocket.Elements([document]).removeEventListener(
        'mousedown.Input',
        this.input_document_listener_
    );

    delete this.input_element_;

    this.disposeInternal();

  }

};



/**
Helper class for getting a user entered date.

@constructor
@extends {rocket.Input}
*/
rocket.DateInput = function() {};
rocket.inherits(rocket.DateInput, rocket.Input);


/**
@private
@type {rocket.Elements}
*/
rocket.DateInput.prototype.container_;


/**
@private
@type {number}
*/
rocket.DateInput.prototype.calendar_year_;


/**
@private
@type {number}
*/
rocket.DateInput.prototype.calendar_month_;


/**
@private
@type {number}
*/
rocket.DateInput.prototype.selected_year_;


/**
@private
@type {number}
*/
rocket.DateInput.prototype.selected_month_;


/**
@private
@type {number}
*/
rocket.DateInput.prototype.selected_date_;


/**
Override.
*/
rocket.DateInput.prototype.show = function() {

  var rect = this.getInput().getBoundingClientRect();

  /** @type {HTMLTableCellElement} */
  var highlighted;

  var previous_background_color;
  var previous_color;

  var self = this;

  this.container_ = rocket.createElement('div')
    .style({
        'border-radius': 3,
        'position': 'absolute',
        'border': '1px solid #888888',
        'cursor': 'pointer',
        'width': 300,
        'left': rect.left,
        'top': rect.bottom - 1
      })
    .preventSelect()
    .addEventListener('mousedown', function(e) {
        e.stopPropagation();
      })
    .live('td', 'mouseover',
      /** @this {HTMLTableCellElement} */
      (function() {

        if (highlighted) {
          highlighted.style.backgroundColor = previous_background_color;
          highlighted.style.color = previous_color;
        }

        previous_background_color = this.style.backgroundColor;
        previous_color = this.style.color;

        this.style.backgroundColor = '#D5E2FF';
        this.style.color = '';

        highlighted = this;

      }))
    .live('td', 'click',
      /** @this {HTMLTableCellElement} */
      (function() {

        if (this.innerHTML === '&lt;&lt;') {
          --self.calendar_year_;
          self.change(true);
        } else if (this.innerHTML === '&lt;') {
          --self.calendar_month_;
          self.change(true);
        } else if (this.innerHTML === '&gt;&gt;') {
          ++self.calendar_year_;
          self.change(true);
        } else if (this.innerHTML === '&gt;') {
          ++self.calendar_month_;
          self.change(true);
        } else {

          var date = +this.innerHTML;

          if (date) {

            var year = self.calendar_year_;
            var month = self.calendar_month_;

            if (
                (/** @type {HTMLTableRowElement} */
                (this.parentNode).rowIndex === 1) &&
                (date > 6)
            ) {

              if (month === 0) {
                --year;
                month = 12;
              }

            } else if (
                (/** @type {HTMLTableRowElement} */
                (this.parentNode).rowIndex > 4) &&
                (date < 22)
            ) {

              if (month === 11) {
                ++year;
              }
              month = (month + 2) % 12;

            } else {

              ++month;

            }

            self.getInput()
                .value(
                    rocket.padLeft(month, 2, '0') + '/' +
                    rocket.padLeft(this.innerHTML, 2, '0') + '/' +
                    year
                    )
                .setSelectionRange(0, 10)
                .focus();

            self.hide();
            self.hidden(true);

          }

        }

      }));

  new rocket.Elements([document.body]).appendChild(this.container_);

  this.container_.fit();
};


/**
Override.
*/
rocket.DateInput.prototype.enter = function() {
  if (this.selected_date_) {
    this.getInput()
      .value(
        rocket.padLeft(this.selected_month_ + 1, 2, '0') + '/' +
        rocket.padLeft(this.selected_date_, 2, '0') + '/' +
        this.selected_year_
        )
      .setSelectionRange(0, 10);
  }
};


/**
Override.
*/
rocket.DateInput.prototype.hide = function() {

  this.container_.removeEventListener();

  new rocket.Elements([document.body]).removeChild(this.container_);

  delete this.container_;

};


/**
Override.

@param {boolean=} opt_ignore_selected
*/
rocket.DateInput.prototype.change = function(opt_ignore_selected) {

  var date = rocket.strToDate(/** @type {string} */ (this.getInput().value()));

  if (date) {

    this.selected_year_ = date.getFullYear();
    this.selected_month_ = date.getMonth();
    this.selected_date_ = date.getDate();

  } else {

    delete this.selected_year_;
    delete this.selected_month_;
    delete this.selected_date_;
    date = new Date();

  }

  if (opt_ignore_selected) {

    if (this.calendar_month_ < 0) {
      --this.calendar_year_;
    } else if (this.calendar_month_ > 11) {
      ++this.calendar_year_;
    }

    this.calendar_month_ = (this.calendar_month_ + 12) % 12;

  } else {

    this.calendar_year_ = date.getFullYear();
    this.calendar_month_ = date.getMonth();

  }

  var table = rocket.createElement('table');
  var tbody = rocket.createElement('tbody');

  table
    .setAttribute({
        'width': '100%',
        'cellpadding': '5',
        'cellspacing': '1',
        'border': '0'
      })
    .style({
        'table-layout': 'fixed',
        'background-color': '#CCCCCC'
      });

  tbody.style({
    'background-color': '#FFFFFF'
  });

  var tr = rocket.createElement('tr');

  this.render_header_(tr);

  tbody.appendChild(tr);

  this.render_calendar_(tbody);

  table.appendChild(tbody);

  this.container_.innerHTML('').appendChild(table);

};


/**
@private
@param {rocket.Elements} tr
*/
rocket.DateInput.prototype.render_header_ = function(tr) {

  var td;

  td = rocket.createElement('td');

  td
    .innerHTML('&lt;&lt;')
    .setAttribute({
        'align': 'center'
      });
  tr.appendChild(td);

  td = rocket.createElement('td');

  td
    .innerHTML('&lt;')
    .setAttribute({
        'align': 'center'
      });
  tr.appendChild(td);

  var months = /** @type {Object.<number, string>} */ ([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]);

  td = rocket.createElement('td');

  td
      .innerHTML(
          months[this.calendar_month_] + ' ' +
          this.calendar_year_
      )
      .setAttribute({
            'colspan': 3,
            'align': 'center'
      });

  tr.appendChild(td);

  td = rocket.createElement('td');

  td
    .innerHTML('&gt;')
    .setAttribute({
        'align': 'center'
      });
  tr.appendChild(td);

  td = rocket.createElement('td');

  td
    .innerHTML('&gt;&gt;')
    .setAttribute({
        'align': 'center'
      });
  tr.appendChild(td);

};


/**
@private
@param {rocket.Elements} tbody
*/
rocket.DateInput.prototype.render_calendar_ = function(tbody) {

  var days_in_month =
      32 -
      new Date(
          this.calendar_year_,
          this.calendar_month_,
          32
      ).getDate();

  var days_in_prev_month =
      32 -
      new Date(
          this.calendar_year_,
          this.calendar_month_ - 1,
          32
      ).getDate();

  var start_day_of_month =
      new Date(
          this.calendar_year_,
          this.calendar_month_
      ).getDay();

  var today = new Date();
  var today_year = today.getFullYear();
  var today_month = today.getMonth();
  var today_date = today.getDate();

  var prev_month_date = days_in_prev_month - (start_day_of_month || 7);

  var month_date = 0;

  var next_month_date = 0;

  for (var row = 0; row < 6; ++row) {

    var tr = rocket.createElement('tr');

    for (var col = 0; col < 7; ++col) {

      var td = rocket.createElement('td');

      td.setAttribute({
        'align': 'center'
      });

      if (prev_month_date < days_in_prev_month) {

        ++prev_month_date;

        td.style({
          'color': '#888888'
        });

        td.innerHTML('' + prev_month_date);

      } else if (month_date < days_in_month) {

        ++month_date;

        if (
            (today_year === this.calendar_year_) &&
            (today_month === this.calendar_month_) &&
            (today_date === month_date)
        ) {
          tr.style({
            'background-color': '#EEEEEE'
          });
          td.style({
            'background-color': '#DDDDDD'
          });
        }

        if (
            (this.selected_year_ === this.calendar_year_) &&
            (this.selected_month_ === this.calendar_month_) &&
            (this.selected_date_ === month_date)
        ) {
          td.style({
            'background-color': '#10246A',
            'color': '#FFFFFF'
          });
        }

        td.innerHTML('' + month_date);

      } else {

        ++next_month_date;

        td.style({'color': '#888888'});

        td.innerHTML('' + next_month_date);

      }

      tr.appendChild(td);
    }

    tbody.appendChild(tr);

  }


};


/**
Clones or deep copies an Object.

Returns the clone or deep copy of the Object.

@param {Object} obj The Object to clone or deep copy.
@return {Object} The clone or deep copy of the Object.
@see {rocket.equal}

@test {{'a': 'b', 'c': [0, 1]}} Clone an Object.
rocket.clone({'a': 'b', 'c': [0, 1]});

@test {false} Cloned objects containing the same properties are not equal.
var foo = {'a': 'b', 'c': [0, 1]};
(foo === rocket.clone(foo));

@test {false} Object properties on cloned objects are not equal.
var foo = {'a': 'b', 'c': [0, 1]};
(foo.c === rocket.clone(foo).c);

@test {true} rocket.equal could be used to compare cloned objects.
var foo = {'a': 'b', 'c': [0, 1]};
rocket.equal(foo, rocket.clone(foo));

@test {true} Clone an Object with circular references.
var foo = {};
var bar = {};

foo.foo = bar;
bar.bar = foo;

rocket.equal(foo, rocket.clone(foo));

*/
rocket.clone = function(obj) {

  return rocket.clone.clone_(obj, [], []);

};


/**
Clone heler.

@private
@param {Object} obj
@param {Array.<Object>} references
@param {Array.<Object>} copies
@return {Object}
*/
rocket.clone.clone_ = function(obj, references, copies) {

  var clone;

  if (obj === null || typeof obj !== 'object') {

    return obj;

  }

  var pos = rocket.indexOf(references, obj);

  if (pos !== -1) {

    return copies[pos];

  }

  if (rocket.isArray(obj)) {

    clone = [];

    references.push(obj);
    copies.push(clone);

    for (var i = 0, len = /** @type {Array} */ (obj).length; i < len; ++i) {
      clone.push(rocket.clone.clone_(obj[i], references, copies));
    }

  } else {

    clone = {};

    references.push(obj);
    copies.push(clone);

    for (var i in obj) {
      clone[i] = rocket.clone.clone_(obj[i], references, copies);
    }

  }

  return clone;

};


/**
Clamps a given number between a minimum and maximum limit.

If the given x is less than min, then return min.

Else if the given x is greater than max, then return max.

Else return x.

@param {number} x The number to clamp.
@param {number} min The minimum number to return.
@param {number} max The maximum number to return.
@return {number} The clamped value of x.

@test {3} A number less than the min.
rocket.clamp(1, 3, 5);

@test {5} A number greater than the max.
rocket.clamp(6, 3, 5);

@test {4} A number bounded by the min and max.
rocket.clamp(4, 3, 5);

@test {'a'} A string not less than the min and not greater than the max.
rocket.clamp('a', 3, 5);

@test {5} Positive Infinity.
rocket.clamp(Infinity, 3, 5);

@test {true} Not a number, NaN.
isNaN(rocket.clamp(NaN, 3, 5));

*/
rocket.clamp = function(x, min, max) {
  return ((x < min) ? min : ((x > max) ? max : x));
};


/**
Splits an Array into an Array of smaller Arrays.

Each smaller Array has at most the given number of values.

@param {Array} arr The Array.
@param {number} chunk The maximum number of values of each chunk.
@return {Array} An Array of the smaller Arrays.

@test {[[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10]]} Chunking an Array into four.
rocket.chunk([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],  3);

@test {[[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]} Chunking an Array into one.
rocket.chunk([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],  11);

@test {[[0], [1], [2], [3], [4], [5], [6], [7], [8], [9], [10]]}
  Chunking an Array into ten.
rocket.chunk([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],  1);

*/
rocket.chunk = function(arr, chunk) {

  var results = [];

  for (var i = 0, len = arr.length; i < len; i += chunk) {
    results.push(arr.slice(i, i + chunk));
  }

  return results;

};


/**
Binds a context and optionally variables to a function.

This creates and returns a new function.

@param {function(this:Object, ...):(Object|undefined)} unbound
  The unbound function to bind to the given object.
@param {Object} self The value to use for this.
@param {...*} var_args Additional arguments to bind.
@return {function(this:Object, ...):(Object|undefined)} The bound function.
@example
// call document.getElementyById using the document as this
rocket.bind(document.getElementById, document)('id');
@test {true} Bind getElementsByTagName and get the HTMLBodyElement.
rocket.bind(document.getElementsByTagName, document)('body')[0] ===
    document.body;
*/
rocket.bind = function(unbound, self, var_args) {

  if (Function.prototype.bind) {

    rocket.bind = function(unbound, self, var_args) {
      return Function.prototype.bind.apply(
          unbound,
          Array.prototype.slice.call(arguments, 1)
      );
    };

  } else {

    rocket.bind = function(unbound, self, var_args) {

      var bound_arguments;

      if (arguments.length === 2) {

        return function() {
          return unbound.apply(self, arguments);
        };

      } else {

        bound_arguments = Array.prototype.slice.call(arguments, 2);

        return function() {
          return unbound.apply(
              self,
              /** @type {Array} */ (bound_arguments).concat(
                  Array.prototype.slice.call(arguments, 0)
              )
          );

        };

      }

    };

  }

  return rocket.bind.apply(null, arguments);

};



/**
AutoTab

@constructor
@implements {rocket.Disposable}
@param {rocket.Elements} elements
*/
rocket.AutoTab = function(elements) {

  this.elements_ = rocket.$(elements);
  this.inputs_ = [];
  this.values_ = [];

  for (var i = 0; this.elements_[i]; ++i) {
    this.inputs_.push(this.elements_[i]);
    this.values_.push(
        /** @type {HTMLInputElement} */
        (this.elements_[i]).value
    );
  }

  var self = this;

  this.listener_ =
      /**
      @this {HTMLInputElement}
      @param {Event} e
      */
      function(e) {

    var value = this.value;
    var index = rocket.indexOf(self.inputs_, this);
    var max_length = this.maxLength;

    var selection_start = (new rocket.Elements([this])).selectionStart();
    var selection_end = (new rocket.Elements([this])).selectionEnd();

    var next_focus_offset;
    var next_selection_range_start;
    var next_selection_range_end;
    var do_not_prevent_default;

    if (e.type === 'keydown') {

      if (selection_start === selection_end) {

        if ((e.which === rocket.KEY.left) &&
            self.inputs_[index - 1] &&
            (selection_start === 0)) {

          next_focus_offset = -1;
          next_selection_range_start = self.inputs_[index - 1].value.length;
          next_selection_range_end = next_selection_range_start;

        } else if ((e.which === rocket.KEY.right) &&
            self.inputs_[index + 1] &&
            (selection_start === value.length)) {

          next_focus_offset = 1;
          next_selection_range_start = 0;
          next_selection_range_end = 0;

        } else if ((e.which === rocket.KEY.backspace) &&
            self.inputs_[index - 1] &&
            (selection_start === 0)) {

          next_focus_offset = -1;
          next_selection_range_start = self.inputs_[index - 1].value.length;
          next_selection_range_end = self.inputs_[index - 1].value.length;

        }

      }

    }

    if ((value.length === max_length) &&
        (/** @type {string} */ (self.values_[index]).length < max_length) &&
        self.inputs_[index + 1] &&
        (selection_start === max_length) &&
        (selection_end === max_length)) {

      next_focus_offset = 1;
      do_not_prevent_default = true;
      next_selection_range_start = 0;
      next_selection_range_end = self.inputs_[index + 1].value.length;

    }

    if (next_focus_offset) {

      (new rocket.Elements([self.inputs_[index + next_focus_offset]]))
          .focus()
          .setSelectionRange(
              /** @type {number} */ (next_selection_range_start),
              /** @type {number} */ (next_selection_range_end)
          );

      if (!do_not_prevent_default) {
        e.preventDefault();
      }

    }

    self.values_[index] = value;

  };

  this.elements_.addEventListener(
      [
        'keydown.AutoTab',
        'keyup.AutoTab'
      ],
      this.listener_
  );

};


/**
@private
@type {Array.<HTMLInputElement>}
*/
rocket.AutoTab.prototype.inputs_;


/**
@private
@type {rocket.Elements}
*/
rocket.AutoTab.prototype.elements_;


/**
@private
@type {Function}
*/
rocket.AutoTab.prototype.listener_;


/**
dispose
*/
rocket.AutoTab.prototype.dispose = function() {

  if (this.elements_) {

    this.elements_.removeEventListener(
        [
          'keydown.AutoTab',
          'keyup.AutoTab'
        ],
        this.listener_
    );

    delete this.elements_;
    delete this.inputs_;
    delete this.listener_;

  }

};



/**
AutoSuggest

@constructor
@extends {rocket.Input}
*/
rocket.AutoSuggest = function() {};
rocket.inherits(rocket.AutoSuggest, rocket.Input);


/**
@private
@type {rocket.Elements}
*/
rocket.AutoSuggest.prototype.container_;


/**
@private
@type {rocket.Elements}
*/
rocket.AutoSuggest.prototype.scroller_;


/**
@private
@type {rocket.Elements}
*/
rocket.AutoSuggest.prototype.table_;


/**
@private
@type {rocket.Elements}
*/
rocket.AutoSuggest.prototype.tbody_;


/**
@private
@type {rocket.Elements}
*/
rocket.AutoSuggest.prototype.highlighted_;


/**
@private
@type {string}
*/
rocket.AutoSuggest.prototype.query_;


/**
@private
@type {Array.<Object.<number, string>>}
*/
rocket.AutoSuggest.prototype.results_;


/**
@private
@type {Object.<number, string>}
*/
rocket.AutoSuggest.prototype.result_;


/**
Override.
*/
rocket.AutoSuggest.prototype.show = function() {

  this.container_ = rocket.createElement('div');
  this.scroller_ = rocket.createElement('div');

  var rect = this.getInput().getBoundingClientRect();

  var self = this;

  if (!this.results_) {
    this.results_ = [];
  }

  this.container_
    .style({
        'border-radius': 3,
        'position': 'absolute',
        'background-color': '#FFFFFF',
        'border': '1px solid #888888',
        'cursor': 'pointer',
        'width': rect.width - 2,
        'top': rect.bottom - 1,
        'left': rect.left
      })
    .preventSelect()
    .addEventListener('mousedown', function(e) {
        e.stopPropagation();
      })
    .live('tr', 'mouseover', /** @this {HTMLTableRowElement} */ (
          function() {
            self.highlight_(new rocket.Elements([this]), false);
          }
      ))
    .live('tr', 'click', /** @this {HTMLTableRowElement} */ (
          function() {
            if (this.parentNode === self.tbody_[0]) {
              self.enter();
              self.hide();
              self.hidden(true);
            }
          }
      ));

  this.scroller_
      .style({
        'max-height': 200,
        'overflow-y': 'auto',
        'overflow-x': 'hidden'
      });

  this.container_.appendChild(this.scroller_);
  new rocket.Elements([document.body]).appendChild(this.container_);

  this.dispatchEvent('render');

};


/**
*/
rocket.AutoSuggest.prototype.change = function() {

  if (this.query_ !== this.getInput().value()) {
    this.query_ = /** @type {string} */ (this.getInput().value());
    this.query(this.query_);
  }

  this.highlighted_ = new rocket.Elements([]);

  this.table_ = rocket.createElement('table');
  this.tbody_ = rocket.createElement('tbody');

  this.table_
    .setAttribute({
        'width': '100%',
        'cellpadding': '1',
        'cellspacing': '0',
        'border': '0'
      })
    .style({
        'table-layout': 'fixed'
      });

  for (var row = 0; this.results_[row]; ++row) {
    var tr = rocket.createElement('tr');
    for (var col = 0; this.results_[row][col]; ++col) {
      tr.appendChild(
          /** @type {rocket.Elements} */
          (rocket.createElement('td')
              .innerHTML(this.results_[row][col])
              .style({
                'white-space': 'nowrap',
                'overflow': 'hidden',
                'text-overflow': 'ellipsis'
              })
          )
      );
    }
    this.tbody_.appendChild(tr);
  }

  this.table_.appendChild(this.tbody_);

  this.scroller_.innerHTML('').appendChild(this.table_);

};


/**
@param {Array.<Object.<number, string>>} results
*/
rocket.AutoSuggest.prototype.setResults = function(results) {

  this.results_ = results;

  if (!this.hidden()) {
    this.change();
  }

};


/**
@param {string} str
*/
rocket.AutoSuggest.prototype.query = function(str) {};


/**
@param {Array.<Object.<number, string>>} data
*/
rocket.AutoSuggest.prototype.data = function(data) {

  data.sort(function(a, b) {
    for (var i = 0; a[i]; ++i) {
      if (a[i] < b[i]) {
        return -1;
      } else if (a[i] > b[i]) {
        return 1;
      }
    }
    return 0;
  });

  this.query = /** @param {string} query */ (function(query) {

    var results = [];

    query = query.toLowerCase();

    for (var i = 0; data[i]; ++i) {
      for (var j = 0; data[i][j]; ++j) {
        if (
            data[i][j]
              .toLowerCase()
              .replace(/<[^>]+>/g, '')
              .indexOf(query) !== -1
        ) {
          results.push(data[i]);
          break;
        }
      }
    }

    this.setResults(results);

  });

};


/**
@private
@param {rocket.Elements} element
@param {boolean} scroll
*/
rocket.AutoSuggest.prototype.highlight_ = function(element, scroll) {

  this.highlighted_.style({
    'backgroundColor': ''
  });

  this.highlighted_ = element;

  this.highlighted_.style({
    'backgroundColor': '#D5E2FF'
  });


  if (scroll) {

    var row_rect = this.highlighted_.getBoundingClientRect();
    var container_rect = this.scroller_.getBoundingClientRect();

    if (row_rect.bottom > container_rect.bottom) {

      this.scroller_.setAttribute({
        'scrollTop':
            this.scroller_.getAttribute('scrollTop') +
            row_rect.bottom -
            container_rect.bottom
      });

    } else if (row_rect.top < container_rect.top) {

      this.scroller_.setAttribute({
        'scrollTop':
            this.scroller_.getAttribute('scrollTop') -
            container_rect.top +
            row_rect.top
      });

    }

  }

};


/**
@param {Object.<number, string>} result
*/
rocket.AutoSuggest.prototype.setResult = function(result) {
  this.enter(result);
};


/**
@return {Object.<number, string>}
*/
rocket.AutoSuggest.prototype.getResult = function() {
  return this.result_;
};


/**
Override.
@param {Object.<number, string>=} opt_result
*/
rocket.AutoSuggest.prototype.enter = function(opt_result) {

  var result;

  if (opt_result) {

    result = opt_result;

  } else {

    if (this.highlighted_) {
      result = this.results_[this.highlighted_.getAttribute('rowIndex')];
    }

    if (!result && this.results_.length === 1) {
      result = this.results_[0];
    }

  }

  if (result) {

    this.result_ = result;

    this.getInput().value(result[0].replace(/<[^>]+>/g, ''));

    if (new rocket.Elements([document.body]).contains(this.getInput())) {
      this.getInput()
          .setSelectionRange(0, result[0].length)
          .focus();
    }

    this.dispatchEvent('select');

  }

};


/**
Override.
*/
rocket.AutoSuggest.prototype.hide = function() {

  this.container_.removeEventListener();

  new rocket.Elements([document.body]).removeChild(this.container_);

  delete this.container_;

  this.dispatchEvent('hide');

};


/**
Override.
*/
rocket.AutoSuggest.prototype.up = function() {

  var rows = this.tbody_.children();

  var row_index = this.highlighted_.getAttribute('rowIndex');

  if (!row_index) {

    this.highlight_(rows.i(rows.length - 1), true);

  } else {

    this.highlight_(rows.i(row_index - 1), true);

  }

};


/**
Override.
*/
rocket.AutoSuggest.prototype.down = function() {

  var rows = this.tbody_.children();

  var row_index = this.highlighted_.getAttribute('rowIndex');

  if (rows[row_index + 1]) {

    this.highlight_(rows.i(/** @type {number} */ (row_index + 1)), true);

  } else {

    this.highlight_(rows.i(0), true);

  }

};



/**
AutoSelect

@constructor
@extends {rocket.AutoSuggest}
*/
rocket.AutoSelect = function() {

  this.addEventListener('render', /** @this {rocket.AutoSelect} */ (function() {

    if (this.getResult()) {

      this.place_holder_ = rocket.createElement('div');

      this.getInput().value('');

      var rect = this.getInput().getBoundingClientRect();

      this.place_holder_
        .style({
            'border-radius': 3,
            'position': 'absolute',
            'background-color': '#FFFFFF',
            'border': '1px solid #888888',
            'top': 0,
            'width': rect.width - 2,
            'left': rect.left
          })
        .innerHTML(this.getResult()[0]);

      new rocket.Elements([document.body]).appendChild(this.place_holder_);

      var place_holder_rect = this.place_holder_.getBoundingClientRect();

      this.place_holder_.style({
        'top': rect.top - place_holder_rect.height + 1
      });

    }

  }));

  this.addEventListener('hide', /** @this {rocket.AutoSelect} */ (function() {

    if (this.place_holder_) {

      this.getInput().value(this.getResult()[0]);

      new rocket.Elements([document.body]).removeChild(this.place_holder_);

      delete this.place_holder_;

    }

  }));

};
rocket.inherits(rocket.AutoSelect, rocket.AutoSuggest);


/**
@private
@type {rocket.Elements}
*/
rocket.AutoSelect.prototype.place_holder_;


/**
@return {rocket.Elements}
*/
rocket.AutoSelect.prototype.getPlaceHolder = function() {
  return this.place_holder_;
};


/**
Creates an array of strings from a string.

If an array is passed, this returns the passed array.

Splits a string around spaces, commas, or any white space characters.

@param {(string|Array.<string>)} str The string to split into an Array.
@return {Array.<string>} The Array representation of the given string.

@test {['foo', 'bar', 'baz']} A String transforms into an Array.
// A String with either or both commas and or spaces.
rocket.arrayify('foo,bar baz');

@test {['foo', 'bar', 'baz', 'baz']} A String transforms into an Array.
// A String with either or both commas and or whitespace.
rocket.arrayify('foo,bar baz' + "\n" + 'baz');

@test {['foo', 'bar']} A String with padding transforms into an Array.
// A String with leading and trailing white space
rocket.arrayify(' foo, bar');

@test {[]} A empty String transforms into an empty Array.
// An empty String.
rocket.arrayify('');

@test {[]} A String with whitespace transforms into an empty Array.
// An empty String.
rocket.arrayify(' ');

@test {['foo', 'bar,baz', 'baz baz']} An Array is not changed.
// regardless if its contents contains commas or spaces
rocket.arrayify(['foo', 'bar,baz', 'baz baz']);

*/
rocket.arrayify = function(str) {

  if (typeof str !== 'string') {
    return str || [];
  }

  str = rocket.trim(str);

  if (str === '') {
    return [];
  }

  if (str.indexOf(',') === -1) {

    if (str.indexOf('  ') === -1 &&
        str.indexOf('\r') === -1 &&
        str.indexOf('\n') === -1 &&
        str.indexOf('\t') === -1) {

      return str.split(' ');

    } else {
      return str.split(/\s+/);
    }

  } else {
    return str.split(/[\s,]+/);
  }
};


/**
Searches the document and returns a new rocket.Elements object of the Elements
that match the given query.

For browsers that don't natively support document.querySelectorAll, the only
supported queries are #id, nodeName, .className, and nodeName.className.

For documents that do natively support document.querySelectorAll, any
natively supported query is also supported within this function.

If the optional context is not specified, then the document body is assumed.

Only the first Element of the optional context is used.

@param {(Window|string|Element|Array.<Element>|NodeList|rocket.Elements|Array.<rocket.Elements>|undefined|null)} query
  The query used to match Elements.
@param {(HTMLDocument|string|Element|Array.<Element>|NodeList|rocket.Elements)=} opt_context
  The parent container within which to constrain queries.
@return {rocket.Elements}
  A new rocket.Elements object containing the matched Elements.

@test {true} The string "body".
rocket.$('body')[0] === document.body;

@test {true} The HTMLBodyElement.
rocket.$(document.body)[0] === document.body;

@test {true} The HTMLBodyElement in an Array.
rocket.$([document.body])[0] === document.body;

@test {true} The HTMLBodyElement length.
rocket.$('body').length === 1;

@test {true} No parameters.
rocket.$().length === 0;

@test {true} Empty Array.
rocket.$([]).length === 0;

*/
rocket.$ = function(query, opt_context) {

  /** @type {(Array.<Element>|NodeList)} */
  var elements;

  if (typeof query === 'string') {
    if (arguments.length === 1) {
      if (query.charAt(0) === '#' && query.match(/^#[\w\d]+$/)) {
        var element = document.getElementById(query.substr(1));
        if (element) {
          elements = [element];
        } else {
          elements = [];
        }
      } else {
        elements = rocket.querySelectorAll(query, document);
      }
    } else {
      if (typeof opt_context === 'string') {
        elements =
            rocket.querySelectorAll(
                query,
                rocket.querySelectorAll(opt_context)[0]
            );
      } else {
        if (opt_context.nodeType) {
          elements =
              rocket.querySelectorAll(
                  query,
                  /** @type {(HTMLDocument|Element)} */ (opt_context)
              );
        } else {
          elements = rocket.querySelectorAll(query, opt_context[0]);
        }
      }
    }


  } else {

    if (query) {
      if (query.nodeType || query === window) {
        elements = [query];
      } else {
        if (rocket.isArray(query[0])) {
          elements = [];
          for (var i = 0; query[i]; ++i) {
            for (var j = 0; query[i][j]; ++j) {
              elements.push(query[i][j]);
            }
          }
        } else {
          elements = /** @type {(Array.<Element>|NodeList)} */ (query);
        }
      }
    } else {
      elements = [];
    }

  }

  return new rocket.Elements(/** @type {(Array.<Element>|NodeList)} */
      (elements)
  );

};


/**
Calls a given Function every interval milliseconds.

Returns a number that can be used to stop the given Function from
continuing to be called.

The given Function will be continuously called unless
stopped with clearInterval.

Allows variables to be bound to the Function when called

@param {function(...)} set_function The function to interval.
@param {number} interval The interval in milliseconds.
@param {...} var_args Arguments to pass to the given function.
@return {number} Interval number used for clearInterval.
@see {rocket.setTimeout}
@example
rocket.setInterval(alert, 1000, 'foo');
// will cause an alert with the text "foo" to
// display once per second

// this is equivalent to creating a closure and passing the variables
setInterval(function(){
  alert('foo');
}, 1000);
*/
rocket.setInterval = function(set_function, interval, var_args) {

  rocket.setInterval = function(set_function, interval, var_args) {

    if (arguments.length < 3) {

      return setInterval(set_function, interval);

    } else {

      var args = Array.prototype.slice.call(arguments, 2);

      return setInterval(
          function() {
            set_function.apply(window, args);
          },
          interval
      );

    }

  };

  // Use the built-in setInterval if it supports var_arg parameters.
  window.setTimeout(
      function() {

        if (arguments[0] === true) {
          rocket.setInterval = setInterval;
        }

      },
      0,
      true
  );

  return rocket.setInterval.apply(window, arguments);

};


/**
Calls a given Function after delay milliseconds.

Returns a number that can be used to prevent the given Function
from being called.

The given Function will be called unless prevented with clearTimeout.

Allows variables to be bound to the Function when called.

@param {function(...)} set_function The function to delay.
@param {number} delay The delay in milliseconds.
@param {...} var_args Arguments to pass to the given function.
@return {number} Timeout number used for clearTimeout.
@see {rocket.setInterval}
@example
rocket.setTimeout(alert, 1000, 'foo');
// will cause an alert with the text "foo" to
// display after one second

// this is equivalent to creating a closure and passing the variables
setTimeout(function(){
  alert('foo');
}, 1000);
*/
rocket.setTimeout = function(set_function, delay, var_args) {

  rocket.setTimeout = function(set_function, delay, var_args) {

    if (arguments.length < 3) {

      return setTimeout(set_function, delay);

    } else {

      var args = Array.prototype.slice.call(arguments, 2);

      return setTimeout(
          function() {
            set_function.apply(window, args);
          },
          delay
      );

    }

  };

  // Use the built-in setTimeout if it supports var_arg parameters.
  window.setTimeout(
      function() {

        if (arguments[0] === true) {
          rocket.setTimeout = setTimeout;
        }

      },
      0,
      true
  );

  return rocket.setTimeout.apply(window, arguments);

};


/**
Executes a given function on every value in the given Array and returns false if
the given function never returns true.

@param {(Array|rocket.Elements)} array The Array.
@param {function(this:Object, Object, number, Object):Object} fnct
  The function to call for every value in this Array.
@param {Object=} opt_self
  The value to use as this when executing the given function.
@return {boolean} Whether the given function never returns true.
*/
rocket.some = function(array, fnct, opt_self) {

  if (Array.prototype.some) {

    rocket.some = function(array, fnct, opt_self) {
      return Array.prototype.some.call(array, fnct, opt_self);
    };

  } else {

    rocket.some = function(array, fnct, opt_self) {

      var i = 0;
      var len = array.length;

      for (; i < len; ++i) {
        if (fnct.call(opt_self, array[i], i, array)) {
          return true;
        }
      }

      return false;

    };

  }

  return rocket.some(array, fnct, opt_self);

};


/**
@typedef
    {{key: (string|number), desc: boolean, type: string, null: boolean}}
*/
rocket.SortKey_;


/**
Sorts an Array of Objects by a key or keys that exists in each Object.

This method changes the original Array.

@param {Array.<Object>} arr The Array of Objects.
@param {(string|number|rocket.SortKey_|Array.<(string|number|rocket.SortKey_)>)} key_columns
  The key that exists within each Object,
  or an Array of keys that exist within the object,
  or an Array of columns (an object with the properties: key, desc, and type).
@param {...string} var_args Additional keys used to sort.
@return {Array.<Object>} The sorted Array of Objects.
@example
// given
var foo = [{'a':3,'b':3},{'a':1,'b':1},{'a':4,'b':1},{'a':2,'b':5}];

// the following methods all produce the same result
rocket.sort(foo, 'a', 'b');
rocket.sort(foo, ['a','b']);
rocket.sort(foo, [{'key': 'a'},{'key': 'b'}]);
rocket.sort(foo, [{'key': 'a', 'type': 'number', 'desc': false},{'key': 'b'}]);

// foo has been transformed into
[{'a':1,'b':1},{'a':2,'b':5},{'a':3,'b':3},{'a':4,'b':1}]
*/
rocket.sort = function(arr, key_columns, var_args) {

  if ((typeof key_columns === 'string') || (typeof key_columns === 'number')) {

    var columns = arguments;
    var len = columns.length;

    arr.sort(function(a, b) {

      for (var i = 1; i < len; ++i) {

        var left = '' + /** @type {*} */ (a[columns[i]]);
        var right = '' + /** @type {*} */ (b[columns[i]]);

        if (left > right) {
          return 1;
        } else if (left < right) {
          return -1;
        }

      }

      return 0;

    });

  } else {

    var columns;

    if (rocket.isArray(key_columns)) {

      columns = key_columns;

    } else {

      columns = [key_columns];

    }

    for (var i = 0; columns[i]; ++i) {
      if (
          (typeof columns[i] === 'string') ||
          (typeof columns[i] === 'number')
      ) {
        columns[i] =
            /** @type {rocket.SortKey_} */
            ({'key': columns[i]});
      }
    }

    var len = columns.length;

    arr.sort(function(a, b) {

      for (var i = 0; i < len; ++i) {

        /** @type {rocket.SortKey_} */
        var column = columns[i];

        var left = /** @type {string} */ (a[column.key]);
        var right = /** @type {string} */ (b[column.key]);

        if (column['null']) {

          if (left === null && right === null) {
            return 0;
          } else if (left === null) {
            return column.desc ? -1 : 1;
          } else if (right === null) {
            return column.desc ? 1 : -1;
          }

        }

        if (column.type === 'number') {

          left = +left;
          right = +right;

        } else if (column.type === 'money') {

          left = +left.replace('(', '-').replace(/[\$,\)]/g, '');
          right = +right.replace('(', '-').replace(/[\$,\)]/g, '');

        } else if (column.type === 'date') {

          left =
              left.split(/\D/)[2] +
              left.split(/\D/)[0] +
              left.split(/\D/)[1];
          right =
              right.split(/\D/)[2] +
              right.split(/\D/)[0] +
              right.split(/\D/)[1];

        } else if (column.type !== 'static') {

          left = '' + left;
          right = '' + right;

        }

        if (left > right) {
          return column.desc ? -1 : 1;
        } else if (left < right) {
          return column.desc ? 1 : -1;
        }

      }

      return 0;

    });

  }

  return arr;

};


/**
Handles iteration of stepping or animation functions.

The parameters passed to the given handler function are the percentage
completion of the animation and the sinusoidal slope.  Both of these values
range from greater than zero to less than or equal to one.  Neither value will
ever be zero.  The last arguments passed to the given handler function will
always both be the number one.

The first parameter to given handler function is the percentage completion,
the second is the sinusoidal slope.

Skips to the last iteration once the opt_duration has been exceeded.

The return value can be passed to clearInterval to pre-maturely terminate the
step.  Doing this could possibly cause the function to not be called with the
final number one arguments and could also prevent the callback from being
executed.

Stopping a stepped function with clearInterval that has already completed
will not throw any errors.

@param {function(number, number)} fnct The iterating function.
@param {number=} opt_duration
  The duration of the animation.
@param {function()=} opt_callback
  The function to call when the animation is complete.
@param {number=} opt_fps
  The frames per second value at which to execute this step.
@return {number} The setInterval return value; used to terminate the step.
*/
rocket.step = function(fnct, opt_duration, opt_callback, opt_fps) {

  var fps = opt_fps || rocket.step.fps_;
  var duration = opt_duration || rocket.step.duration_;
  var begin_time = rocket.now();

  var interval = setInterval(function() {

    var percentage_complete = (rocket.now() - begin_time) / duration;

    if (percentage_complete > 1) {
      percentage_complete = 1;
    }

    fnct(
        percentage_complete,
        0.5 - Math.cos(Math.PI * percentage_complete) / 2
    );

    if (percentage_complete === 1) {

      clearInterval(interval);

      if (opt_callback) {
        opt_callback();
      }

    }

  }, 1000 / fps);

  return interval;

};


/**
The default duration, in milliseconds, for steps.

@private
@type {number}
*/
rocket.step.duration_ = 300;


/**
The default frames per second, fps, for steps.

@private
@type {number}
*/
rocket.step.fps_ = 20;


/**
Parses a date from a given string.

@param {string} str The string to be parsed.
@return {?Date} The parsed Date or null on error.
*/
rocket.strToDate = function(str) {

  var year;
  var month;
  var date;

  var now;

  var len = str.length;
  var segments;

  if (str === str.replace(/\D+/g, '')) {

    if (len < 3) {

      date = str;

    } else if (len === 3 || len === 5 || len === 7) {

      month = str.substr(0, 1);
      date = str.substr(1, 2);
      year = str.substr(3, 4);

    } else if (len < 9) {

      month = str.substr(0, 2);
      date = str.substr(2, 2);
      year = str.substr(4, 4);

    }

  } else {

    segments = str.replace(/^\D+|\D+$/g, '').split(/\D+/);

    if (segments.length < 4) {

      if (str.indexOf('-') === -1) {

        month = segments[0];
        date = segments[1];
        year = segments[2];

      } else {

        year = segments[0];
        month = segments[1];
        date = segments[2];

      }

    }

  }

  if (!date) {

    return null;

  }

  if (!year) {

    now = new Date();
    year = now.getFullYear();

  } else if (year < 100) {

    if (year < rocket.strToDate.century_divider_) {
      year = '20' + year;
    } else {
      year = '19' + year;
    }

  }

  if (!month) {

    if (!now) {
      now = new Date();
    }

    month = now.getMonth() + 1;

  }

  return new Date(year, month - 1, date);

};


/**
Divider between assuming 19th or 20th century.

@private
*/
rocket.strToDate.century_divider_ = (new Date()).getFullYear() - 2000 + 10;


/**
Parses a string and returns a human readable time.

@param {string} str
@return {?string}
  Human readable time string in the form: hour, colon, minute, space, meridian.
*/
rocket.strToTime = function(str) {

  var hour;
  var minute;
  var meridian;

  var meridian_divider = 6;

  if (str.indexOf('p') !== -1) {
    meridian = 'pm';
  } else if (str.indexOf('a') !== -1) {
    meridian = 'am';
  }

  str = str.replace(/[^\d\:]/g, '');

  if (str.indexOf(':') !== -1) {

    hour = str.split(':')[0];
    minute = str.split(':')[1];

  } else {

    var len = str.length;

    if (len === 1 || len === 3) {

      hour = str.substr(0, 1);
      minute = str.substr(1);

    } else if (len === 2 || len === 4) {

      hour = str.substr(0, 2);
      minute = str.substr(2);

    }

  }

  if (hour) {

    if (!meridian) {
      if (hour > 11 || hour < meridian_divider) {
        meridian = 'pm';
      } else {
        meridian = 'am';
      }
    }

    hour = rocket.padLeft('' + (hour % 12 || 12), 2, '0');
    minute = rocket.padLeft('' + minute, 2, '0');

    return hour + ':' + minute + ' ' + meridian;

  } else {

    return null;

  }

};


/**
Sums the arguments passed to it.

@param {...number} var_args The numbers to sum.
@return {number} The sum.
*/
rocket.sum = function(var_args) {

  var len = arguments.length;
  var sum = 0;

  while (len--) {
    sum += /** @type {number} */ (arguments[len]);
  }

  return sum;

};


/**
Creates rocket.Elements containing an HTMLTableElement along with references
to its rows and cells.

@param {number=} opt_columns The number of columns.
@param {number=} opt_rows The number of rows.
@return {rocket.table.Table_}
  A rocket.Elements containing an HTMLTableElement.
*/
rocket.table = function(opt_columns, opt_rows) {

  var columns;
  var rows;

  if (arguments.length === 2) {
    columns = opt_columns;
    rows = opt_rows;
  } else {
    rows = 1;
    if (arguments.length === 1) {
      columns = opt_columns;
    } else {
      columns = 1;
    }
  }

  var table = /** @type {rocket.table.Table_} */
      (rocket.createElement('table'));
  var tbody = rocket.createElement('tbody');

  table.setAttribute({
    'width': '100%',
    'cellpadding': '0',
    'cellspacing': '0',
    'border': '0'
  });

  table.style({'table-layout': 'fixed'});

  table.trs = [];
  table.tds = [];

  for (var i = 0; i < rows; ++i) {
    var tr = rocket.createElement('tr');
    table.trs.push(tr);
    tr.tds = [];
    for (var j = 0; j < columns; ++j) {
      var td = rocket.createElement('td');
      tr.appendChild(td);
      tr.tds.push(td);
    }
    if (i === 0) {
      table.tds = tr.tds;
    }
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  table.tbody = tbody;

  return table;

};



/**
Syntactic sugar.

Used explicitly and solely for properly documenting and annotating the return
value of rocket.table.

@private
@constructor
@extends {rocket.Elements}
*/
rocket.table.Table_ = function() {};


/**
@type {Array.<rocket.table.Table_.Tr_>}
*/
rocket.table.Table_.prototype.trs;


/**
@type {Array.<rocket.Elements>}
*/
rocket.table.Table_.prototype.tds;


/**
@type {rocket.Elements}
*/
rocket.table.Table_.prototype.tbody;



/**
@private
@constructor
@extends {rocket.Elements}
*/
rocket.table.Table_.Tr_ = function() {};


/**
@type {Array.<rocket.Elements>}
*/
rocket.table.Table_.Tr_.prototype.tds;


/**
Returns a function that limits or throttles a function's executions
regardless of how many times it's called.

Returns a function that will execute handler immediately after the returned
function has been called, but not again, regardless of how many times the
returned function is called, until opt_period milliseconds have passed.

Will preserve arguments and the value of this in the function.

@param {number} period The number of milliseconds to wait between calls.
@param {function(this:Object, ...):(Object|undefined)} handler
  The function to throttle.
@return {function(this:Object, ...)} The throttled function.
@example
// call the function resize_something immediately;
// then at most 20 times per second regardless of actual calls
// (or once per 50 milliseconds)
rocket.$(window).addEventListener(
    'resize',
    rocket.throttle(50, resize_something)
);
*/
rocket.throttle = function(period, handler) {

  var throttling = false;
  var self;
  var args;
  var called_while_throttling = false;

  var throttling_complete = function() {

    throttling = false;

    if (called_while_throttling) {
      called_while_throttling = false;
      handler.apply(self, args);
    }

  };

  return /** @this {Object} */ (function() {

    if (throttling) {

      called_while_throttling = true;

    } else {

      throttling = true;

      setTimeout(
          throttling_complete,
          period
      );

      self = this;
      args = arguments;

      handler.apply(this, arguments);

    }

  });

};



/**
TimeInput

@constructor
@extends {rocket.Input}
*/
rocket.TimeInput = function() {};
rocket.inherits(rocket.TimeInput, rocket.Input);


/**
@type {rocket.Elements}
*/
rocket.TimeInput.prototype.container_;


/**
*/
rocket.TimeInput.prototype.show = function() {

  var rect = this.getInput().getBoundingClientRect();

  /** @type {HTMLTableCellElement} */
  var highlighted;

  var previous_background_color;
  var previous_color;

  /** @type {Object.<number, HTMLTableCellElement>} */
  var selected = {};

  var self = this;

  this.container_ = rocket.createElement('div')
    .style({
        'border-radius': 3,
        'position': 'absolute',
        'border': '1px solid #888888',
        'cursor': 'pointer',
        'width': 400,
        'left': rect.left,
        'top': rect.bottom - 1
      })
    .preventSelect()
    .addEventListener('mousedown', function(e) {
        e.stopPropagation();
      })
    .live('td', 'mouseover', /** @this {HTMLTableCellElement} */ (function() {

        if (highlighted) {
          highlighted.style.backgroundColor = previous_background_color;
          highlighted.style.color = previous_color;
        }

        previous_background_color = this.style.backgroundColor;
        previous_color = this.style.color;

        this.style.backgroundColor = '#D5E2FF';
        this.style.color = '';

        highlighted = this;

      }))
    .live('td', 'click', /** @this {HTMLTableCellElement} */ (function() {

        var row = /** @type {HTMLTableRowElement} */ (this.parentNode).rowIndex;

        if (selected[row]) {
          selected[row].style.backgroundColor = '';
          selected[row].style.color = '';
        }

        highlighted = null;

        selected[row] = this;

        this.style.backgroundColor = '#10246A';
        this.style.color = '#FFFFFF';

        var hour = selected[0];
        var minute = selected[1];
        var meridian = selected[2];

        if (hour && minute && meridian) {

          self.getInput()
              .value(
                  rocket.padLeft(
                      hour.innerHTML,
                      2,
                      '0'
                  ) + ':' +
                  minute.innerHTML + ' ' +
                  meridian.innerHTML
              )
              .focus()
              .setSelectionRange(0, 8);

          self.hide();
          self.hidden(true);

        }

      }));

  this.render_times_();

  new rocket.Elements([document.body]).appendChild(this.container_);

  this.container_.fit();

};


/**
@private
*/
rocket.TimeInput.prototype.render_times_ = function() {

  var table = rocket.createElement('table');
  var tbody = rocket.createElement('tbody');
  var tr;
  var td;

  table
    .setAttribute({
        'width': '100%',
        'cellpadding': '5',
        'cellspacing': '1',
        'border': '0'
      })
    .style({
        'table-layout': 'fixed',
        'background-color': '#CCCCCC'
      });

  tbody.style({
    'background-color': '#FFFFFF'
  });

  tr = rocket.createElement('tr');
  for (var i = 0; i < 12; ++i) {
    td = rocket.createElement('td');
    td.setAttribute({
      'align': 'center'
    });
    td.innerHTML('' + (i || 12));
    tr.appendChild(td);
  }
  tbody.appendChild(tr);

  tr = rocket.createElement('tr');
  for (var i = 0; i < 4; ++i) {
    td = rocket.createElement('td');
    td.setAttribute({
      'align': 'center',
      'colspan': 3
    });
    td.innerHTML('' + (i * 15 || '00'));
    tr.appendChild(td);
  }
  tbody.appendChild(tr);

  tr = rocket.createElement('tr');

  td = rocket.createElement('td');
  td.setAttribute({
    'align': 'center',
    'colspan': 6
  });
  td.innerHTML('am');
  tr.appendChild(td);

  td = rocket.createElement('td');
  td.setAttribute({
    'align': 'center',
    'colspan': 6
  });
  td.innerHTML('pm');
  tr.appendChild(td);

  tbody.appendChild(tr);

  table.appendChild(tbody);

  this.container_.appendChild(table);

};


/**
Override.
*/
rocket.TimeInput.prototype.enter = function() {

  var time = rocket.strToTime(/** @type {string} */ (this.getInput().value()));

  if (time) {

    this.getInput().value(time);

  }

};


/**
*/
rocket.TimeInput.prototype.hide = function() {

  this.container_.removeEventListener();

  new rocket.Elements([document.body]).removeChild(this.container_);

  delete this.container_;

};


/**
Trims a string.

@param {string} str The string to be trimmed.
@return {string} The trimmed string.
*/
rocket.trim = function(str) {

  if (String.trim) {

    rocket.trim = String.trim;

  } else {

    rocket.trim = function(str) {
      return str && str.replace(/^\s+|\s+$/g, '');
    };

  }

  return rocket.trim(str);

};


/**
Trims the beginning of a string.

@param {string} str The string to be trimmed.
@return {string} The trimmed string.
*/
rocket.trimLeft = function(str) {

  if (String.trimLeft) {

    rocket.trimLeft = String.trimLeft;

  } else {

    rocket.trimLeft = function(str) {
      return str && str.replace(/^\s+/, '');
    };

  }

  return rocket.trimLeft(str);

};


/**
Trims the end of a string.

@param {string} str The string to be trimmed.
@return {string} The trimmed string.
*/
rocket.trimRight = function(str) {

  if (String.trimRight) {

    rocket.trimRight = String.trimRight;

  } else {

    rocket.trimRight = function(str) {
      return str && str.replace(/\s+$/, '');
    };

  }

  return rocket.trimRight(str);

};


/**
Removes duplicates from an Array.

Removes strictly equal values from the Array.

@param {Array} arr The Array.
@return {Array} An Array with duplicate values removed.
@example
// given
var foo = [0,0,1,1,2,2,3,"3"];

rocket.unique(foo);
// returns
[0, 1, 2, 3, "3"]
*/
rocket.unique = function(arr) {

  var results = [];

  for (var i = 0, len = arr.length; i < len; ++i) {
    if (rocket.indexOf(results, arr[i]) === -1) {
      results.push(arr[i]);
    }
  }

  return results;

};


/**
Returns an array of all of the values of an object.

@param {Object} object The Object or Array over which to iterate.
@return {Array.<Object>} The values of the object.
@example
rocket.values({'foo':'bar','foofoo':'barbar'});
// returns
['bar','barbar']
*/
rocket.values = function(object) {

  var values = [];

  for (var i in object) {
    values.push(object[i]);
  }

  return values;

};


/**
Version number for this release.

@const
*/
rocket.version = 14.04;



/**
XMLHttpRequest class.

@constructor
@extends {rocket.EventTarget}
@param {XMLHttpRequest=} opt_request A request to use.
*/
rocket.XMLHttpRequest = function(opt_request) {

  this.request_ = opt_request || new XMLHttpRequest();
  this.headers_ = {};

};
rocket.inherits(rocket.XMLHttpRequest, rocket.EventTarget);


/**
Request url.

@private
@type {string}
*/
rocket.XMLHttpRequest.prototype.url_;


/**
Request method.

@private
@type {string}
*/
rocket.XMLHttpRequest.prototype.method_;


/**
Data string, object, or object returning function.

@type {(string|Object.<string, string>|function():(string|Object.<string, string>))}
*/
rocket.XMLHttpRequest.prototype.data;


/**
Data string before last sent request.

@private
@type {string}
*/
rocket.XMLHttpRequest.prototype.saved_data_;


/**
The XMLHttpRequest to use.

@private
@type {XMLHttpRequest}
*/
rocket.XMLHttpRequest.prototype.request_;


/**
The XMLHttpRequest headers.

@private
@type {Object.<string, string>}
*/
rocket.XMLHttpRequest.prototype.headers_;


/**
The onabort function.

@type {function()}
*/
rocket.XMLHttpRequest.prototype.onabort;


/**
The onreadystatechange function.

@type {function()}
*/
rocket.XMLHttpRequest.prototype.onreadystatechange;


/**
This readyState.

@type {number}
*/
rocket.XMLHttpRequest.prototype.readyState = 0;


/**
This status.

@type {number}
*/
rocket.XMLHttpRequest.prototype.status = 0;


/**
This responseText.

@type {string}
*/
rocket.XMLHttpRequest.prototype.responseText = '';


/**
This guid.

@private
@type {number}
*/
rocket.XMLHttpRequest.prototype.request_key_;


/**
Returns a string by looping through an object and using encodeURIComponent.

@private
@param {(Object|string)} object The object.
@return {string} The URI encoded string.
*/
rocket.XMLHttpRequest.prototype.uri_encode_ = function(object) {

  if (typeof object === 'string') {
    return object;
  }

  var encoded_string = [];

  for (var property in object) {

    encoded_string.push(
        encodeURIComponent(property) +
        '=' +
        encodeURIComponent(object[property])
    );

  }

  return encoded_string.join('&').replace(/%20/g, '+');
};


/**
Open a this rocket.XMLHttpRequest.

@param {string} method The method: "GET" or "POST".
@param {string} url The url.
*/
rocket.XMLHttpRequest.prototype.open = function(method, url) {

  this.method_ = method;
  this.url_ = url;

  var is_get = (method.toUpperCase() === 'GET');

  if (is_get) {
    this.init_data_();
  }

  this.request_.open(
      method,
      url +
          (is_get && this.saved_data_ ?
              (url.indexOf('?') === -1 ? '?' : '&') + this.saved_data_ :
              ''),
      true
  );

  this.init_ready_state_change_();

  this.headers_ = {};
  this.readyState = 1;
  this.status = 0;
  this.responseText = '';

  this.removeEventListener();
  delete this.onreadystatechange;
  delete this.onabort;

};


/**
Send this XHR request.

@param {string=} opt_data The data to send.
*/
rocket.XMLHttpRequest.prototype.send = function(opt_data) {

  var is_post = this.method_ && (this.method_.toUpperCase() === 'POST');

  if (opt_data) {

    this.request_.send(opt_data);

  } else {

    this.request_.send(
        (this.method_.toUpperCase() === 'POST') ? this.init_data_() : ''
    );

  }

  if (this.onreadystatechange) {

    this.onreadystatechange();

  }

  this.dispatchEvent('readystatechange');



};


/**
Sets headers

@param {string} header The header.
@param {string} value The value.
*/
rocket.XMLHttpRequest.prototype.setRequestHeader = function(header, value) {

  this.headers_[header] = value;

  this.request_.setRequestHeader(header, value);

};


/**
Abort this request.
*/
rocket.XMLHttpRequest.prototype.abort = function() {

  if (this.request_ && typeof this.request_.abort === 'function') {

    this.request_.abort();

  }

  if (this.onabort) {

    this.onabort();

  }

  this.dispatchEvent('abort');

  this.removeEventListener();
  delete this.onreadystatechange;
  delete this.onabort;

  this.headers_ = {};
  this.readyState = 0;
  this.status = 0;
  this.responseText = '';

};


/**
Internal function for data initialization.

Initializes this.saved_data_ from this.data.

@private
@return {string} This saved data.
*/
rocket.XMLHttpRequest.prototype.init_data_ = function() {

  var data;

  if (this.data) {

    if (typeof this.data === 'string') {

      this.saved_data_ = this.data;

    } else {

      if (typeof this.data === 'function') {

        data = /** @type {function():(string|Object.<string, string>)} */
            (this.data)();

      } else {

        data = this.data;

      }

      this.saved_data_ = this.uri_encode_(data);

    }

  } else {

    this.saved_data_ = '';

  }

  return this.saved_data_;

};


/**
Internal function for readystatechange initialization.

Initializes this.request_.onreadystatechange.

@private
*/
rocket.XMLHttpRequest.prototype.init_ready_state_change_ = function() {

  var request_key_ = ++rocket.XMLHttpRequest.request_key_;
  rocket.XMLHttpRequest.requests_[request_key_] = this;

  this.request_.onreadystatechange = function() {

    var self = rocket.XMLHttpRequest.requests_[request_key_];

    if (self) {

      self.readyState = self.request_.readyState;

      if (self.readyState === 4) {

        self.status = self.request_.status;

        if (self.status === 200) {

          self.responseText = self.request_.responseText;

          /** @type {function():(string|Object.<string, string>)} */
          self.data;

          if (typeof self.data === 'function' &&
                  self.saved_data_ !== self.uri_encode_(self.data())
          ) {
            self.dispatchEvent('change');
          } else {
            self.dispatchEvent('nochange');
          }

          self.dispatchEvent('success');

        } else if (self.status !== 0) {

          self.dispatchEvent('error');

        }

        self.dispatchEvent('complete');

      }

      if (self.onreadystatechange) {
        self.onreadystatechange();
      }

      self.dispatchEvent('readystatechange');

      if (self.readyState === 4) {

        self.removeEventListener();

        delete self.onreadystatechange;
        delete self.onabort;

        self = null;

        delete rocket.XMLHttpRequest.requests_[request_key_];

      }

    }

  };

};


/**
Guid to prevent request leaks.

@private
*/
rocket.XMLHttpRequest.request_key_ = 0;


/**
Storage of requests to prevent leaks.

@private
@type {Object.<number, rocket.XMLHttpRequest>}
*/
rocket.XMLHttpRequest.requests_ = {};
