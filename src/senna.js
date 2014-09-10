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
