(function() {
  'use strict';

  /**
   * Screen class is a special type of route handler that provides helper
   * utilities that adds lifecycle and methods to provide content to each
   * registered surface.
   * @constructor
   * @extends {senna.Cacheable}
   */
  senna.Screen = function() {
    senna.Screen.base(this, 'constructor');
    this.setId(senna.Screen.uniqueIdCounter++);
  };
  senna.inherits(senna.Screen, senna.Cacheable);

  /**
   * @param {*} object
   * @return {boolean} Whether a given instance implements
   * <code>senna.Screen</code>.
   */
  senna.Screen.isImplementedBy = function(object) {
    return object instanceof senna.Screen;
  };

  /**
   * Holds a unique id counter for random screen names.
   * @type {Number}
   * @protected
   */
  senna.Screen.uniqueIdCounter = +new Date();

  /**
   * Holds the screen id.
   * @type {String}
   * @default null
   * @protected
   */
  senna.Screen.prototype.id = null;

  /**
   * Holds the screen title. Relevant when the page title should be upadated
   * when screen is rendered.
   * @type {?String=}
   * @default null
   * @protected
   */
  senna.Screen.prototype.title = null;

  /**
   * Fires when the screen is active. Allows a screen to perform any setup
   * that requires its DOM to be visible. Lifecycle.
   */
  senna.Screen.prototype.activate = function() {
    console.log('Screen [' + this + '] activate');
  };

  /**
   * Gives the Screen a chance to cancel the navigation and stop itself from
   * being deactivated. Can be used, for example, if the screen has unsaved
   * state. Lifecycle. Clean-up should not be preformed here, since the
   * navigation may still be cancelled. Do clean-up in deactivate.
   * @return {Boolean=} If returns true, the current screen is locked and the
   *     next navation interrupted.
   */
  senna.Screen.prototype.beforeDeactivate = function() {
    console.log('Screen [' + this + '] beforeDeactivate');
  };

  /**
   * Allows a screen to perform any setup immediately before the element is
   * made visible. Lifecycle.
   * @return {?Promise=} This can return a promise, which will pause the
   *     navigation until it is resolved.
   */
  senna.Screen.prototype.flip = function(surfaces) {
    console.log('Screen [' + this + '] flip');

    var transitions = [];
    for (var surfaceId in surfaces) {
      transitions.push(surfaces[surfaceId].show(this.id));
    }

    return senna.Promise.all(transitions);
  };

  /**
   * Allows a screen to do any cleanup necessary after it has been
   * deactivated, for example cancelling outstanding XHRs or stopping
   * timers. Lifecycle.
   */
  senna.Screen.prototype.deactivate = function() {
    console.log('Screen [' + this + '] deactivate');
  };

  /**
   * Destroy a screen, either after it is deactivated (in the case of a
   * non-cacheable view) or when the App is itself disposed for whatever
   * reason. Lifecycle.
   */
  senna.Screen.prototype.destroy = function() {
    senna.Screen.base(this, 'destroy');
    console.log('Screen [' + this + '] destructor');
  };

  /**
   * Gets the screen id.
   * @return {String}
   */
  senna.Screen.prototype.getId = function() {
    return this.id;
  };

  /**
   * Returns the content for the given surface, or null if the surface isn't
   * used by this screen. This will be called when a screen is initially
   * constructed or, if a screen is non-cacheable, when navigated.
   * @param {!String} surfaceId The id of the surface DOM element.
   * @param {?String=} opt_contents Optional content fetch by
   *     <code>senna.Screen.load</code>.
   * @return {?String|Element=} This can return a string or node representing
   *     the content of the surface. If returns falsy values surface default
   *     content is restored.
   */
  senna.Screen.prototype.getSurfaceContent = function() {
    console.log('Screen [' + this + '] getSurfaceContent');
  };

  /**
   * Gets the screen title.
   * @return {?String=}
   */
  senna.Screen.prototype.getTitle = function() {
    return this.title;
  };

  /**
   * Returns all contents for the surfaces. This will pass the loaded content
   * to <code>senna.Screen.load</code> with all information you
   * need to fulfill the surfaces. Lifecycle.
   * @param {!String=} path The requested path.
   * @return {?String|Promise=} This can return a string representing the
   *     contents of the surfaces or a promise, which will pause the navigation
   *     until it is resolved. This is useful for loading async content.
   */
  senna.Screen.prototype.load = function() {
    console.log('Screen [' + this + '] load');
  };

  /**
   * Sets the screen id.
   * @param {!String} id
   */
  senna.Screen.prototype.setId = function(id) {
    this.id = 'screen_' + String(id);
  };

  /**
   * Sets the screen title.
   * @param {?String=} title
   */
  senna.Screen.prototype.setTitle = function(title) {
    this.title = title;
  };

  /**
   * @return {String}
   */
  senna.Screen.prototype.toString = function() {
    return this.id;
  };
}());
