


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
