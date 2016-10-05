define(['exports', '../dom', '../domData', '../DomEventEmitterProxy', '../DomEventHandle', '../features', '../globalEval', '../globalEvalStyles', '../events'], function (exports, _dom, _domData, _DomEventEmitterProxy, _DomEventHandle, _features, _globalEval, _globalEvalStyles) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.dom = exports.globalEvalStyles = exports.globalEval = exports.features = exports.DomEventHandle = exports.DomEventEmitterProxy = exports.domData = undefined;
  Object.keys(_dom).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _dom[key];
      }
    });
  });

  var dom = _interopRequireWildcard(_dom);

  var _domData2 = _interopRequireDefault(_domData);

  var _DomEventEmitterProxy2 = _interopRequireDefault(_DomEventEmitterProxy);

  var _DomEventHandle2 = _interopRequireDefault(_DomEventHandle);

  var _features2 = _interopRequireDefault(_features);

  var _globalEval2 = _interopRequireDefault(_globalEval);

  var _globalEvalStyles2 = _interopRequireDefault(_globalEvalStyles);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  exports.domData = _domData2.default;
  exports.DomEventEmitterProxy = _DomEventEmitterProxy2.default;
  exports.DomEventHandle = _DomEventHandle2.default;
  exports.features = _features2.default;
  exports.globalEval = _globalEval2.default;
  exports.globalEvalStyles = _globalEvalStyles2.default;
  exports.default = dom;
  exports.dom = dom;
});
//# sourceMappingURL=dom.js.map