define(['exports', 'metal/src/metal'], function (exports, _metal) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var Cacheable = function (_Disposable) {
		_inherits(Cacheable, _Disposable);

		/**
   * Abstract class for defining cacheable behavior.
   * @constructor
   */
		function Cacheable() {
			_classCallCheck(this, Cacheable);

			var _this = _possibleConstructorReturn(this, (Cacheable.__proto__ || Object.getPrototypeOf(Cacheable)).call(this));

			/**
    * Holds the cached data.
    * @type {!Object}
    * @default null
    * @protected
    */
			_this.cache = null;

			/**
    * Holds whether class is cacheable.
    * @type {boolean}
    * @default false
    * @protected
    */
			_this.cacheable = false;
			return _this;
		}

		/**
   * Adds content to the cache.
   * @param {string} content Content to be cached.
   * @chainable
   */


		_createClass(Cacheable, [{
			key: 'addCache',
			value: function addCache(content) {
				if (this.cacheable) {
					this.cache = content;
				}
				return this;
			}
		}, {
			key: 'clearCache',
			value: function clearCache() {
				this.cache = null;
				return this;
			}
		}, {
			key: 'disposeInternal',
			value: function disposeInternal() {
				this.clearCache();
			}
		}, {
			key: 'getCache',
			value: function getCache() {
				return this.cache;
			}
		}, {
			key: 'isCacheable',
			value: function isCacheable() {
				return this.cacheable;
			}
		}, {
			key: 'setCacheable',
			value: function setCacheable(cacheable) {
				if (!cacheable) {
					this.clearCache();
				}
				this.cacheable = cacheable;
			}
		}]);

		return Cacheable;
	}(_metal.Disposable);

	exports.default = Cacheable;
});
//# sourceMappingURL=Cacheable.js.map
