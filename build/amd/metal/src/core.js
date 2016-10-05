define(['exports'], function (exports) {
  'use strict';

  /**
   * A collection of core utility functions.
   * @const
   */

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.abstractMethod = abstractMethod;
  exports.collectSuperClassesProperty = collectSuperClassesProperty;
  exports.disableCompatibilityMode = disableCompatibilityMode;
  exports.enableCompatibilityMode = enableCompatibilityMode;
  exports.getCompatibilityModeData = getCompatibilityModeData;
  exports.getFunctionName = getFunctionName;
  exports.getUid = getUid;
  exports.identityFunction = identityFunction;
  exports.isBoolean = isBoolean;
  exports.isDef = isDef;
  exports.isDefAndNotNull = isDefAndNotNull;
  exports.isDocument = isDocument;
  exports.isElement = isElement;
  exports.isFunction = isFunction;
  exports.isNull = isNull;
  exports.isNumber = isNumber;
  exports.isWindow = isWindow;
  exports.isObject = isObject;
  exports.isPromise = isPromise;
  exports.isString = isString;
  exports.mergeSuperClassesProperty = mergeSuperClassesProperty;
  exports.nullFunction = nullFunction;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var compatibilityModeData_ = void 0;

  /**
   * Counter for unique id.
   * @type {Number}
   * @private
   */
  var uniqueIdCounter_ = 1;

  /**
   * Unique id property prefix.
   * @type {String}
   * @protected
   */
  var UID_PROPERTY = exports.UID_PROPERTY = 'core_' + (Math.random() * 1e9 >>> 0);

  /**
   * When defining a class Foo with an abstract method bar(), you can do:
   * Foo.prototype.bar = abstractMethod
   *
   * Now if a subclass of Foo fails to override bar(), an error will be thrown
   * when bar() is invoked.
   *
   * @type {!Function}
   * @throws {Error} when invoked to indicate the method should be overridden.
   */
  function abstractMethod() {
    throw Error('Unimplemented abstract method');
  }

  /**
   * Loops constructor super classes collecting its properties values. If
   * property is not available on the super class `undefined` will be
   * collected as value for the class hierarchy position.
   * @param {!function()} constructor Class constructor.
   * @param {string} propertyName Property name to be collected.
   * @return {Array.<*>} Array of collected values.
   * TODO(*): Rethink superclass loop.
   */
  function collectSuperClassesProperty(constructor, propertyName) {
    var propertyValues = [constructor[propertyName]];
    while (constructor.__proto__ && !constructor.__proto__.isPrototypeOf(Function)) {
      constructor = constructor.__proto__;
      propertyValues.push(constructor[propertyName]);
    }
    return propertyValues;
  }

  /**
   * Disables Metal.js's compatibility mode.
   */
  function disableCompatibilityMode() {
    compatibilityModeData_ = null;
  }

  /**
   * Enables Metal.js's compatibility mode with the following features from rc
   * and 1.x versions:
   *     - Using "key" to reference component instances. In the current version
   *       this should be done via "ref" instead. This allows old code still
   *       using "key" to keep working like before. NOTE: this may cause
   *       problems, since "key" is meant to be used differently. Only use this
   *       if it's not possible to upgrade the code to use "ref" instead.
   * @param {Object=} opt_data Optional object with data to specify more
   *     details, such as:
   *         - renderers {Array} the template renderers that should be in
   *           compatibility mode, either their constructors or strings
   *           representing them (e.g. 'soy' or 'jsx'). By default, all the ones
   *           that extend from IncrementalDomRenderer.
   * @type {Object}
   */
  function enableCompatibilityMode() {
    var opt_data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    compatibilityModeData_ = opt_data;
  }

  /**
   * Returns the data used for compatibility mode, or nothing if it hasn't been
   * enabled.
   * @return {Object}
   */
  function getCompatibilityModeData() {
    // Compatibility mode can be set via the __METAL_COMPATIBILITY__ global var.
    if (!compatibilityModeData_) {
      if (typeof window !== 'undefined' && window.__METAL_COMPATIBILITY__) {
        enableCompatibilityMode(window.__METAL_COMPATIBILITY__);
      }
    }
    return compatibilityModeData_;
  }

  /**
   * Gets the name of the given function. If the current browser doesn't
   * support the `name` property, this will calculate it from the function's
   * content string.
   * @param {!function()} fn
   * @return {string}
   */
  function getFunctionName(fn) {
    if (!fn.name) {
      var str = fn.toString();
      fn.name = str.substring(9, str.indexOf('('));
    }
    return fn.name;
  }

  /**
   * Gets an unique id. If `opt_object` argument is passed, the object is
   * mutated with an unique id. Consecutive calls with the same object
   * reference won't mutate the object again, instead the current object uid
   * returns. See {@link UID_PROPERTY}.
   * @param {Object=} opt_object Optional object to be mutated with the uid. If
   *     not specified this method only returns the uid.
   * @param {boolean=} opt_noInheritance Optional flag indicating if this
   *     object's uid property can be inherited from parents or not.
   * @throws {Error} when invoked to indicate the method should be overridden.
   */
  function getUid(opt_object, opt_noInheritance) {
    if (opt_object) {
      var id = opt_object[UID_PROPERTY];
      if (opt_noInheritance && !opt_object.hasOwnProperty(UID_PROPERTY)) {
        id = null;
      }
      return id || (opt_object[UID_PROPERTY] = uniqueIdCounter_++);
    }
    return uniqueIdCounter_++;
  }

  /**
   * The identity function. Returns its first argument.
   * @param {*=} opt_returnValue The single value that will be returned.
   * @return {?} The first argument.
   */
  function identityFunction(opt_returnValue) {
    return opt_returnValue;
  }

  /**
   * Returns true if the specified value is a boolean.
   * @param {?} val Variable to test.
   * @return {boolean} Whether variable is boolean.
   */
  function isBoolean(val) {
    return typeof val === 'boolean';
  }

  /**
   * Returns true if the specified value is not undefined.
   * @param {?} val Variable to test.
   * @return {boolean} Whether variable is defined.
   */
  function isDef(val) {
    return val !== undefined;
  }

  /**
   * Returns true if value is not undefined or null.
   * @param {*} val
   * @return {boolean}
   */
  function isDefAndNotNull(val) {
    return isDef(val) && !isNull(val);
  }

  /**
   * Returns true if value is a document.
   * @param {*} val
   * @return {boolean}
   */
  function isDocument(val) {
    return val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val.nodeType === 9;
  }

  /**
   * Returns true if value is a dom element.
   * @param {*} val
   * @return {boolean}
   */
  function isElement(val) {
    return val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val.nodeType === 1;
  }

  /**
   * Returns true if the specified value is a function.
   * @param {?} val Variable to test.
   * @return {boolean} Whether variable is a function.
   */
  function isFunction(val) {
    return typeof val === 'function';
  }

  /**
   * Returns true if value is null.
   * @param {*} val
   * @return {boolean}
   */
  function isNull(val) {
    return val === null;
  }

  /**
   * Returns true if the specified value is a number.
   * @param {?} val Variable to test.
   * @return {boolean} Whether variable is a number.
   */
  function isNumber(val) {
    return typeof val === 'number';
  }

  /**
   * Returns true if value is a window.
   * @param {*} val
   * @return {boolean}
   */
  function isWindow(val) {
    return val !== null && val === val.window;
  }

  /**
   * Returns true if the specified value is an object. This includes arrays
   * and functions.
   * @param {?} val Variable to test.
   * @return {boolean} Whether variable is an object.
   */
  function isObject(val) {
    var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
    return type === 'object' && val !== null || type === 'function';
  }

  /**
   * Returns true if value is a Promise.
   * @param {*} val
   * @return {boolean}
   */
  function isPromise(val) {
    return val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && typeof val.then === 'function';
  }

  /**
   * Returns true if value is a string.
   * @param {*} val
   * @return {boolean}
   */
  function isString(val) {
    return typeof val === 'string' || val instanceof String;
  }

  /**
   * Merges the values of a export function property a class with the values of that
   * property for all its super classes, and stores it as a new static
   * property of that class. If the export function property already existed, it won't
   * be recalculated.
   * @param {!function()} constructor Class constructor.
   * @param {string} propertyName Property name to be collected.
   * @param {function(*, *):*=} opt_mergeFn Function that receives an array filled
   *   with the values of the property for the current class and all its super classes.
   *   Should return the merged value to be stored on the current class.
   * @return {boolean} Returns true if merge happens, false otherwise.
   */
  function mergeSuperClassesProperty(constructor, propertyName, opt_mergeFn) {
    var mergedName = propertyName + '_MERGED';
    if (constructor.hasOwnProperty(mergedName)) {
      return false;
    }

    var merged = collectSuperClassesProperty(constructor, propertyName);
    if (opt_mergeFn) {
      merged = opt_mergeFn(merged);
    }
    constructor[mergedName] = merged;
    return true;
  }

  /**
   * Null function used for default values of callbacks, etc.
   * @return {void} Nothing.
   */
  function nullFunction() {}
});
//# sourceMappingURL=core.js.map