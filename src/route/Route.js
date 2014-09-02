(function() {
  'use strict';

  /**
   * Route class.
   * @param {!String|RegExp|Function} path
   * @param {!Function} handler
   * @constructor
   */
  senna.Route = function(path, handler) {
    if (!senna.isDef(path)) {
      throw new Error('Route path not specified.');
    }
    if (!senna.isFunction(handler)) {
      throw new Error('Route handler is not a function.');
    }
    this.setPath(path);
    this.setHandler(handler);
  };

  /**
   * Defines the path which will trigger the route handler.
   * @type {!String|RegExp|Function}
   * @default null
   * @protected
   */
  senna.Route.prototype.path = null;

  /**
   * Defines the handler which will execute once a URL in the application
   * matches the path.
   * @type {!Function}
   * @default null
   * @protected
   */
  senna.Route.prototype.handler = null;

  /**
   * Gets the route handler.
   * @return {!Function}
   */
  senna.Route.prototype.getHandler = function() {
    return this.handler;
  };

  /**
   * Gets the route path.
   * @return {!String|RegExp|Function}
   */
  senna.Route.prototype.getPath = function() {
    return this.path;
  };

  /**
   * Matches if the router can handle the tested path, if not returns null.
   * @param {!String} value Path to test and may contains the querystring
   *     part.
   * @return {Boolean} Returns true if matches any route.
   */
  senna.Route.prototype.matchesPath = function(value) {
    var path = this.path;

    if (senna.isString(path)) {
      return value === path;
    }
    if (senna.isFunction(path)) {
      return path(value);
    }
    if (path instanceof RegExp) {
      return value.search(path) > -1;
    }
    return null;
  };

  /**
   * Sets the route handler.
   * @param {!Function} handler
   */
  senna.Route.prototype.setHandler = function(handler) {
    this.handler = handler;
  };

  /**
   * Sets the route path.
   * @param {!String|RegExp|Function} path
   */
  senna.Route.prototype.setPath = function(path) {
    this.path = path;
  };
}());
