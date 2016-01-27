'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(['exports', 'senna/src/globals/globals', 'senna/src/screen/RequestScreen', 'senna/src/surface/Surface', 'senna/src/app/dataAttributes'], function (exports, _globals, _RequestScreen2, _Surface, _dataAttributes) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _globals2 = _interopRequireDefault(_globals);

	var _RequestScreen3 = _interopRequireDefault(_RequestScreen2);

	var _Surface2 = _interopRequireDefault(_Surface);

	var _dataAttributes2 = _interopRequireDefault(_dataAttributes);

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

	var HtmlScreen = function (_RequestScreen) {
		_inherits(HtmlScreen, _RequestScreen);

		function HtmlScreen() {
			_classCallCheck(this, HtmlScreen);

			var _this = _possibleConstructorReturn(this, _RequestScreen.call(this));

			_this.titleSelector = 'title';
			return _this;
		}

		HtmlScreen.prototype.activate = function activate() {
			_RequestScreen.prototype.activate.call(this);

			this.releaseVirtualDocument();
		};

		HtmlScreen.prototype.allocateVirtualDocumentForContent = function allocateVirtualDocumentForContent(htmlString) {
			if (!this.virtualDocument) {
				this.virtualDocument = _globals2.default.document.createElement('html');
			}

			this.virtualDocument.innerHTML = htmlString;
		};

		HtmlScreen.prototype.getSurfaceContent = function getSurfaceContent(surfaceId) {
			var surface = this.virtualDocument.querySelector('#' + surfaceId);

			if (surface) {
				var defaultChild = surface.querySelector('#' + surfaceId + '-' + _Surface2.default.DEFAULT);

				if (defaultChild) {
					return defaultChild.innerHTML;
				}

				return surface.innerHTML;
			}
		};

		HtmlScreen.prototype.getTitleSelector = function getTitleSelector() {
			return this.titleSelector;
		};

		HtmlScreen.prototype.load = function load(path) {
			var _this2 = this;

			return _RequestScreen.prototype.load.call(this, path).then(function (content) {
				_this2.allocateVirtualDocumentForContent(content);

				_this2.resolveTitleFromVirtualDocument();

				_this2.maybeSetBodyIdInVirtualDocument();

				return content;
			});
		};

		HtmlScreen.prototype.releaseVirtualDocument = function releaseVirtualDocument() {
			this.virtualDocument = null;
		};

		HtmlScreen.prototype.resolveTitleFromVirtualDocument = function resolveTitleFromVirtualDocument() {
			var title = this.virtualDocument.querySelector(this.titleSelector);

			if (title) {
				this.setTitle(title.innerHTML.trim());
			}
		};

		HtmlScreen.prototype.setTitleSelector = function setTitleSelector(titleSelector) {
			this.titleSelector = titleSelector;
		};

		HtmlScreen.prototype.maybeSetBodyIdInVirtualDocument = function maybeSetBodyIdInVirtualDocument() {
			var bodySurface = this.virtualDocument.querySelector('body[' + _dataAttributes2.default.surface + ']');

			if (bodySurface) {
				bodySurface.id = _globals2.default.document.body.id;
			}
		};

		return HtmlScreen;
	}(_RequestScreen3.default);

	HtmlScreen.prototype.registerMetalComponent && HtmlScreen.prototype.registerMetalComponent(HtmlScreen, 'HtmlScreen')
	exports.default = HtmlScreen;
});
//# sourceMappingURL=HtmlScreen.js.map