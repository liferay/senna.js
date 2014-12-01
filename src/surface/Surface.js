(function() {
  'use strict';

  /**
   * Surface class representing the references to elements on the page that
   * can potentially be updated by <code>senna.App</code>.
   * @param {String} id
   * @constructor
   */
  senna.Surface = function(id) {
    if (!id) {
      throw new Error('Surface element id not specified.');
    }
    this.setId(id);
  };

  /**
   * Holds the default surface name. Elements on the page must contain a child
   * element containing the default content, this element must be as following:
   *
   * Example:
   * <code>
   *   <div id="mysurface">
   *     <div id="mysurface-default">Default surface content.</div>
   *   </div>
   * </code>
   *
   * The default content is relevant for the initial page content. When a
   * screen doesn't provide content for the surface the default content is
   * restored into the page.
   *
   * @type {!String}
   * @default default
   * @static
   */
  senna.Surface.DEFAULT = 'default';

  /**
   * Holds the default transition for all surfaces. Each surface could have its
   * own transition.
   *
   * Example:
   *
   * <code>
   * surface.setTransitionFn(function(from, to) {
   *   if (from) {
   *     from.style.display = 'none';
   *     from.classList.remove('flipped');
   *   }
   *   if (to) {
   *     to.style.display = 'block';
   *     to.classList.add('flipped');
   *   }
   *   return null;
   * });
   * </code>
   *
   * @param {?Element=} from The visible surface element.
   * @param {?Element=} to The surface element to be flipped.
   * @static
   */
  senna.Surface.TRANSITION = function(from, to) {
    if (from) {
      from.style.display = 'none';
      from.classList.remove('flipped');
    }
    if (to) {
      to.style.display = 'block';
      to.classList.add('flipped');
    }
  };
  /**
   * Holds the active child element.
   * @type {Element}
   * @default null
   * @protected
   */
  senna.Surface.prototype.activeChild = null;

  /**
   * Holds the default child element.
   * @type {Element}
   * @default null
   * @protected
   */
  senna.Surface.prototype.defaultChild = null;

  /**
   * Holds the element with the specified surface id, if not found creates a
   * new element with the specified id.
   * @type {Element}
   * @default null
   * @protected
   */
  senna.Surface.prototype.el = null;

  /**
   * Holds the surface id.
   * @type {String}
   * @default null
   * @protected
   */
  senna.Surface.prototype.id = null;

  /**
   * Holds the default transitionFn for the surfaces.
   * @param {?Element=} from The visible surface element.
   * @param {?Element=} to The surface element to be flipped.
   * @default senna.Surface.TRANSITION
   */
  senna.Surface.prototype.transitionFn = null;

  /**
   * Adds screen content to a surface. If content hasn't been passed, see if
   * an element exists in the DOM that matches the id. By convention, the
   * element should already be nested in the right element and should have an
   * id that is a concatentation of the surface id + '-' + the screen id.
   * @param {!String} screenId The screen id the content belongs too.
   * @param {?String|Element=} opt_content The string content or element to add
   *     be added as surface content.
   * @return {Element}
   */
  senna.Surface.prototype.addContent = function(screenId, opt_content) {
    if (!opt_content) {
      return this.getChild(screenId);
    }

    console.log('Screen [' + screenId + '] add content to surface [' + this + ']');

    var el = this.getEl();
    var child = this.createChild(screenId);

    senna.append(child, opt_content);

    this.transition(child, null);

    if (el) {
      senna.append(el, child);
    }

    return child;
  };

  /**
   * Creates child node for the surface.
   * @param {!String} screenId The screen id.
   * @return {Element}
   */
  senna.Surface.prototype.createChild = function(screenId) {
    var child = document.createElement('div');
    child.setAttribute('id', this.makeId_(screenId));
    return child;
  };

  /**
   * Gets the surface element from element, and sets it to the el property of
   * the current instance.
   * @param {!String} opt_id The id of the surface element. If not provided,
   *     <code>this.el</code> will be used.
   * @return {?Element} The current surface element.
   */
  senna.Surface.prototype.getEl = function(opt_id) {
    if (this.el) {
      return this.el;
    }
    this.el = document.getElementById(opt_id || this.id);
    return this.el;
  };

  /**
   * Gets the surface id.
   * @return {String}
   */
  senna.Surface.prototype.getId = function() {
    return this.id;
  };

  /**
   * Gets child node of the surface.
   * @param {!String} screenId The screen id.
   * @return {?Element}
   */
  senna.Surface.prototype.getChild = function(screenId) {
    return document.getElementById(this.makeId_(screenId));
  };

  /**
   * Gets the surface transition function.
   * See <code>senna.Surface.TRANSITION</code>.
   * @return {?Function=} The transition function.
   */
  senna.Surface.prototype.getTransitionFn = function() {
    return this.transitionFn;
  };

  /**
   * Makes the id for the element that holds content for a screen.
   * @param {!String} screenId The screen id the content belongs too.
   * @return {String}
   * @private
   */
  senna.Surface.prototype.makeId_ = function(screenId) {
    return this.id + '-' + screenId;
  };

  /**
   * Sets the surface id.
   * @param {!String} id
   */
  senna.Surface.prototype.setId = function(id) {
    this.id = id;
  };

  /**
   * Sets the surface transition function.
   * See <code>senna.Surface.TRANSITION</code>.
   * @param {?Function=} transitionFn The transition function.
   */
  senna.Surface.prototype.setTransitionFn = function(transitionFn) {
    this.transitionFn = transitionFn;
  };

  /**
   * Shows screen content from a surface.
   * @param {String} screenId The screen id to show.
   * @return {?Promise=} If returns a promise pauses the navigation until it is
   *     resolved.
   */
  senna.Surface.prototype.show = function(screenId) {
    if (!this.defaultChild) {
      this.defaultChild = this.addContent(senna.Surface.DEFAULT);
    }

    if (!this.activeChild) {
      this.activeChild = this.defaultChild;
    }

    var from = this.activeChild;
    var to = this.getChild(screenId);

    if (!to) {
      // When surface child for screen not found retrieve the default
      // content from DOM element with id `surfaceId-default`
      to = this.defaultChild;
    }

    // Avoid repainting if the child is already in place or the element does
    // not exist
    var el = this.getEl();
    if (el && to && !to.parentNode) {
      senna.append(el, to);
    }

    var deferred = this.transition(from, to);

    this.activeChild = to;

    return deferred.then(function() {
      if (from && from !== to) {
        senna.remove(from);
      }
    });
  };

  /**
   * Removes screen content from a surface.
   * @param {!String} screenId The screen id to remove.
   */
  senna.Surface.prototype.remove = function(screenId) {
    var child = this.getChild(screenId);
    if (child) {
      senna.remove(child);
    }
  };

  /**
   * @return {String}
   */
  senna.Surface.prototype.toString = function() {
    return this.id;
  };

  /**
   * Invokes the transition function specified on `transition` attribute.
   * @param {?Element=} from
   * @param {?Element=} to
   * @return {?Promise=} This can return a promise, which will pause the
   *     navigation until it is resolved.
   */
  senna.Surface.prototype.transition = function(from, to) {
    var transitionFn = this.transitionFn || senna.Surface.TRANSITION;
    return senna.Promise.resolve(transitionFn.call(this, from, to));
  };
}());
