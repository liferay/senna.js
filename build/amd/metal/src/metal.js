define(['exports', './core', './array/array', './async/async', './disposable/Disposable', './object/object', './string/string'], function (exports, _core, _array, _async, _Disposable, _object, _string) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.core = exports.string = exports.object = exports.Disposable = exports.async = exports.array = undefined;
  Object.keys(_core).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _core[key];
      }
    });
  });

  var core = _interopRequireWildcard(_core);

  var _array2 = _interopRequireDefault(_array);

  var _async2 = _interopRequireDefault(_async);

  var _Disposable2 = _interopRequireDefault(_Disposable);

  var _object2 = _interopRequireDefault(_object);

  var _string2 = _interopRequireDefault(_string);

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

  exports.array = _array2.default;
  exports.async = _async2.default;
  exports.Disposable = _Disposable2.default;
  exports.object = _object2.default;
  exports.string = _string2.default;
  exports.default = core;
  exports.core = core;
});
//# sourceMappingURL=metal.js.map