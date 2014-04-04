


/**
 * This class is used to send API requests to a Cora API. It handles building
 * the API call and can optionally execute a callback in the event of a
 * success/failure.
 *
 * @constructor
 */
jex.cora_request = function() {
  this.api_calls_ = [];
  this.xhr_ = new rocket.XMLHttpRequest();
};


/**
 * A list of API calls to make in this request. More than one here will send a
 * multi API-call request.
 *
 * @private
 *
 * @type {Array}
 */
jex.cora_request.prototype.api_calls_;


/**
 * The XHR object to use for this request.
 *
 * @private
 *
 * @type {rocket.XMLHttpRequest}
 */
jex.cora_request.prototype.xhr_;


/**
 * Function to call upon success.
 *
 * @private
 *
 * @type {Function}
 */
jex.cora_request.prototype.success_callback_;


/**
 * Function to call upon failure.
 *
 * @private
 *
 * @type {Function}
 */
jex.cora_request.prototype.error_callback_;


/**
 * Time API request execution began.
 *
 * @private
 *
 * @type {Date}
 */
jex.cora_request.prototype.execution_start_;


/**
 * Time API request execution ended.
 *
 * @private
 *
 * @type {Date}
 */
jex.cora_request.prototype.execution_end_;


/**
 * The API URI. Hardcode this to wherever the API is at.
 *
 * @private
 *
 * @type {string}
 */
jex.cora_request.api_uri_;


/**
 * The API Key. Hardcode this to the API key.
 *
 * @private
 *
 * @type {string}
 */
jex.cora_request.api_key_;


/**
 * Add an API call to this request. If more than one is added, this will
 * become a batch request.
 *
 * @param {string} resource The resource.
 * @param {string} method The method.
 * @param {Object=} opt_arguments The arguments.
 * @param {string=} opt_alias The alias.
 *
 * @return {jex.cora_request.api_call} The API call that was actually added.
 */
jex.cora_request.prototype.add_api_call = function(resource, method, opt_arguments, opt_alias) {
  var api_call = new jex.cora_request.api_call(resource, method, opt_alias);
  if (opt_arguments) {
    api_call.set_arguments(opt_arguments);
  }
  this.api_calls_.push(api_call);
  return api_call;
};


/**
 * Remove a specific API call from this API request. In general only useful if
 * you have a particular reason why this changed API request should override
 * whatever request you previously sent.
 *
 * @param {jex.cora_request.api_call} api_call The api_call to remove.
 */
jex.cora_request.prototype.remove_api_call = function(api_call) {
  this.api_calls_.splice(rocket.indexOf(this.api_calls_, api_call), 1);
};


/**
 * Remove all API calls from this API request. In general only useful if
 * you have a particular reason why this changed API request should override
 * whatever request you previously sent.
 */
jex.cora_request.prototype.remove_all_api_calls = function() {
  this.api_calls_ = [];
};


/**
 * Send this API request to the server. It will grab whatever the current API
 * calls are so you can technically send the same request twice but have it be
 * different. The benefit here is that if you re-use the same request it will
 * cancel the previouslly sent request if it is not complete. This means that
 * if you send two API calls from an autocomplete field really quickly, you
 * can guarantee that the second request will cancel the first one so the
 * callbacks on the first API request do not get executed after the second one
 * if that API request happens to take longer.
 */
jex.cora_request.prototype.send = function() {
  var self = this;

  // Reset times so they are gone in case of error.
  delete this.execution_start_;
  delete this.execution_end_;

  this.xhr_.data = {};
  if (this.api_calls_.length === 1) {
    rocket.extend(this.xhr_.data, this.api_calls_[0].get_object());
  }
  else {
    this.xhr_.data.batch = [];
    for (var i = 0, len = this.api_calls_.length; i < len; ++i) {
      // Auto-set the alias if it was not provided for a batch API call.
      if (!this.api_calls_[i].get_alias()) {
        this.api_calls_[i].set_alias(this.api_calls_[i].get_resource() + '.' + this.api_calls_[i].get_method());
      }
      this.xhr_.data.batch.push(this.api_calls_[i].get_object());
    }
    this.xhr_.data.batch = rocket.JSON.stringify(this.xhr_.data.batch);
  }

  this.xhr_.data.api_key = jex.cora_request.api_key_;
  this.xhr_.open('POST', jex.cora_request.api_uri_);
  this.xhr_.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  this.xhr_.addEventListener('success', function() {
    self.execution_end_ = new Date();
    try {
      var response = rocket.JSON.parse(this.responseText);
    }
    catch (e) {
      jex.console.error('API call failed (could not decode JSON)');
      if (self.error_callback_) {
        self.error_callback_({'response_text': this.responseText});
        return;
      }
    }

    if (response.success === false) {
      jex.console.error('API call failed (success false)');
      if (self.error_callback_) {
        self.error_callback_({'data': response.data});
      }
    }
    else {
      if (self.success_callback_) {
        self.success_callback_(response.data);
      }
    }
  });

  this.xhr_.addEventListener('error', function() {
    jex.console.error('API call failed (status not 200)');
    self.execution_end_ = new Date();
    if (self.error_callback_) {
      self.error_callback_({'response_text': this.responseText});
    }
  });

  this.execution_start_ = new Date();
  this.xhr_.send();
};


/**
 * Aborts the current request. Callbacks will not fire but the server will
 * continue executing whatever it wants.
 */
jex.cora_request.prototype.abort = function() {
  this.xhr_.abort();
};


/**
 * Get the API call execution time in milliseconds
 * @return {[type]} [description]
 */
jex.cora_request.prototype.get_execution_time = function() {
  if (this.execution_end_ && this.execution_start_) {
    return this.execution_end_.getTime() - this.execution_start_.getTime();
  }
  else {
    return null; // todo: throw an error?
  }
};


/**
 * Set the success callback function.
 *
 * @param {Function} success_callback The function to call if the API request
 * succeeded. A single data argument will be passed to the callback that
 * contains the data key from the response.
 */
jex.cora_request.prototype.set_success_callback = function(success_callback) {
  this.success_callback_ = success_callback;
};


/**
 * Set the error callback function.
 *
 * @param {Function} error_callback The function to call if the API request
 * failed. A single data argument will be passed to the callback that contains
 * the data key from the response.
 */
jex.cora_request.prototype.set_error_callback = function(error_callback) {
  this.error_callback_ = error_callback;
};


/**
 * Set the API URI.
 *
 * @param {string} api_uri The API URI to set.
 */
jex.cora_request.set_api_uri = function(api_uri) {
  jex.cora_request.api_uri_ = api_uri;
};


/**
 * Set the API Key.
 *
 * @param {string} api_key The API Key to set.
 */
jex.cora_request.set_api_key = function(api_key) {
  jex.cora_request.api_key_ = api_key;
};
