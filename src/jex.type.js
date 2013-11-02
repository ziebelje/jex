

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
