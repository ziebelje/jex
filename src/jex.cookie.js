

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
