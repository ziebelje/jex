

/**
 * Returns the type of the provided object. It's pretty good but isn't
 * consistent cross-browser for odd things like window and doesn't support
 * custom types. It is, however, good for at least the following types, which
 * is what this function was designed for: null, undefined, boolean, number,
 * string, date, regexp, object, array, function.
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

  // Can only use these shortcuts if frames aren't an issue. The dual checks
  // ensure that objects initialized both of the following ways work:
  // var foo = 'bar';
  // var foo = new String('bar');
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
