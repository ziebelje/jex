/**
 * @type {Object}
 * @namespace
 * @const
 */
var rocket = {};


/**
 * @param
 * {(Window|string|Element|Array.<Element>|NodeList|rocket.Elements|undefined|null)}
 * query The query used to match Elements.
 * @param
 * {(HTMLDocument|string|Element|Array.<Element>|NodeList|rocket.Elements)=}
 * opt_context The parent container within which to constrain queries.
 * @return {rocket.Elements} A new rocket.Elements object containing the
 * matched Elements.
*/
rocket.$ = function(query, opt_context) {};


/**
 * @param {string} str The string to be trimmed.
 * @return {string} The trimmed string.
 */
rocket.trim = function(str) {};



/**
 * @constructor
 * @param {(NodeList|Array.<Element>)} elements
 */
rocket.Elements = function(elements) {};


/**
 * @param {(Element|Array.<Element>|rocket.Elements)} child_node
 */
rocket.Elements.prototype.appendChild = function(child_node) {};


/**
 * @param {string=} opt_html
 * @return {(rocket.Elements|string|undefined)}
 */
rocket.Elements.prototype.innerHTML = function(opt_html) {};


/**
 * @param {(string|Object.<string, (string|number)>)} styles Styles.
 * @param {(string|number)=} opt_value The value to set.
 * @return {(string|number|undefined|rocket.Elements)} This Elements.
 */
rocket.Elements.prototype.style = function(styles, opt_value) {};


/**
 * @param {(string|Object.<string, (string|boolean|number)>)} attribute The
 * attributes.
 * @param {(string|boolean|number)=} opt_value The value.
 * @return {rocket.Elements} These elements.
 */
rocket.Elements.prototype.setAttribute = function(attribute, opt_value) {};


/**
 * @param {string} attribute The attribute.
 * @return {(string|boolean|number|Array.<string>|undefined)} The first value.
 */
rocket.Elements.prototype.getAttribute = function(attribute) {};


/**
 * @param {(string|Array.<string>)} types
 * @param {(EventListener|function(Event))} fnct
 * @return {rocket.Elements}
 */
rocket.Elements.prototype.addEventListener = function(types, fnct) {};


/**
 * @param {(string|Array.<string>)=} opt_types
 * @param {(EventListener|function(Event))=} opt_fnct
 * @return {rocket.Elements}
 */
rocket.Elements.prototype.removeEventListener = function(opt_types, opt_fnct) {};


/**
 * @param {(string|Object.<string, string>)} attribute The attribute.
 * @param {string=} opt_value The value to set.
 * @return {(string|undefined|rocket.Elements)} This Elements.
 */
rocket.Elements.prototype.dataset = function(attribute, opt_value) {};


/**
 * @param {(string|Array.<string>)} class_names The class names to add.
 * @return {rocket.Elements} These elements.
 */
rocket.Elements.prototype.addClass = function(class_names) {};


/**
 * @param {(string|Array.<string>)} class_names The class names to remove.
 * @return {rocket.Elements} These elements.
 */
rocket.Elements.prototype.removeClass = function(class_names) {};


/**
 * @param {string=} opt_value The value.
 * @return {(rocket.Elements|string|Array.<string>|undefined)} The value or
 * these elements.
 */
rocket.Elements.prototype.value = function(opt_value) {};


/**
 * @param {string} tag_name
 * @return {rocket.Elements}
 */
rocket.createElement = function(tag_name) {};



/**
 * @implements {EventTarget}
 * @constructor
*/
rocket.EventTarget = function() {};


/**
 * @param {string} type The Event.type for which to listen.  An optional
 * namespace can also be provided following a period "." character.
 * @param {(EventListener|function(Event))} listener The EventListener or the
 * function to call when the Event occurs.
 */
rocket.EventTarget.prototype.addEventListener = function(type, listener) {};


/**
 * @param {string=} opt_type The Event.type to be removed. If not given, then
 * all Event.types will be removed. An optional namespace can also be provided
 * following a period "." character.
 * @param {(EventListener|function(Event))=} opt_fnct The EventListener or the
 * function to be removed. If not given, then all EventListeners or functions
 * will be removed.
 */
rocket.EventTarget.prototype.removeEventListener = function(opt_type, opt_fnct) {};


/**
 * @param {(Event|string)} event_or_type The Event.type for which to listen.
 * An optional namespace can also be provided following a period "."
 * character.
 * @return {boolean} Whether any EventListener called Event.preventDefault.
 */
rocket.EventTarget.prototype.dispatchEvent = function(event_or_type) {};


/**
 * @return {Object.<number, Object.<string, Object.<string,
 * Array.<EventListener>|undefined>|undefined>|undefined>}
 */
rocket.EventTarget.getListenerTree = function() {
  return rocket.EventTarget.listener_tree_;
};


/**
 * @private
 * @type {Object.<number, Object.<string, Object.<string,
 * Array.<EventListener>|undefined>|undefined>|undefined>}
 */
rocket.EventTarget.listener_tree_ = {};
