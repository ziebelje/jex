
// todo:  ; :, = + and - _, have different values

// todo: add meta key support (for mac and then windows key)

// todo: make ctrl / command be treated the same (or add a special 'mod' key or something)

// todo: replace map with String.fromCharCode() ?

// todo: Modifier keys pressed on their own do not work. For example, I cannot
// have a hotkey for 'shift' or use 'shift' in any sequence alone.

// todo: hotkeys bound to inputs should only fire INSIDE those inputs


/**
 * @const
 *
 * @namespace
 */
jex.hotkey = {};


/**
 * A list of all defined hotkeys. These are organized first by group and then
 * by hotkey.
 *
 * @private
 *
 * @type {Array.<Object.<string, {hotkey: string, callback: Function, inputs: Array.<Element>}>>}
 */
jex.hotkey.hotkeys_ = [];


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
 * keydown event listener.
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
 * @param {{hotkey: (string|Array.<string>), callback: Function, input:
 * (rocket.Elements|Array.<rocket.Elements>)}} options
 *
 * hotkey: The hotkey to add to the page. Hotkeys cannot be duplicated in the
 * same group.
 *
 * callback: The function to call when the hotkey conditions are met.
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

  for (var i = 0, len = hotkeys.length; i < len; ++i) {
    jex.hotkey.hotkeys_.push({
      'hotkey': jex.hotkey.normalize_(hotkeys[i]),
      'callback': options.callback,
      'inputs': inputs
    });
  }

  jex.hotkey.add_listener_();

  return jex.hotkey.hotkeys_.length - 1;
};

jex.hotkey.remove = function(hotkey_id) {
  jex.hotkey.hotkeys_.splice(hotkey_id, 1);
  if (jex.hotkey.hotkeys_.length === 0) {
    this.remove_listener_();
  }
}


/**
 * Add the global event listener.
 *
 * @private
 */
jex.hotkey.add_listener_ = function() {
  // TODO: Fix this. This is an issue where if something (yinaf) removed ALL of
  // the event listeners on the window, then jex.hotkey still thinks it's there
  // because of the is_active_ flag...probably just try to look for the event
  // listener on every add or maybe just remove and re-add every time since that
  // might be quicker anyways.
  jex.hotkey.remove_listener_();
  if (jex.hotkey.is_active_ === false) {
    jex.hotkey.is_active_ = true;
    rocket.$(window).addEventListener(
      'keydown.jex.hotkey',
      jex.hotkey.keydown_handler_
    );
  }
};


/**
 * Remove the global event listener.
 *
 * @private
 */
jex.hotkey.remove_listener_ = function() {
  jex.hotkey.is_active_ = false;
  rocket.$(window).removeEventListener('.jex.hotkey');
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

  // Some more alternative keys. Note that if the replacement contains the
  // alias, then we have to use a more careful replacement to prevent 'escape'
  // from becoming 'escapeape'.
  hotkey = hotkey.replace(/\bins\b/g, 'insert');
  hotkey = hotkey.replace(/\bdel\b/g, 'delete');
  hotkey = hotkey.replace(/\besc\b/g, 'escape');
  hotkey = hotkey.replace('pgup', 'pageup');
  hotkey = hotkey.replace('pgdn', 'pagedown');
  hotkey = hotkey.replace('pgdown', 'pagedown');
  hotkey = hotkey.replace('break', 'pause');

  return hotkey;
};


/**
 * This handler executes when there are hotkeys to track on the page. It
 * appends to the current hotkey and runs any associated callbacks if a hotkey
 * was activated.
 *
 * @private
 *
 * @param {Event} e The event.
 */
jex.hotkey.keydown_handler_ = function(e) {
  // Not sure why I have to do this for closure. It should be able to know this.
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
  // todo ??? get rid of this?
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

  // At this point we have determined what the current hotkey is. Now loop over
  // the listed hotkeys and see if any of them fit.
  var activated_hotkeys = rocket.filter(jex.hotkey.hotkeys_, function(hotkey) {
    if (hotkey.inputs.length > 0) {
      return (
        hotkey.hotkey === jex.hotkey.current_hotkey_ &&
        rocket.indexOf(hotkey.inputs, e.target) !== -1
      );
    }
    else {
      return hotkey.hotkey === jex.hotkey.current_hotkey_;
    }
  });

  // Loop over each of the activated hotkeys and run the callback.
  for (var i = 0, len = activated_hotkeys.length; i < len; ++i) {
    activated_hotkeys[i].callback();
  }

  // Callbacks have already been executed. Now, if a hotkey was pressed, reset
  // the hotkey so we can start over. Otherwise reset the timeout to allow for
  // another key to be pressed.
  if (activated_hotkeys.length > 0) {
    jex.hotkey.reset_();
    e.preventDefault();
  }
  else {
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