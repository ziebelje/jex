


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
  if (document.all && !document.querySelector) { // IE7 and lower
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
