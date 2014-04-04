


/**
 * This is a super-basic API call class that basically just holds data for the
 * POST parameters and exposes a method to make it easy to change the
 * arguments.
 *
 * @param {string} resource The resource.
 * @param {string} method The method.
 * @param {string|undefined=} opt_alias The alias.
 *
 * @constructor
 */
jex.cora_request.api_call = function(resource, method, opt_alias) {
  this.resource_ = resource;
  this.method_ = method;
  this.alias_ = opt_alias;
};


/**
 * Resource.
 *
 * @private
 *
 * @type {string}
 */
jex.cora_request.prototype.resource_;


/**
 * Method.
 *
 * @private
 *
 * @type {string}
 */
jex.cora_request.prototype.method_;


/**
 * Alias.
 *
 * @private
 *
 * @type {string}
 */
jex.cora_request.prototype.alias_;


/**
 * Arguments.
 *
 * @private
 *
 * @type {Object}
 */
jex.cora_request.prototype.arguments_;


/**
 * Set the arguments.
 *
 * @param {Object} args The arguments. With Cora, all arguments are
 * objects/associative arrays.
 */
jex.cora_request.api_call.prototype.set_arguments = function(args) {
  this.arguments_ = args;
};


/**
 * Set the alias.
 *
 * @param {string} alias The API call alias.
 */
jex.cora_request.api_call.prototype.set_alias = function(alias) {
  this.alias_ = alias;
};


/**
 * Get the alias.
 *
 * @return {string} alias The API call alias.
 */
jex.cora_request.api_call.prototype.get_alias = function() {
  return this.alias_;
};


/**
 * Get the resource.
 *
 * @return {string} resource The API call resource.
 */
jex.cora_request.api_call.prototype.get_resource = function() {
  return this.resource_;
};


/**
 * Get the method.
 *
 * @return {string} method The API call method.
 */
jex.cora_request.api_call.prototype.get_method = function() {
  return this.method_;
};


/**
 * Return the API call object prepped and ready to send to Cora. This excludes
 * the alias and arguments if not set because they are not strictly required.
 *
 * @return {Object} An object representing the API call.
 */
jex.cora_request.api_call.prototype.get_object = function() {
  var object = {
    'resource': this.resource_,
    'method': this.method_
  };

  if (this.alias_) {
    object.alias = this.alias_;
  }

  if (this.arguments_) {
    object.arguments = rocket.JSON.stringify(this.arguments_);
  }

  return object;
};
