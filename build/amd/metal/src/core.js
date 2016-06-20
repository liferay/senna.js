define(['exports'], function (exports) {
	'use strict';

	/**
  * A collection of core utility functions.
  * @const
  */

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	} : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
	};

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var core = function () {
		function core() {
			_classCallCheck(this, core);
		}

		core.abstractMethod = function abstractMethod() {
			throw Error('Unimplemented abstract method');
		};

		core.collectSuperClassesProperty = function collectSuperClassesProperty(constructor, propertyName) {
			var propertyValues = [constructor[propertyName]];
			while (constructor.__proto__ && !constructor.__proto__.isPrototypeOf(Function)) {
				constructor = constructor.__proto__;
				propertyValues.push(constructor[propertyName]);
			}
			return propertyValues;
		};

		core.getFunctionName = function getFunctionName(fn) {
			if (!fn.name) {
				var str = fn.toString();
				fn.name = str.substring(9, str.indexOf('('));
			}
			return fn.name;
		};

		core.getUid = function getUid(opt_object, opt_noInheritance) {
			if (opt_object) {
				var id = opt_object[core.UID_PROPERTY];
				if (opt_noInheritance && !opt_object.hasOwnProperty(core.UID_PROPERTY)) {
					id = null;
				}
				return id || (opt_object[core.UID_PROPERTY] = core.uniqueIdCounter_++);
			}
			return core.uniqueIdCounter_++;
		};

		core.identityFunction = function identityFunction(opt_returnValue) {
			return opt_returnValue;
		};

		core.isBoolean = function isBoolean(val) {
			return typeof val === 'boolean';
		};

		core.isDef = function isDef(val) {
			return val !== undefined;
		};

		core.isDefAndNotNull = function isDefAndNotNull(val) {
			return core.isDef(val) && !core.isNull(val);
		};

		core.isDocument = function isDocument(val) {
			return val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val.nodeType === 9;
		};

		core.isElement = function isElement(val) {
			return val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val.nodeType === 1;
		};

		core.isFunction = function isFunction(val) {
			return typeof val === 'function';
		};

		core.isNull = function isNull(val) {
			return val === null;
		};

		core.isNumber = function isNumber(val) {
			return typeof val === 'number';
		};

		core.isWindow = function isWindow(val) {
			return val !== null && val === val.window;
		};

		core.isObject = function isObject(val) {
			var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
			return type === 'object' && val !== null || type === 'function';
		};

		core.isPromise = function isPromise(val) {
			return val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && typeof val.then === 'function';
		};

		core.isString = function isString(val) {
			return typeof val === 'string';
		};

		core.mergeSuperClassesProperty = function mergeSuperClassesProperty(constructor, propertyName, opt_mergeFn) {
			var mergedName = propertyName + '_MERGED';
			if (constructor.hasOwnProperty(mergedName)) {
				return false;
			}

			var merged = core.collectSuperClassesProperty(constructor, propertyName);
			if (opt_mergeFn) {
				merged = opt_mergeFn(merged);
			}
			constructor[mergedName] = merged;
			return true;
		};

		core.nullFunction = function nullFunction() {};

		return core;
	}();

	/**
  * Unique id property prefix.
  * @type {String}
  * @protected
  */
	core.UID_PROPERTY = 'core_' + (Math.random() * 1e9 >>> 0);

	/**
  * Counter for unique id.
  * @type {Number}
  * @private
  */
	core.uniqueIdCounter_ = 1;

	exports.default = core;
});
//# sourceMappingURL=core.js.map