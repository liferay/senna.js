var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(['exports', 'metal/src/metal', 'metal-dom/src/index', '../cacheable/Cacheable', 'metal-promise/src/promise/Promise'], function (exports, _metal, _index, _Cacheable2, _Promise) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _Cacheable3 = _interopRequireDefault(_Cacheable2);

	var _Promise2 = _interopRequireDefault(_Promise);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

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

	var Screen = function (_Cacheable) {
		_inherits(Screen, _Cacheable);

		function Screen() {
			_classCallCheck(this, Screen);

			var _this = _possibleConstructorReturn(this, _Cacheable.call(this));

			_this.id = _this.makeId_(_metal.core.getUid());
			_this.title = null;
			return _this;
		}

		Screen.prototype.activate = function activate() {
			console.log('Screen [' + this + '] activate');
		};

		Screen.prototype.beforeDeactivate = function beforeDeactivate() {
			console.log('Screen [' + this + '] beforeDeactivate');
		};

		Screen.prototype.beforeUpdateHistoryPath = function beforeUpdateHistoryPath(path) {
			return path;
		};

		Screen.prototype.beforeUpdateHistoryState = function beforeUpdateHistoryState(state) {
			return state;
		};

		Screen.prototype.deactivate = function deactivate() {
			console.log('Screen [' + this + '] deactivate');
		};

		Screen.prototype.disposeInternal = function disposeInternal() {
			_Cacheable.prototype.disposeInternal.call(this);

			console.log('Screen [' + this + '] dispose');
		};

		Screen.prototype.flip = function flip(surfaces) {
			var _this2 = this;

			console.log('Screen [' + this + '] flip');
			var transitions = [];
			Object.keys(surfaces).forEach(function (sId) {
				var surface = surfaces[sId];
				var deferred = surface.show(_this2.id);
				transitions.push(deferred);

				if (surface.activeChild) {
					deferred.then(function () {
						return _index.globalEval.runScriptsInElement(surface.activeChild);
					});
				}
			});
			return _Promise2.default.all(transitions);
		};

		Screen.prototype.getId = function getId() {
			return this.id;
		};

		Screen.prototype.getSurfaceContent = function getSurfaceContent() {
			console.log('Screen [' + this + '] getSurfaceContent');
		};

		Screen.prototype.getTitle = function getTitle() {
			return this.title;
		};

		Screen.prototype.load = function load() {
			console.log('Screen [' + this + '] load');
			return _Promise2.default.resolve();
		};

		Screen.prototype.makeId_ = function makeId_(id) {
			return 'screen_' + id;
		};

		Screen.prototype.setId = function setId(id) {
			this.id = id;
		};

		Screen.prototype.setTitle = function setTitle(title) {
			this.title = title;
		};

		Screen.prototype.toString = function toString() {
			return this.id;
		};

		return Screen;
	}(_Cacheable3.default);

	Screen.prototype.registerMetalComponent && Screen.prototype.registerMetalComponent(Screen, 'Screen')

	Screen.isImplementedBy = function (object) {
		return object instanceof Screen;
	};

	exports.default = Screen;
});
//# sourceMappingURL=Screen.js.map