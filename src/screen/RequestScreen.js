(function() {
  'use strict';

  /**
   * Request screen abstract class to perform io operations on descendant
   * screens.
   * @constructor
   * @extends {senna.Screen}
   */
  senna.RequestScreen = function() {
    senna.RequestScreen.base(this, 'constructor');
  };
  senna.inherits(senna.RequestScreen, senna.Screen);

  /**
   * @inheritDoc
   */
  senna.RequestScreen.prototype.cacheable = true;

  /**
   * Holds default http headers to set on request.
   * @type {?Object=}
   * @default {
   *   'X-PJAX': 'true',
   *   'X-Requested-With': 'XMLHttpRequest'
   * }
   * @protected
   */
  senna.RequestScreen.prototype.httpHeaders = {
    'X-PJAX': 'true',
    'X-Requested-With': 'XMLHttpRequest'
  };

  /**
   * Holds default http method to perform the request.
   * @type {!String}
   * @default GET
   * @protected
   */
  senna.RequestScreen.prototype.httpMethod = 'GET';

  /**
   * Holds the XHR object responsible for the request.
   * @type {XMLHttpRequest}
   * @default null
   * @protected
   */
  senna.RequestScreen.prototype.request = null;

  /**
   * Holds the request timeout.
   * @type {!Number}
   * @default 30000
   * @protected
   */
  senna.RequestScreen.prototype.timeout = 30000;

  /**
   * Aborts the current request if any.
   */
  senna.RequestScreen.prototype.abortRequest = function() {
    if (this.request) {
      this.request.abort();
    }
  };

  /**
   * Gets the http headers.
   * @return {?Object=}
   */
  senna.RequestScreen.prototype.getHttpHeaders = function() {
    return this.httpHeaders;
  };

  /**
   * Gets the http method.
   * @return {!String}
   */
  senna.RequestScreen.prototype.getHttpMethod = function() {
    return this.httpMethod;
  };

  /**
   * Gets the request object.
   * @return {?Object}
   */
  senna.RequestScreen.prototype.getRequest = function() {
    return this.request;
  };

  /**
   * Gets the request timeout.
   * @return {!Number}
   */
  senna.RequestScreen.prototype.getTimeout = function() {
    return this.timeout;
  };

  /**
   * @inheritDoc
   */
  senna.RequestScreen.prototype.load = function(path) {
    senna.RequestScreen.base(this, 'load', path);
    var self = this;
    var cache = this.getCache();
    if (senna.isDefAndNotNull(cache)) {
      return senna.Promise.resolve(cache);
    }
    return senna.request(path, this.httpMethod, this.httpHeaders, this.timeout).then(function(xhr) {
      self.setRequest(xhr);
      return xhr.responseText;
    });
  };

  /**
   * Sets the http headers.
   * @param {?Object=} httpHeaders
   */
  senna.RequestScreen.prototype.setHttpHeaders = function(httpHeaders) {
    this.httpHeaders = httpHeaders;
  };

  /**
   * Sets the http method.
   * @param {!String} httpMethod
   */
  senna.RequestScreen.prototype.setHttpMethod = function(httpMethod) {
    this.httpMethod = httpMethod;
  };

  /**
   * Sets the request object.
   * @param {?Object} request
   */
  senna.RequestScreen.prototype.setRequest = function(request) {
    this.request = request;
  };

  /**
   * Sets the request timeout.
   * @param {!Number} timeout
   */
  senna.RequestScreen.prototype.setTimeout = function(timeout) {
    this.timeout = timeout;
  };

}());
