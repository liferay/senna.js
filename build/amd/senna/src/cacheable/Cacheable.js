var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(['exports', 'metal/src/index'], function (exports, _index) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
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

		function Cacheable() {
			_classCallCheck(this, Cacheable);

			var _this = _possibleConstructorReturn(this, _Disposable.call(this));

			_this.cache = null;
			_this.cacheable = false;
			return _this;
		}

		Cacheable.prototype.addCache = function addCache(content) {
			if (this.cacheable) {
				this.cache = content;
			}

			return this;
		};

		Cacheable.prototype.clearCache = function clearCache() {
			this.cache = null;
			return this;
		};

		Cacheable.prototype.disposeInternal = function disposeInternal() {
			this.clearCache();
		};

		Cacheable.prototype.getCache = function getCache() {
			return this.cache;
		};

		Cacheable.prototype.isCacheable = function isCacheable() {
			return this.cacheable;
		};

		Cacheable.prototype.setCacheable = function setCacheable(cacheable) {
			if (!cacheable) {
				this.clearCache();
			}

			this.cacheable = cacheable;
		};

		return Cacheable;
	}(_index.Disposable);

	Cacheable.prototype.registerMetalComponent && Cacheable.prototype.registerMetalComponent(Cacheable, 'Cacheable')
	exports.default = Cacheable;
});
//# sourceMappingURL=Cacheable.js.map