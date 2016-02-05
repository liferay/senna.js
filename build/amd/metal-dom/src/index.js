define(['exports', './dom', './DomEventEmitterProxy', './DomEventHandle', './features', './globalEval', './events'], function (exports, _dom, _DomEventEmitterProxy, _DomEventHandle, _features, _globalEval) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.globalEval = exports.features = exports.DomEventHandle = exports.DomEventEmitterProxy = exports.dom = undefined;

  var _dom2 = _interopRequireDefault(_dom);

  var _DomEventEmitterProxy2 = _interopRequireDefault(_DomEventEmitterProxy);

  var _DomEventHandle2 = _interopRequireDefault(_DomEventHandle);

  var _features2 = _interopRequireDefault(_features);

  var _globalEval2 = _interopRequireDefault(_globalEval);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _dom2.default;
  exports.dom = _dom2.default;
  exports.DomEventEmitterProxy = _DomEventEmitterProxy2.default;
  exports.DomEventHandle = _DomEventHandle2.default;
  exports.features = _features2.default;
  exports.globalEval = _globalEval2.default;
});
//# sourceMappingURL=index.js.map