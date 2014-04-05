

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
