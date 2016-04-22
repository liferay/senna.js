define(['exports', 'metal/src/metal', 'metal-dom/src/all/dom', '../cacheable/Cacheable', 'metal-promise/src/promise/Promise'], function (exports, _metal, _dom, _Cacheable2, _Promise) {
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

	var Screen = function (_Cacheable) {
		_inherits(Screen, _Cacheable);

		/**
   * Screen class is a special type of route handler that provides helper
   * utilities that adds lifecycle and methods to provide content to each
   * registered surface.
   * @constructor
   * @extends {Cacheable}
   */

		function Screen() {
			_classCallCheck(this, Screen);

			var _this = _possibleConstructorReturn(this, _Cacheable.call(this));

			/**
    * Holds the screen id.
    * @type {string}
    * @protected
    */
			_this.id = _this.makeId_(_metal.core.getUid());

			/**
    * Holds the screen title. Relevant when the page title should be
    * upadated when screen is rendered.
    * @type {?string=}
    * @default null
    * @protected
    */
			_this.title = null;
			return _this;
		}

		/**
   * Fires when the screen is active. Allows a screen to perform any setup
   * that requires its DOM to be visible. Lifecycle.
   */


		Screen.prototype.activate = function activate() {
			void 0;
		};

		Screen.prototype.beforeDeactivate = function beforeDeactivate() {
			void 0;
		};

		Screen.prototype.beforeUpdateHistoryPath = function beforeUpdateHistoryPath(path) {
			return path;
		};

		Screen.prototype.beforeUpdateHistoryState = function beforeUpdateHistoryState(state) {
			return state;
		};

		Screen.prototype.deactivate = function deactivate() {
			void 0;
		};

		Screen.prototype.disposeInternal = function disposeInternal() {
			_Cacheable.prototype.disposeInternal.call(this);
			void 0;
		};

		Screen.prototype.evaluateScripts = function evaluateScripts(surfaces) {
			Object.keys(surfaces).forEach(function (sId) {
				if (surfaces[sId].activeChild) {
					_dom.globalEval.runScriptsInElement(surfaces[sId].activeChild);
				}
			});
			return _Promise2.default.resolve();
		};

		Screen.prototype.evaluateStyles = function evaluateStyles() {
			return _Promise2.default.resolve();
		};

		Screen.prototype.flip = function flip(surfaces) {
			var _this2 = this;

			void 0;

			var transitions = [];

			Object.keys(surfaces).forEach(function (sId) {
				var surface = surfaces[sId];
				var deferred = surface.show(_this2.id);
				transitions.push(deferred);
			});

			return _Promise2.default.all(transitions);
		};

		Screen.prototype.getId = function getId() {
			return this.id;
		};

		Screen.prototype.getSurfaceContent = function getSurfaceContent() {
			void 0;
		};

		Screen.prototype.getTitle = function getTitle() {
			return this.title;
		};

		Screen.prototype.load = function load() {
			void 0;
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

	/**
  * @param {*} object
  * @return {boolean} Whether a given instance implements
  * <code>Screen</code>.
  */
	Screen.isImplementedBy = function (object) {
		return object instanceof Screen;
	};

	exports.default = Screen;
});
//# sourceMappingURL=Screen.js.map