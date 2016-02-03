var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(['exports', '../globals/globals', 'metal/src/index', 'metal-promise/src/promise/Promise'], function (exports, _globals, _index, _Promise) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _globals2 = _interopRequireDefault(_globals);

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

	var Surface = function (_Disposable) {
		_inherits(Surface, _Disposable);

		function Surface(id) {
			_classCallCheck(this, Surface);

			var _this = _possibleConstructorReturn(this, _Disposable.call(this));

			if (!id) {
				throw new Error('Surface element id not specified. A surface element requires a valid id.');
			}

			_this.activeChild = null;
			_this.defaultChild = null;
			_this.element = null;
			_this.id = id;
			_this.transitionFn = null;
			_this.defaultChild = _this.getChild(Surface.DEFAULT);

			_this.maybeWrapContentAsDefault_();

			_this.activeChild = _this.defaultChild;
			return _this;
		}

		Surface.prototype.addContent = function addContent(screenId, opt_content) {
			var child = this.defaultChild;

			if (_index.core.isDefAndNotNull(opt_content)) {
				child = this.createChild(screenId);

				_index.dom.append(child, opt_content);
			}

			this.transition(child, null);
			var element = this.getElement();

			if (element && child) {
				_index.dom.append(element, child);
			}

			return child;
		};

		Surface.prototype.createChild = function createChild(screenId) {
			var child = _globals2.default.document.createElement('div');

			child.setAttribute('id', this.makeId_(screenId));
			return child;
		};

		Surface.prototype.getChild = function getChild(screenId) {
			return _globals2.default.document.getElementById(this.makeId_(screenId));
		};

		Surface.prototype.getElement = function getElement() {
			if (this.element) {
				return this.element;
			}

			this.element = _globals2.default.document.getElementById(this.id);
			return this.element;
		};

		Surface.prototype.getId = function getId() {
			return this.id;
		};

		Surface.prototype.getTransitionFn = function getTransitionFn() {
			return this.transitionFn;
		};

		Surface.prototype.makeId_ = function makeId_(screenId) {
			return this.id + '-' + screenId;
		};

		Surface.prototype.maybeWrapContentAsDefault_ = function maybeWrapContentAsDefault_() {
			var element = this.getElement();

			if (element && !this.defaultChild) {
				var fragment = _globals2.default.document.createDocumentFragment();

				while (element.firstChild) {
					fragment.appendChild(element.firstChild);
				}

				this.defaultChild = this.addContent(Surface.DEFAULT, fragment);
				this.transition(null, this.defaultChild);
			}
		};

		Surface.prototype.setId = function setId(id) {
			this.id = id;
		};

		Surface.prototype.setTransitionFn = function setTransitionFn(transitionFn) {
			this.transitionFn = transitionFn;
		};

		Surface.prototype.show = function show(screenId) {
			var from = this.activeChild;
			var to = this.getChild(screenId);

			if (!to) {
				to = this.defaultChild;
			}

			this.activeChild = to;
			return this.transition(from, to).thenAlways(function () {
				if (from && from !== to) {
					_index.dom.exitDocument(from);
				}
			});
		};

		Surface.prototype.remove = function remove(screenId) {
			var child = this.getChild(screenId);

			if (child) {
				_index.dom.exitDocument(child);
			}
		};

		Surface.prototype.toString = function toString() {
			return this.id;
		};

		Surface.prototype.transition = function transition(from, to) {
			var transitionFn = this.transitionFn || Surface.defaultTransition;
			return _Promise2.default.resolve(transitionFn.call(this, from, to));
		};

		return Surface;
	}(_index.Disposable);

	Surface.prototype.registerMetalComponent && Surface.prototype.registerMetalComponent(Surface, 'Surface')
	Surface.DEFAULT = 'default';

	Surface.defaultTransition = function (from, to) {
		if (from) {
			from.style.display = 'none';
			from.classList.remove('flipped');
		}

		if (to) {
			to.style.display = 'block';
			to.classList.add('flipped');
		}
	};

	exports.default = Surface;
});
//# sourceMappingURL=Surface.js.map