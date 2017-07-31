define(['exports', './coreNamed'], function (exports, _coreNamed) {
  'use strict';

  // This file exists just for backwards compatibility, making sure that old
  // default imports for this file still work. It's best to use the named exports
  // for each function instead though, since that allows bundlers like Rollup to
  // reduce the bundle size by removing unused code.

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.core = undefined;
  Object.keys(_coreNamed).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _coreNamed[key];
      }
    });
  });

  var core = _interopRequireWildcard(_coreNamed);

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

  exports.default = core;
  exports.core = core;
});
//# sourceMappingURL=core.js.map
