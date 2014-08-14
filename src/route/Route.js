'use strict';

(function() {
  /**
   * Route class.
   * @param {String=} opt_path
   * @param {senna.Screen=} opt_screen
   * @constructor
   */
  senna.Route = function(opt_path, opt_screen) {
    this.setPath(opt_path);
    this.setScreen(opt_screen);
  };

  /**
   * Defines the path which will trigger the rendering of the screen,
   * specified in screen attribute. In case of <code>Function</code>, it will
   * receive the URL as parameter and it should return true if this URL could
   * be handled by the screen.
   * @type {!String|RegExp|Function}
   * @default null
   * @protected
   */
  senna.Route.prototype.path = null;

  /**
   * Defines the screen which will be rendered once a URL in the application
   * matches the path, specified in `path` attribute. Could be `senna.Screen`
   * or its extension, like `senna.HtmlScreen`.
   * @type {senna.Screen}
   * @default null
   * @protected
   */
  senna.Route.prototype.screen = null;

  /**
   * Gets the route screen.
   * @return {!senna.Screen}
   */
  senna.Route.prototype.getScreen = function() {
    return this.screen;
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
   * Sets the route path.
   * @param {!String|RegExp|Function} path
   */
  senna.Route.prototype.setPath = function(path) {
    this.path = path;
  };

  /**
   * Sets the route screen.
   * @param {!senna.Screen} screen
   */
  senna.Route.prototype.setScreen = function(screen) {
    this.screen = screen;
  };
}());
