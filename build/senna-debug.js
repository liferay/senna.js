/**
 * Senna - A blazing-fast Single Page Application engine
 * @author Eduardo Lundgren <edu@rdo.io>
 * @version v0.2.1
 * @link http://sennajs.com
 * @license BSD
 */
(function(window, undefined) {
  'use strict';

  window.senna = window.senna || {};

  /**
   * Appends a node with text or other nodes.
   * @param {!Node} parent The node to append nodes to.
   * @param {!Node|String} child The thing to append to the parent.
   */
  senna.append = function(parent, child) {
    if (senna.isString(child)) {
      child = senna.buildFragment(child);
    }
    return parent.appendChild(senna.parseScripts(child));
  };

  /**
   * Creates a new function that, when called, has its this keyword set to the
   * provided value, with a given sequence of arguments preceding any provided
   * when the new function is called.
   *
   * Usage: <pre>var fn = bind(myFunction, myObj, 'arg1', 'arg2');
   * fn('arg3', 'arg4');</pre>
   *
   * @param {function} fn A function to partially apply.
   * @param {!Object} context Specifies the object which this should point to
   *     when the function is run.
   * @param {...*} var_args Additional arguments that are partially applied to
   *     the function.
   * @return {!Function} A partially-applied form of the function bind() was
   *     invoked as a method of.
   */
  senna.bind = function(fn, context) {
    if (!fn) {
      throw new Error();
    }

    if (Function.prototype.bind) {
      var bind = fn.call.apply(fn.bind, arguments);
      return function() {
        return bind.apply(null, arguments);
      };
    }

    if (arguments.length > 2) {
      var args = Array.prototype.slice.call(arguments, 2);
      return function() {
        var newArgs = Array.prototype.slice.call(arguments);
        Array.prototype.unshift.apply(newArgs, args);
        return fn.apply(context, newArgs);
      };
    } else {
      return function() {
        return fn.apply(context, arguments);
      };
    }
  };

  /**
   * Helper for <code>buildFragment</code>.
   * @param {!Document} doc The document.
   * @param {string} htmlString The HTML string to convert.
   * @return {!Node} The resulting document fragment.
   * @private
   */
  senna.buildFragment = function(htmlString) {
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = '<br>' + htmlString;
    tempDiv.removeChild(tempDiv.firstChild);

    var fragment = document.createDocumentFragment();
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
    return fragment;
  };

  /**
   * Debounces function execution.
   * @param {Function} fn
   * @param {Number} delay
   * @return {Function}
   */
  senna.debounce = function(fn, delay, opt_context) {
    var id;
    return function() {
      if (!opt_context) {
        opt_context = this;
      }
      var args = arguments;
      clearTimeout(id);
      id = setTimeout(function() {
        fn.apply(opt_context, args);
      }, delay);
    };
  };

  /**
   * Returns an object based on its fully qualified external name.
   * @param {String} name The fully qualified name.
   * @param {Object=} opt_obj The object within which to look; default is
   *     <code>window</code>.
   * @return {?} The value (object or primitive) or, if not found, null.
   */
  senna.getObjectByName = function(name, opt_obj) {
    var parts = name.split('.');
    var cur = opt_obj || window;
    var part;
    while ((part = parts.shift())) {
      if (senna.isDefAndNotNull(cur[part])) {
        cur = cur[part];
      } else {
        return null;
      }
    }
    return cur;
  };

  /**
   * Evaluates script globally.
   * @param {String} data
   */
  senna.globalEval = function(data) {
    /* jshint evil: true */
    if (data && data.trim()) {
      var evaluator = window.execScript;
      if (!evaluator) {
        evaluator = function(data) {
          window['eval'].call(window, data);
        };
      }
      evaluator(data);
    }
  };

  /**
   * Inherits the prototype methods from one constructor into another.
   *
   * Usage:
   * <pre>
   * function ParentClass(a, b) { }
   * ParentClass.prototype.foo = function(a) { }
   *
   * function ChildClass(a, b, c) {
   *   tracking.base(this, a, b);
   * }
   * tracking.inherits(ChildClass, ParentClass);
   *
   * var child = new ChildClass('a', 'b', 'c');
   * child.foo();
   * </pre>
   *
   * @param {Function} childCtor Child class.
   * @param {Function} parentCtor Parent class.
   */
  senna.inherits = function(childCtor, parentCtor) {
    function TempCtor() {
    }
    TempCtor.prototype = parentCtor.prototype;
    childCtor.superClass_ = parentCtor.prototype;
    childCtor.prototype = new TempCtor();
    childCtor.prototype.constructor = childCtor;

    /**
     * Calls superclass constructor/method.
     *
     * This function is only available if you use tracking.inherits to express
     * inheritance relationships between classes.
     *
     * @param {!object} me Should always be "this".
     * @param {string} methodName The method name to call. Calling superclass
     *     constructor can be done with the special string 'constructor'.
     * @param {...*} var_args The arguments to pass to superclass
     *     method/constructor.
     * @return {*} The return value of the superclass method/constructor.
     */
    childCtor.base = function(me, methodName) {
      var args = Array.prototype.slice.call(arguments, 2);
      return parentCtor.prototype[methodName].apply(me, args);
    };
  };

  /**
   * Returns true if the specified value is not undefined.
   * @param {?} val Variable to test.
   * @return {boolean} Whether variable is defined.
   */
  senna.isDef = function(val) {
    return val !== undefined;
  };

  /**
   * Returns true if value is not undefined or null.
   * @param {*} val
   * @return {Boolean}
   */
  senna.isDefAndNotNull = function(val) {
    return senna.isDef(val) && !senna.isNull(val);
  };

  /**
   * Returns true if value is a dom element.
   * @param {*} val
   * @return {Boolean}
   */
  senna.isElement = function(val) {
    return typeof val === 'object' && val.nodeType === 1;
  };

  /**
   * Returns true if the specified value is a function.
   * @param {?} val Variable to test.
   * @return {boolean} Whether variable is a function.
   */
  senna.isFunction = function(val) {
    return typeof (val) === 'function';
  };

  /**
   * Returns true if value is null.
   * @param {*} val
   * @return {Boolean}
   */
  senna.isNull = function(val) {
    return val === null;
  };

  /**
   * Returns true if the specified value is an object. This includes arrays
   * and functions.
   * @param {?} val Variable to test.
   * @return {boolean} Whether variable is an object.
   */
  senna.isObject = function(val) {
    var type = typeof val;
    return type === 'object' && val !== null || type === 'function';
  };

  /**
   * Returns true if value is a string.
   * @param {*} val
   * @return {Boolean}
   */
  senna.isString = function(val) {
    return typeof val === 'string';
  };

  /**
   * Check if an element matches a given selector.
   * @param {Event} element
   * @param {String} selector
   * @return {Boolean}
   */
  senna.match = function(element, selector) {
    if (!element || element.nodeType !== 1) {
      return false;
    }

    var p = Element.prototype;
    var m = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector;
    if (m) {
      return m.call(element, selector);
    }

    var nodes = document.querySelectorAll(selector, element.parentNode);
    for (var i = 0; i < nodes.length; ++i) {
      if (nodes[i] === element) {
        return true;
      }
    }
    return false;
  };

  /**
   * Parses script nodes inside a fragment and sterilizes them setting their types to text/parsed.
   * @param {!Element} frag
   * @return {Element}
   */
  senna.parseScripts = function(frag) {
    var globalEval = function(o) {
      senna.globalEval(o.responseText || o.text || o.textContent || o.innerHTML || '');
    };
    var scripts = Array.prototype.slice.call(frag.querySelectorAll('script'));
    while (scripts.length) {
      var script = scripts.shift();

      // Some browsers evaluates scripts when appended to document. Sterilizes
      // evaluated scripts setting type to text/parsed.
      script.setAttribute('type', 'text/parsed');

      if (script.src) {
        var headers = {
          'Content-Type': 'text/javascript'
        };
        senna.request(script.src, 'GET', headers, null, true).then(globalEval);
      } else {
        senna.async.nextTick(senna.bind(globalEval, null, script));
      }
    }
    return frag;
  };

  /**
   * Removes element from the dom.
   * @param {Element} element
   */
  senna.remove = function(element) {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  };

  /**
   * Requests the url using XMLHttpRequest.
   * @param {!String} url
   * @param {!String} httpMethod
   * @param {Object=} opt_httpHeaders
   * @param {Number=} opt_timeout
   * @param {Boolean=} opt_sync
   * @return {Promise} Promisified ajax request.
   */
  senna.request = function(url, httpMethod, opt_httpHeaders, opt_timeout, opt_sync) {
    var xhr = new XMLHttpRequest();

    var promise = new senna.Promise(function(resolve, reject) {
      xhr.onload = function() {
        if (xhr.status === 200) {
          resolve(xhr);
          return;
        }
        xhr.onerror();
      };
      xhr.onerror = function() {
        var error = new Error('Request error');
        error.xhr = xhr;
        reject(error);
      };
    }).thenCatch(function(reason) {
      throw reason;
    }).thenAlways(function() {
      clearTimeout(timeout);
    });

    xhr.open(httpMethod, url, !opt_sync);
    if (opt_httpHeaders) {
      for (var i in opt_httpHeaders) {
        xhr.setRequestHeader(i, opt_httpHeaders[i]);
      }
    }
    xhr.send(null);

    if (senna.isDef(opt_timeout)) {
      var timeout = setTimeout(function() {
        promise.cancel('Request timeout');
      }, opt_timeout);
    }

    return promise;
  };

  document.addEventListener('DOMContentLoaded', function() {
    /**
     * Data attribute handler.
     * @type {senna.DataAttributeHandler}
     * @default new senna.DataAttributeHandler(document.body)
     */
    senna.dataAttributeHandler = new senna.DataAttributeHandler(document.body);
  });
}(window));

(function() {
  'use strict';

  /**
   * EventEmitter utility.
   * @constructor
   */
  senna.EventEmitter = function() {};

  /**
   * Holds event listeners scoped by event type.
   * @type {Object}
   * @private
   */
  senna.EventEmitter.prototype.events_ = null;

  /**
   * Adds a listener to the end of the listeners array for the specified event.
   * @param {String} event
   * @param {Function} listener
   * @return {Object} Returns emitter, so calls can be chained.
   */
  senna.EventEmitter.prototype.addListener = function(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    if (!this.events_) {
      this.events_ = {};
    }

    this.emit('newListener', event, listener);

    if (!this.events_[event]) {
      this.events_[event] = [];
    }

    this.events_[event].push(listener);

    return this;
  };

  /**
   * Removes all event handlers when destroyed.
   * TODO(eduardo)
   */
  senna.EventEmitter.prototype.destroy = function() {};

  /**
   * Returns an array of listeners for the specified event.
   * @param {String} event
   * @return {Array} Array of listeners.
   */
  senna.EventEmitter.prototype.listeners = function(event) {
    return this.events_ && this.events_[event];
  };

  /**
   * Execute each of the listeners in order with the supplied arguments.
   * @param {String} event
   * @param {*} opt_args [arg1], [arg2], [...]
   * @return {Boolean} Returns true if event had listeners, false otherwise.
   */
  senna.EventEmitter.prototype.emit = function(event) {
    var listeners = this.listeners(event);
    if (listeners) {
      var args = Array.prototype.slice.call(arguments, 1);
      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i]) {
          listeners[i].apply(this, args);
        }
      }
      return true;
    }
    return false;
  };

  /**
   * Adds a listener to the end of the listeners array for the specified event.
   * @param {String} event
   * @param {Function} listener
   * @return {Object} Returns emitter, so calls can be chained.
   */
  senna.EventEmitter.prototype.on = senna.EventEmitter.prototype.addListener;

  /**
   * Adds a one time listener for the event. This listener is invoked only the
   * next time the event is fired, after which it is removed.
   * @param {String} event
   * @param {Function} listener
   * @return {Object} Returns emitter, so calls can be chained.
   */
  senna.EventEmitter.prototype.once = function(event, listener) {
    var self = this;
    self.on(event, function handlerInternal() {
      self.removeListener(event, handlerInternal);
      listener.apply(this, arguments);
    });
  };

  /**
   * Removes all listeners, or those of the specified event. It's not a good
   * idea to remove listeners that were added elsewhere in the code,
   * especially when it's on an emitter that you didn't create.
   * @param {String} event
   * @return {Object} Returns emitter, so calls can be chained.
   */
  senna.EventEmitter.prototype.removeAllListeners = function(opt_event) {
    if (!this.events_) {
      return this;
    }
    if (opt_event) {
      delete this.events_[opt_event];
    } else {
      delete this.events_;
    }
    return this;
  };

  /**
   * Remove a listener from the listener array for the specified event.
   * Caution: changes array indices in the listener array behind the listener.
   * @param {String} event
   * @param {Function} listener
   * @return {Object} Returns emitter, so calls can be chained.
   */
  senna.EventEmitter.prototype.removeListener = function(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    if (!this.events_) {
      return this;
    }

    var listeners = this.listeners(event);
    if (Array.isArray(listeners)) {
      var i = listeners.indexOf(listener);
      if (i < 0) {
        return this;
      }
      listeners.splice(i, 1);
    }

    return this;
  };

  /**
   * By default EventEmitters will print a warning if more than 10 listeners
   * are added for a particular event. This is a useful default which helps
   * finding memory leaks. Obviously not all Emitters should be limited to 10.
   * This function allows that to be increased. Set to zero for unlimited.
   * @param {Number} n The maximum number of listeners.
   */
  senna.EventEmitter.prototype.setMaxListeners = function() {
    throw new Error('Not implemented');
  };

}());

(function() {
  'use strict';

  /**
   * Abstract class for cacheable classes.
   * @constructor
   */
  senna.Cacheable = function() {};

  /**
   * Holds the cached data.
   * @type {!Object}
   * @default null
   * @protected
   */
  senna.Cacheable.prototype.cache = null;

  /**
   * Holds whether class is cacheable.
   * @type {boolean}
   * @default false
   * @protected
   */
  senna.Cacheable.prototype.cacheable = false;

  /**
   * Adds content to the cache.
   * @param {String} content Content to be cached.
   * @chainable
   */
  senna.Cacheable.prototype.addCache = function(content) {
    if (this.cacheable) {
      this.cache = content;
    } else {
      console.log('[' + this + '] is not cacheable');
    }
    return this;
  };

  /**
   * Clears the cache.
   * @chainable
   */
  senna.Cacheable.prototype.clearCache = function() {
    this.cache = null;
    return this;
  };

  /**
   * Destructor logic for the cacheable class. Clears the cache when
   * destroyed. Make sure to invoke
   * <code>MyCacheableClass.base(this, 'destroy');</code> from implementers
   * destroy.
   */
  senna.Cacheable.prototype.destroy = function() {
    this.clearCache();
  };

  /**
   * Gets the cached content.
   * @return {Object} Cached content.
   * @protected
   */
  senna.Cacheable.prototype.getCache = function() {
    return this.cache;
  };

  /**
   * Whether the class is cacheable.
   * @return {Boolean} Returns true when class is cacheable, false otherwise.
   */
  senna.Cacheable.prototype.isCacheable = function() {
    return this.cacheable;
  };

  /**
   * Sets whether the class is cacheable.
   * @param {Boolean} cacheable
   */
  senna.Cacheable.prototype.setCacheable = function(cacheable) {
    if (!cacheable) {
      this.clearCache();
    }
    this.cacheable = cacheable;
  };
}());

(function() {
  'use strict';

  /**
   * Initilizes senna.App, register surfaces and routes from data attributes.
   * @constructor
   */
  senna.DataAttributeHandler = function(baseElement) {
    if (!senna.isElement(baseElement)) {
      throw new Error('Base element not specified.');
    }
    this.setBaseElement(baseElement);
    this.initApp_();
  };

  /**
   * Holds app reference.
   * @type {senna.App}
   */
  senna.DataAttributeHandler.prototype.app = null;

  /**
   * Holds the base element to search initialization data attributes.
   * @type {Element}
   * @default null
   */
  senna.DataAttributeHandler.prototype.baseElement = null;

  /**
   * Gets app reference.
   * @return {senna.App}
   */
  senna.DataAttributeHandler.prototype.getApp = function() {
    return this.app;
  };

  /**
   * Gets base element.
   * @return {Element}
   */
  senna.DataAttributeHandler.prototype.getBaseElement = function() {
    return this.baseElement;
  };

  /**
   * Initializes app.
   * @protected
   */
  senna.DataAttributeHandler.prototype.initApp_ = function() {
    var baseElement = this.baseElement;
    if (!baseElement.hasAttribute('data-senna')) {
      console.log('Senna not initialized from data attribute, try passing <body data-senna>.');
      return;
    }

    console.log('Senna initialized from data attribute.');
    this.app = new senna.App();

    var basePath = baseElement.getAttribute('data-senna-basepath');
    if (!senna.isNull(basePath)) {
      this.app.setBasePath(basePath);
      console.log('Senna scanned basepath ' + basePath);
    }
    var linkSelector = baseElement.getAttribute('data-senna-link-selector');
    if (!senna.isNull(linkSelector)) {
      this.app.setLinkSelector(linkSelector);
      console.log('Senna scanned link selector ' + linkSelector);
    }
    this.scanSurfaces();
    this.scanRoutes();
  };

  /**
   * Makes default route in case of not found any.
   * @return {Element}
   */
  senna.DataAttributeHandler.prototype.makeDefaultRoute_ = function() {
    var link = document.createElement('link');
    link.href = 'regex:.*';
    link.rel = 'senna-route';
    link.type = 'senna.HtmlScreen';
    return link;
  };

  /**
   * Scans routes from link elements.
   */
  senna.DataAttributeHandler.prototype.scanRoutes = function() {
    var routes = document.querySelectorAll('link[rel="senna-route"]');
    if (routes.length === 0) {
      console.log('Senna can\'t find a route element, adding default.');
      routes = [this.makeDefaultRoute_()];
    }

    for (var i = 0; i < routes.length; i++) {
      var route = routes[i];
      if (route.hasAttribute('senna-parsed')) {
        continue;
      }

      var path = route.getAttribute('href');
      var handler = route.getAttribute('type');

      if (senna.isDefAndNotNull(path) && senna.isDefAndNotNull(handler)) {
        if (path.indexOf('regex:') === 0) {
          path = new RegExp(path.substring(6));
        }
        this.app.addRoutes(new senna.Route(path, senna.getObjectByName(handler)));
        route.setAttribute('data-parsed', '');
        console.log('Senna scanned route ' + path);
      }
    }
  };

  /**
   * Scans surfaces with data attribute.
   */
  senna.DataAttributeHandler.prototype.scanSurfaces = function() {
    var surfaces = this.baseElement.querySelectorAll('[data-senna-surface]');
    for (var i = 0; i < surfaces.length; i++) {

      var surfaceId = surfaces[i].id;

      if (surfaceId && !this.app.surfaces[surfaceId]) {
        this.app.addSurfaces(surfaceId);
        console.log('Senna scanned surface ' + surfaceId);
      }
    }
  };

  /**
   * Sets the app.
   * @param {senna.App} app
   */
  senna.DataAttributeHandler.prototype.setApp = function(app) {
    this.app = app;
  };

  /**
   * Sets the base element.
   * @param {Element} baseElement
   */
  senna.DataAttributeHandler.prototype.setBaseElement = function(baseElement) {
    this.baseElement = baseElement;
  };
}());

(function(window) {
  'use strict';

  /**
   * App class that handle routes and screens lifecycle.
   * @constructor
   * @extends {senna.EventEmitter}
   */
  senna.App = function() {
    senna.App.base(this, 'constructor');

    this.routes = [];
    this.surfaces = {};
    this.screens = {};

    this.docClickEventHandler_ = senna.bind(this.onDocClick_, this);
    this.loadEventHandler_ = senna.bind(this.onLoad_, this);
    this.popstateEventHandler_ = senna.bind(this.onPopstate_, this);
    this.scrollEventHandler_ = senna.debounce(this.onScroll_, 50, this);

    this.on('startNavigate', this.onStartNavigate_);
    document.addEventListener('click', this.docClickEventHandler_, false);
    window.addEventListener('load', this.loadEventHandler_, false);
    window.addEventListener('popstate', this.popstateEventHandler_, false);
    document.addEventListener('scroll', this.scrollEventHandler_, false);
  };
  senna.inherits(senna.App, senna.EventEmitter);

  /**
   * Holds the active screen.
   * @type {?Screen}
   * @protected
   */
  senna.App.prototype.activeScreen = null;

  /**
   * Holds the active path containing the query parameters.
   * @type {?String}
   * @protected
   */
  senna.App.prototype.activePath = null;

  /**
   * Holds link base path.
   * @type {!String}
   * @default ''
   * @protected
   */
  senna.App.prototype.basePath = '';

  /**
   * Captures scroll position and saves on history state.
   * @type {!Boolean}
   * @default true
   * @protected
   */
  senna.App.prototype.captureHistoryScrollPosition = true;

  /**
   * Holds the default page title.
   * @type {String}
   * @default null
   * @protected
   */
  senna.App.prototype.defaultTitle = '';

  /**
   * Holds the link selector to define links that are routed.
   * @type {!String}
   * @default a
   * @protected
   */
  senna.App.prototype.linkSelector = 'a';

  /**
   * Holds the loading css class.
   * @type {!String}
   * @default senna-loading
   * @protected
   */
  senna.App.prototype.loadingCssClass = 'senna-loading';

  /**
   * Holds the window horizontal scroll position when the navigation using
   * back or forward happens to be restored after the surfaces are updated.
   * @type {!Number}
   * @default 0
   * @protected
   */
  senna.App.prototype.syncScrollLeft = 0;

  /**
   * Holds the window vertical scroll position when the navigation using
   * back or forward happens to be restored after the surfaces are updated.
   * @type {!Number}
   * @default 0
   * @protected
   */
  senna.App.prototype.syncScrollTop = 0;

  /**
   * Holds a deferred withe the current navigation.
   * @type {?Promise}
   * @default null
   * @protected
   */
  senna.App.prototype.pendingNavigate = null;

  /**
   * Holds the screen routes configuration.
   * @type {?Array}
   * @default null
   * @protected
   */
  senna.App.prototype.routes = null;

  /**
   * Maps the screen instances by the url containing the parameters.
   * @type {?Object}
   * @default null
   * @protected
   */
  senna.App.prototype.screens = null;

  /**
   * Holds the scroll event handle.
   * @type {Object}
   * @default null
   * @protected
   */
  senna.App.prototype.scrollHandle = null;

  /**
   * When set to true the first erroneous popstate fired on page load will be
   * ignored, only if <code>window.history.state</code> is also
   * <code>null</code>.
   * @type {Boolean}
   * @default false
   * @protected
   */
  senna.App.prototype.skipLoadPopstate = false;

  /**
   * Maps that index the surfaces instances by the surface id.
   * @type {?Object}
   * @default null
   * @protected
   */
  senna.App.prototype.surfaces = null;

  /**
   * When set to true, moves the scroll position using the
   * <code>syncScrollLeft</code> and <code>syncScrollTop</code> values.
   * @type {!Boolean}
   * @default true
   * @protected
   */
  senna.App.prototype.updateScrollPosition = true;

  /**
   * Adds one or more screens to the application.
   *
   * Example:
   *
   * <code>
   *   app.addRoutes({ path: '/foo', handler: FooScreen });
   *   or
   *   app.addRoutes([{ path: '/foo', handler: function(route) { return new FooScreen(); } }]);
   * </code>
   *
   * @param {Object} or {Array} routes Single object or an array of object.
   *     Each object should contain <code>path</code> and <code>screen</code>.
   *     The <code>path</code> should be a string or a regex that maps the
   *     navigation route to a screen class definition (not an instance), e.g:
   *         <code>{ path: "/home:param1", handler: MyScreen }</code>
   *         <code>{ path: /foo.+/, handler: MyScreen }</code>
   * @chainable
   */
  senna.App.prototype.addRoutes = function(routes) {
    if (!Array.isArray(routes)) {
      routes = [routes];
    }
    for (var i = 0; i < routes.length; i++) {
      var route = routes[i];
      if (!(route instanceof senna.Route)) {
        route = new senna.Route(route.path, route.handler);
      }
      this.routes.push(route);
    }
    return this;
  };

  /**
   * Adds one or more surfaces to the application.
   * @param {senna.Surface|String|Array.<senna.Surface|senna.String>} surfaces
   *     Surface element id or surface instance. You can also pass an Array
   *     whichcontains surface instances or id. In case of ID, these should be
   *     the id of surface element.
   * @chainable
   */
  senna.App.prototype.addSurfaces = function(surfaces) {
    if (!Array.isArray(surfaces)) {
      surfaces = [surfaces];
    }
    for (var i = 0; i < surfaces.length; i++) {
      var surface = surfaces[i];
      if (senna.isString(surface)) {
        surface = new senna.Surface(surface);
      }
      this.surfaces[surface.getId()] = surface;
    }
    return this;
  };

  /**
   * Retrieves or create a screen instance to a path.
   * @param {!String} path Path containing the querystring part.
   * @return {senna.Screen}
   * @protected
   */
  senna.App.prototype.createScreenInstance_ = function(path, route) {
    var cachedScreen;
    if (path === this.activePath) {
      // When simulating page refresh the request lifecycle must be respected,
      // hence create a new screen instance for the same path.
      console.log('Already at destination, refresh navigation');
      cachedScreen = this.screens[path];
      delete this.screens[path];
    }
    /* jshint newcap: false */
    var screen = this.screens[path];
    if (!screen) {
      console.log('Create screen for [' + path + ']');
      var handler = route.getHandler();
      if (handler === senna.Screen || senna.Screen.isImplementedBy(handler.prototype)) {
        screen = new handler();
      } else {
        screen = handler(route) || new senna.Screen();
      }
      if (cachedScreen) {
        screen.addCache(cachedScreen.getCache());
      }
    }
    return screen;
  };

  /**
   * Destroys app instance and removes all event handlers. All surfaces will
   * be restored to its default content.
   * @chainable
   */
  senna.App.prototype.destroy = function() {
    senna.App.base(this, 'destroy');

    for (var surfaceId in this.surfaces) {
      this.surfaces[surfaceId].remove(this.activeScreen);
      this.surfaces[surfaceId].show();
    }
    window.removeEventListener('load', this.loadEventHandler_, false);
    window.removeEventListener('popstate', this.popstateEventHandler_, false);
    document.removeEventListener('click', this.docClickEventHandler_, false);
    document.removeEventListener('scroll', this.scrollEventHandler_, false);

    return this;
  };

  /**
   * Dispatches to the first route handler that matches the current path, if
   * any.
   * @return {Promise} Returns a pending request cancellable promise.
   */
  senna.App.prototype.dispatch = function() {
    return this.navigate(window.location.pathname + window.location.search + window.location.hash, true);
  };

  /**
   * Starts navigation to a path.
   * @param {!String} path Path containing the querystring part.
   * @param {Boolean=} opt_replaceHistory Replaces browser history.
   * @return {Promise} Returns a pending request cancellable promise.
   */
  senna.App.prototype.doNavigate_ = function(path, opt_replaceHistory) {
    var self = this;

    if (self.activeScreen && self.activeScreen.beforeDeactivate()) {
      this.pendingNavigate = senna.Promise.reject(new senna.Promise.CancellationError('Cancelled by active screen'));
      return this.pendingNavigate;
    }
    var route = this.findRoute(path);
    if (!route) {
      this.pendingNavigate = senna.Promise.reject(new senna.Promise.CancellationError('No route for ' + path));
      return this.pendingNavigate;
    }

    // When reloading the same path do replaceState instead of pushState to
    // avoid polluting history with states with the same path.
    if (path === this.activePath) {
      opt_replaceHistory = true;
    }

    console.log('Navigate to [' + path + ']');

    var nextScreen = this.createScreenInstance_(path, route);

    this.pendingNavigate = senna.Promise.resolve()
      .then(function() {
        return nextScreen.load(path);
      })
      .then(function(contents) {
        var screenId = nextScreen.getId();
        for (var surfaceId in self.surfaces) {
          var surface = self.surfaces[surfaceId];
          surface.addContent(screenId, nextScreen.getSurfaceContent(surfaceId, contents));
        }
        if (self.activeScreen) {
          self.activeScreen.deactivate();
        }

        return nextScreen.flip(self.surfaces);
      })
      .then(function() {
        self.finalizeNavigate_(path, nextScreen, opt_replaceHistory);
      })
      .thenCatch(function(reason) {
        self.handleNavigateError_(path, nextScreen, reason);
        throw reason;
      });

    return this.pendingNavigate;
  };

  /**
   * Finalizes a screen navigation.
   * @param {!String} path Path containing the querystring part.
   * @param {!Screen} nextScreen
   * @param {Boolean=} opt_replaceHistory Replaces browser history.
   * @protected
   */
  senna.App.prototype.finalizeNavigate_ = function(path, nextScreen, opt_replaceHistory) {
    var activeScreen = this.activeScreen;
    var title = nextScreen.getTitle() || this.getDefaultTitle();

    this.updateHistory_(title, path, opt_replaceHistory);

    this.syncScrollPosition_(opt_replaceHistory);

    document.title = title;

    nextScreen.activate();

    if (activeScreen && !activeScreen.isCacheable()) {
      this.removeScreen_(this.activePath, activeScreen);
    }

    this.activePath = path;
    this.activeScreen = nextScreen;
    this.screens[path] = nextScreen;
    this.pendingNavigate = null;
    this.captureHistoryScrollPosition = true;
    console.log('Navigation done');
  };

  /**
   * Finds a route for the test path. Returns true if matches has a route,
   * otherwise returns null.
   * @param {!String} path Path containing the querystring part.
   * @return {?Object} Route handler if match any or <code>null</code> if the
   *     path is the same as the current url and the path contains a fragment.
   */
  senna.App.prototype.findRoute = function(path) {
    var basePath = this.basePath;

    // Prevents navigation if it's a hash change on the same url.
    var hashIndex = path.lastIndexOf('#');
    if (hashIndex > -1) {
      path = path.substr(0, hashIndex);
      if (path === window.location.pathname + window.location.search) {
        return null;
      }
    }

    path = path.substr(basePath.length);

    for (var i = 0; i < this.routes.length; i++) {
      var route = this.routes[i];
      if (route.matchesPath(path)) {
        return route;
      }
    }
    return null;
  };

  /**
   * Gets link base path.
   * @return {!String}
   */
  senna.App.prototype.getBasePath = function() {
    return this.basePath;
  };

  /**
   * Gets the default page title.
   * @return {String} defaultTitle
   */
  senna.App.prototype.getDefaultTitle = function() {
    return this.defaultTitle;
  };

  /**
   * Gets the link selector.
   * @return {!String}
   */
  senna.App.prototype.getLinkSelector = function() {
    return this.linkSelector;
  };

  /**
   * Gets the loading css class.
   * @return {!String}
   */
  senna.App.prototype.getLoadingCssClass = function() {
    return this.loadingCssClass;
  };

  /**
   * Gets the update scroll position value.
   * @return {String}
   */
  senna.App.prototype.getUpdateScrollPosition = function() {
    return this.updateScrollPosition;
  };

  /**
   * Handle navigation error.
   * @param {!String} path Path containing the querystring part.
   * @param {!Screen} nextScreen
   * @param {!Error} error
   * @protected
   */
  senna.App.prototype.handleNavigateError_ = function(path, nextScreen, err) {
    console.log('Navigation error for [' + nextScreen + '] (' + err + ')');
    this.removeScreen_(path, nextScreen);
    this.pendingNavigate = null;
  };

  /**
   * Tests if hostname is an offsite link.
   * @param {!String} hostname Link hostname to compare with
   *     <code>window.location.hostname</code>.
   * @return {Boolean}
   * @protected
   */
  senna.App.prototype.isLinkSameOrigin_ = function(hostname) {
    return hostname === window.location.hostname;
  };

  /**
   * Tests if link element has the same app's base path.
   * @param {!String} path Link path containing the querystring part.
   * @return {Boolean}
   * @protected
   */
  senna.App.prototype.isSameBasePath_ = function(path) {
    return path.indexOf(this.basePath) === 0;
  };

  /**
   * Lock the document scroll in order to avoid the browser native back and
   * forward navigation to change the scroll position. Surface app takes care
   * of updating it when surfaces are ready.
   * @protected
   */
  senna.App.prototype.lockHistoryScrollPosition_ = function() {
    var state = window.history.state;
    if (!state) {
      return;
    }
    // Browsers are inconsistent when re-positioning the scroll history on
    // popstate. At some browsers, history scroll happens before popstate, then
    // lock the scroll on the last known position as soon as possible after the
    // current JS execution context and capture the current value. Some others,
    // history scroll happens after popstate, in this case, we bind an once
    // scroll event to lock the las known position. Lastly, the previous two
    // behaviors can happen even on the same browser, hence the race will decide
    // the winner.
    var winner = false;
    var switchScrollPositionRace = function() {
      document.removeEventListener('scroll', switchScrollPositionRace, false);
      if (!winner) {
        window.scrollTo(state.scrollLeft, state.scrollTop);
        winner = true;
      }
    };
    senna.async.nextTick(switchScrollPositionRace);
    document.addEventListener('scroll', switchScrollPositionRace, false);
  };

  /**
   * Navigates to the specified path if there is a route handler that matches.
   * @param {!String} path Path to navigate containing the base path.
   * @param {Boolean=} opt_replaceHistory Replaces browser history.
   * @return {Promise} Returns a pending request cancellable promise.
   */
  senna.App.prototype.navigate = function(path, opt_replaceHistory) {
    this.stopPending_();

    this.emit('startNavigate', {
      path: path,
      replaceHistory: !!opt_replaceHistory
    });
    return this.pendingNavigate;
  };

  /**
   * Intercepts document clicks and test link elements in order to decide
   * whether Surface app can navigate.
   * @param {!Event} event Event facade
   * @protected
   */
  senna.App.prototype.onDocClick_ = function(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      console.log('Navigate aborted, modifier key is pressed.');
      return;
    }

    var link = event.target;
    while (link && link.tagName !== 'A') {
      link = link.parentNode;
    }
    if (!link) {
      return;
    }
    if (!senna.match(link, this.linkSelector)) {
      console.log('Link not routed.');
      return;
    }

    var hostname = link.hostname;
    var path = link.pathname + link.search + link.hash;
    var navigateFailed = false;

    if (!this.isLinkSameOrigin_(hostname)) {
      console.log('Offsite link clicked');
      return;
    }
    if (!this.isSameBasePath_(path)) {
      console.log('Link clicked outside app\'s base path');
      return;
    }
    if (!this.findRoute(path)) {
      console.log('No route for ' + path);
      return;
    }

    this.navigate(path).thenCatch(function() {
      // Do not prevent link navigation in case some synchronous error occurs
      navigateFailed = true;
    });

    if (!navigateFailed) {
      event.preventDefault();
    }
  };

  /**
   * Listens to the window's load event in order to avoid issues with some browsers
   * that trigger popstate calls on the first load. For more information see
   * http://stackoverflow.com/questions/6421769/popstate-on-pages-load-in-chrome.
   * @protected
   */
  senna.App.prototype.onLoad_ = function() {
    var self = this;

    this.skipLoadPopstate = true;
    setTimeout(function() {
      // The timeout ensures that popstate events will be unblocked right
      // after the load event occured, but not in the same event-loop cycle.
      self.skipLoadPopstate = false;
    }, 0);
  };

  /**
   * Handles browser history changes and fires app's navigation if the state
   * belows to us. If we detect a popstate and the state is <code>null</code>,
   * assume it is navigating to an external page or to a page we don't have
   * route, then <code>window.location.reload()</code> is invoked in order to
   * reload the content to the current url.
   * @param {!Event} event Event facade
   * @protected
   */
  senna.App.prototype.onPopstate_ = function(event) {
    var state = event.state;

    if (state === null || state.isNullState) {
      if (this.skipLoadPopstate) {
        return;
      }

      if (!window.location.hash) {
        window.location.reload();
        return;
      }
    }

    if (state && state.senna) {
      console.log('History navigation to [' + state.path + ']');
      this.syncScrollTop = state.scrollTop;
      this.syncScrollLeft = state.scrollLeft;
      this.lockHistoryScrollPosition_();
      this.navigate(state.path, true);
    }
  };

  /**
   * Listens document scroll changes in order to capture the possible lock
   * scroll position for history scrolling.
   * @protected
   */
  senna.App.prototype.onScroll_ = function() {
    if (this.captureHistoryScrollPosition) {
      this.storeScrollPosition_(window.pageXOffset, window.pageYOffset);
    }
  };

  /**
   * Starts navigation to a path.
   * @param {!Event} event Event facade containing <code>path</code> and
   *     <code>replaceHistory</code>.
   * @protected
   */
  senna.App.prototype.onStartNavigate_ = function(event) {
    var self = this;
    var payload = {};

    this.captureHistoryScrollPosition = false;
    this.storeScrollPosition_(window.pageXOffset, window.pageYOffset);

    document.documentElement.classList.add(this.loadingCssClass);

    this.pendingNavigate = this.doNavigate_(event.path, event.replaceHistory)
      .thenCatch(function(err) {
        self.stopPending_();
        payload.error = err;
        throw err;
      })
      .thenAlways(function() {
        payload.path = event.path;
        self.emit('endNavigate', payload);
        document.documentElement.classList.remove(self.loadingCssClass);
      });
  };

  /**
   * Removes a screen.
   * @param {!String} path Path containing the querystring part.
   * @param {!Screen} screen
   * @protected
   */
  senna.App.prototype.removeScreen_ = function(path, screen) {
    var screenId = screen.getId();

    for (var i in this.surfaces) {
      this.surfaces[i].remove(screenId);
    }

    screen.destroy();
    delete this.screens[path];
  };

  /**
   * Sets link base path.
   * @param {!String} path
   */
  senna.App.prototype.setBasePath = function(basePath) {
    this.basePath = basePath;
  };

  /**
   * Sets the default page title.
   * @param {String} defaultTitle
   */
  senna.App.prototype.setDefaultTitle = function(defaultTitle) {
    this.defaultTitle = defaultTitle;
  };

  /**
   * Sets the link selector.
   * @param {!String} linkSelector
   */
  senna.App.prototype.setLinkSelector = function(linkSelector) {
    this.linkSelector = linkSelector;
  };

  /**
   * Sets the loading css class.
   * @param {!String} loadingCssClass
   */
  senna.App.prototype.setLoadingCssClass = function(loadingCssClass) {
    this.loadingCssClass = loadingCssClass;
  };

  /**
   * Sets the update scroll position value.
   * @param {!String} updateScrollPosition
   */
  senna.App.prototype.setUpdateScrollPosition = function(updateScrollPosition) {
    this.updateScrollPosition = updateScrollPosition;
  };

  /**
   * Cancels pending navigate with <code>Cancel pending navigation</code> error.
   * @protected
   */
  senna.App.prototype.stopPending_ = function() {
    if (this.pendingNavigate) {
      this.pendingNavigate.cancel('Cancel pending navigation');
      this.pendingNavigate = null;
    }
  };

  /**
   * Updates or replace browser history.
   * @param {!String} path Path containing the querystring part.
   * @param {?String} title Document title.
   * @param {Boolean=} opt_replaceHistory Replaces browser history.
   * @protected
   */
  senna.App.prototype.updateHistory_ = function(title, path, opt_replaceHistory) {
    var historyParams = {
      path: path,
      senna: true
    };

    if (opt_replaceHistory) {
      window.history.replaceState(historyParams, title, path);
    } else {
      window.history.pushState(historyParams, title, path);
    }
  };

  /**
   * Stores scroll position and saves on history state.
   * @param {!Number} scrollLeft
   * @param {!Number} scrollTop
   */
  senna.App.prototype.storeScrollPosition_ = function(scrollLeft, scrollTop) {
    var state = window.history.state || {};
    if (senna.isNull(window.history.state)) {
      state.isNullState = true;
    }
    state.scrollLeft = scrollLeft;
    state.scrollTop = scrollTop;
    window.history.replaceState(state, null, null);
  };

  /**
   * Sync document scroll position to the values captured when the default
   * back and forward navigation happened. The scroll position updates after
   * <code>beforeFlip</code> is called and before the surface transitions.
   * @param {Boolean=} opt_replaceHistory Replaces browser history.
   * @protected
   */
  senna.App.prototype.syncScrollPosition_ = function(opt_replaceHistory) {
    var scrollLeft = opt_replaceHistory ? this.syncScrollLeft : 0;
    var scrollTop = opt_replaceHistory ? this.syncScrollTop : 0;

    if (this.updateScrollPosition) {
      window.scrollTo(scrollLeft, scrollTop);
    }

    this.storeScrollPosition_(scrollLeft, scrollTop);
  };
}(window));

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
   * Gets the syrface transition function.
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
   * Sets the syrface transition function.
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

    if (from && from !== to) {
      senna.remove(from);
    }

    // Avoid repainting if the child is already in place or the element does
    // not exist
    var el = this.getEl();
    if (el && to && !to.parentNode) {
      senna.append(el, to);
    }

    var deferred = this.transition(from, to);
    this.activeChild = to;

    return deferred;
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

(function() {
  'use strict';

  /**
   * Screen class that perform a request and extracts surface contents from
   * the response content.
   * @constructor
   * @extends {senna.RequestScreen}
   */
  senna.HtmlScreen = function() {
    senna.HtmlScreen.base(this, 'constructor');
  };

  senna.inherits(senna.HtmlScreen, senna.RequestScreen);

  /**
   * Holds the title selector. Relevant to extract the <code><title></code>
   * element from request fragments to use as the screen title.
   * @type {!String}
   * @default title
   * @protected
   */
  senna.HtmlScreen.prototype.titleSelector = 'title';

  /**
   * @inheritDoc
   */
  senna.HtmlScreen.prototype.getSurfaceContent = function(surfaceId, contents) {
    var surface = contents.querySelector('#' + surfaceId);
    if (surface) {
      return surface.innerHTML;
    }
  };

  /**
   * Gets the title selector.
   * @return {!String}
   */
  senna.HtmlScreen.prototype.getTitleSelector = function() {
    return this.titleSelector;
  };

  /**
   * @inheritDoc
   */
  senna.HtmlScreen.prototype.load = function(path) {
    var self = this;
    var promise = senna.HtmlScreen.base(this, 'load', path);

    return promise.then(function(content) {
      return self.resolveContent(content);
    }).thenCatch(function(err) {
      self.abortRequest();
      throw err;
    });
  };

  /**
   * Resolves the screen content as fragment from the response.
   * @param {XMLHttpRequest} xhr
   * @return {?Element}
   */
  senna.HtmlScreen.prototype.resolveContent = function(content) {
    if (senna.isString(content)) {
      var div = document.createElement('div');
      div.innerHTML = content;
      content = div;
    }

    var title = content.querySelector(this.titleSelector);
    if (title) {
      this.setTitle(title.innerHTML.trim());
    }
    this.addCache(content);
    return content;
  };

  /**
   * Sets the title selector.
   * @param {!String} titleSelector
   */
  senna.HtmlScreen.prototype.setTitleSelector = function(titleSelector) {
    this.titleSelector = titleSelector;
  };

}());

/*!
 * Promises polyfill based on Google's Closure Library promises.
 *
 *      Copyright 2013 The Closure Library Authors. All Rights Reserved.
 *
 * NOTE(eduardo): Promise support is not ready on all supported browsers,
 * therefore senna.js is temporarily using Google's promises as polyfill. It
 * supports cancellable promises and has clean and fast implementation.
 */
!function(n){senna.Thenable=function(){},senna.Thenable.prototype.then=function(){},senna.Thenable.IMPLEMENTED_BY_PROP="$goog_Thenable",senna.Thenable.addImplementation=function(n){n.prototype.then=n.prototype.then,n.prototype.$goog_Thenable=!0},senna.Thenable.isImplementedBy=function(n){if(!n)return!1;try{return!!n.$goog_Thenable}catch(e){return!1}},senna.partial=function(n){var e=Array.prototype.slice.call(arguments,1);return function(){var t=e.slice();return t.push.apply(t,arguments),n.apply(this,t)}},senna.async={},senna.async.throwException=function(n){senna.async.nextTick(function(){throw n})},senna.async.run=function(n,e){senna.async.run.workQueueScheduled_||(senna.async.nextTick(senna.async.run.processWorkQueue),senna.async.run.workQueueScheduled_=!0),senna.async.run.workQueue_.push(new senna.async.run.WorkItem_(n,e))},senna.async.run.workQueueScheduled_=!1,senna.async.run.workQueue_=[],senna.async.run.processWorkQueue=function(){for(;senna.async.run.workQueue_.length;){var n=senna.async.run.workQueue_;senna.async.run.workQueue_=[];for(var e=0;e<n.length;e++){var t=n[e];try{t.fn.call(t.scope)}catch(a){senna.async.throwException(a)}}}senna.async.run.workQueueScheduled_=!1},senna.async.run.WorkItem_=function(n,e){this.fn=n,this.scope=e},senna.async.nextTick=function(e,t){var a=e;return t&&(a=senna.bind(e,t)),a=senna.async.nextTick.wrapCallback_(a),senna.isFunction(n.setImmediate)?void n.setImmediate(a):(senna.async.nextTick.setImmediate_||(senna.async.nextTick.setImmediate_=senna.async.nextTick.getSetImmediateEmulator_()),void senna.async.nextTick.setImmediate_(a))},senna.async.nextTick.setImmediate_=null,senna.async.nextTick.getSetImmediateEmulator_=function(){var e=n.MessageChannel;if("undefined"==typeof e&&"undefined"!=typeof n&&n.postMessage&&n.addEventListener&&(e=function(){var n=document.createElement("iframe");n.style.display="none",n.src="",document.documentElement.appendChild(n);var e=n.contentWindow,t=e.document;t.open(),t.write(""),t.close();var a="callImmediate"+Math.random(),s=e.location.protocol+"//"+e.location.host,i=senna.bind(function(n){(n.origin===s||n.data===a)&&this.port1.onmessage()},this);e.addEventListener("message",i,!1),this.port1={},this.port2={postMessage:function(){e.postMessage(a,s)}}}),"undefined"!=typeof e){var t=new e,a={},s=a;return t.port1.onmessage=function(){a=a.next;var n=a.cb;a.cb=null,n()},function(n){s.next={cb:n},s=s.next,t.port2.postMessage(0)}}return"undefined"!=typeof document&&"onreadystatechange"in document.createElement("script")?function(n){var e=document.createElement("script");e.onreadystatechange=function(){e.onreadystatechange=null,e.parentNode.removeChild(e),e=null,n(),n=null},document.documentElement.appendChild(e)}:function(n){setTimeout(n,0)}},senna.async.nextTick.wrapCallback_=function(n){return n},senna.Promise=function(n,e){this.state_=senna.Promise.State_.PENDING,this.result_=void 0,this.parent_=null,this.callbackEntries_=null,this.executing_=!1,senna.Promise.UNHANDLED_REJECTION_DELAY>0?this.unhandledRejectionId_=0:0===senna.Promise.UNHANDLED_REJECTION_DELAY&&(this.hadUnhandledRejection_=!1);try{var t=this;n.call(e,function(n){t.resolve_(senna.Promise.State_.FULFILLED,n)},function(n){t.resolve_(senna.Promise.State_.REJECTED,n)})}catch(a){this.resolve_(senna.Promise.State_.REJECTED,a)}},senna.Promise.UNHANDLED_REJECTION_DELAY=0,senna.Promise.State_={PENDING:0,BLOCKED:1,FULFILLED:2,REJECTED:3},senna.Promise.CallbackEntry_=null,senna.Promise.resolve=function(n){return new senna.Promise(function(e){e(n)})},senna.Promise.reject=function(n){return new senna.Promise(function(e,t){t(n)})},senna.Promise.race=function(n){return new senna.Promise(function(e,t){n.length||e(void 0);for(var a,s=0;a=n[s];s++)a.then(e,t)})},senna.Promise.all=function(n){return new senna.Promise(function(e,t){var a=n.length,s=[];if(!a)return void e(s);for(var i,o=function(n,t){a--,s[n]=t,0===a&&e(s)},r=function(n){t(n)},c=0;i=n[c];c++)i.then(senna.partial(o,c),r)})},senna.Promise.firstFulfilled=function(n){return new senna.Promise(function(e,t){var a=n.length,s=[];if(!a)return void e(void 0);for(var i,o=function(n){e(n)},r=function(n,e){a--,s[n]=e,0===a&&t(s)},c=0;i=n[c];c++)i.then(o,senna.partial(r,c))})},senna.Promise.prototype.then=function(n,e,t){return this.addChildPromise_(senna.isFunction(n)?n:null,senna.isFunction(e)?e:null,t)},senna.Thenable.addImplementation(senna.Promise),senna.Promise.prototype.thenAlways=function(n,e){var t=function(){try{n.call(e)}catch(t){senna.Promise.handleRejection_.call(null,t)}};return this.addCallbackEntry_({child:null,onRejected:t,onFulfilled:t}),this},senna.Promise.prototype.thenCatch=function(n,e){return this.addChildPromise_(null,n,e)},senna.Promise.prototype.cancel=function(n){this.state_===senna.Promise.State_.PENDING&&senna.async.run(function(){var e=new senna.Promise.CancellationError(n);this.cancelInternal_(e)},this)},senna.Promise.prototype.cancelInternal_=function(n){this.state_===senna.Promise.State_.PENDING&&(this.parent_?this.parent_.cancelChild_(this,n):this.resolve_(senna.Promise.State_.REJECTED,n))},senna.Promise.prototype.cancelChild_=function(n,e){if(this.callbackEntries_){for(var t,a=0,s=-1,i=0;t=this.callbackEntries_[i];i++){var o=t.child;if(o&&(a++,o===n&&(s=i),s>=0&&a>1))break}if(s>=0)if(this.state_===senna.Promise.State_.PENDING&&1===a)this.cancelInternal_(e);else{var r=this.callbackEntries_.splice(s,1)[0];this.executeCallback_(r,senna.Promise.State_.REJECTED,e)}}},senna.Promise.prototype.addCallbackEntry_=function(n){this.callbackEntries_&&this.callbackEntries_.length||this.state_!==senna.Promise.State_.FULFILLED&&this.state_!==senna.Promise.State_.REJECTED||this.scheduleCallbacks_(),this.callbackEntries_||(this.callbackEntries_=[]),this.callbackEntries_.push(n)},senna.Promise.prototype.addChildPromise_=function(n,e,t){var a={child:null,onFulfilled:null,onRejected:null};return a.child=new senna.Promise(function(s,i){a.onFulfilled=n?function(e){try{var a=n.call(t,e);s(a)}catch(o){i(o)}}:s,a.onRejected=e?function(n){try{var a=e.call(t,n);!senna.isDef(a)&&n instanceof senna.Promise.CancellationError?i(n):s(a)}catch(o){i(o)}}:i}),a.child.parent_=this,this.addCallbackEntry_(a),a.child},senna.Promise.prototype.unblockAndFulfill_=function(n){if(this.state_!==senna.Promise.State_.BLOCKED)throw new Error("Promise is not blocked.");this.state_=senna.Promise.State_.PENDING,this.resolve_(senna.Promise.State_.FULFILLED,n)},senna.Promise.prototype.unblockAndReject_=function(n){if(this.state_!==senna.Promise.State_.BLOCKED)throw new Error("Promise is not blocked.");this.state_=senna.Promise.State_.PENDING,this.resolve_(senna.Promise.State_.REJECTED,n)},senna.Promise.prototype.resolve_=function(n,e){if(this.state_===senna.Promise.State_.PENDING){if(this===e)n=senna.Promise.State_.REJECTED,e=new TypeError("Promise cannot resolve to itself");else{if(senna.Thenable.isImplementedBy(e))return e=e,this.state_=senna.Promise.State_.BLOCKED,void e.then(this.unblockAndFulfill_,this.unblockAndReject_,this);if(senna.isObject(e))try{var t=e.then;if(senna.isFunction(t))return void this.tryThen_(e,t)}catch(a){n=senna.Promise.State_.REJECTED,e=a}}this.result_=e,this.state_=n,this.scheduleCallbacks_(),n!==senna.Promise.State_.REJECTED||e instanceof senna.Promise.CancellationError||senna.Promise.addUnhandledRejection_(this,e)}},senna.Promise.prototype.tryThen_=function(n,e){this.state_=senna.Promise.State_.BLOCKED;var t=this,a=!1,s=function(n){a||(a=!0,t.unblockAndFulfill_(n))},i=function(n){a||(a=!0,t.unblockAndReject_(n))};try{e.call(n,s,i)}catch(o){i(o)}},senna.Promise.prototype.scheduleCallbacks_=function(){this.executing_||(this.executing_=!0,senna.async.run(this.executeCallbacks_,this))},senna.Promise.prototype.executeCallbacks_=function(){for(;this.callbackEntries_&&this.callbackEntries_.length;){var n=this.callbackEntries_;this.callbackEntries_=[];for(var e=0;e<n.length;e++)this.executeCallback_(n[e],this.state_,this.result_)}this.executing_=!1},senna.Promise.prototype.executeCallback_=function(n,e,t){e===senna.Promise.State_.FULFILLED?n.onFulfilled(t):(this.removeUnhandledRejection_(),n.onRejected(t))},senna.Promise.prototype.removeUnhandledRejection_=function(){var n;if(senna.Promise.UNHANDLED_REJECTION_DELAY>0)for(n=this;n&&n.unhandledRejectionId_;n=n.parent_)clearTimeout(n.unhandledRejectionId_),n.unhandledRejectionId_=0;else if(0===senna.Promise.UNHANDLED_REJECTION_DELAY)for(n=this;n&&n.hadUnhandledRejection_;n=n.parent_)n.hadUnhandledRejection_=!1},senna.Promise.addUnhandledRejection_=function(n,e){senna.Promise.UNHANDLED_REJECTION_DELAY>0?n.unhandledRejectionId_=setTimeout(function(){senna.Promise.handleRejection_.call(null,e)},senna.Promise.UNHANDLED_REJECTION_DELAY):0===senna.Promise.UNHANDLED_REJECTION_DELAY&&(n.hadUnhandledRejection_=!0,senna.async.run(function(){n.hadUnhandledRejection_&&senna.Promise.handleRejection_.call(null,e)}))},senna.Promise.handleRejection_=senna.async.throwException,senna.Promise.setUnhandledRejectionHandler=function(n){senna.Promise.handleRejection_=n},senna.Promise.CancellationError=function(n){senna.Promise.CancellationError.base(this,"constructor",n),n&&(this.message=n)},senna.inherits(senna.Promise.CancellationError,Error),senna.Promise.CancellationError.prototype.name="cancel"}(window);
