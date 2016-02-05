define(['exports', './EventEmitter', './EventEmitterProxy', './EventHandle', './EventHandler'], function (exports, _EventEmitter, _EventEmitterProxy, _EventHandle, _EventHandler) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.EventHandler = exports.EventHandle = exports.EventEmitterProxy = exports.EventEmitter = undefined;

  var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

  var _EventEmitterProxy2 = _interopRequireDefault(_EventEmitterProxy);

  var _EventHandle2 = _interopRequireDefault(_EventHandle);

  var _EventHandler2 = _interopRequireDefault(_EventHandler);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _EventEmitter2.default;
  exports.EventEmitter = _EventEmitter2.default;
  exports.EventEmitterProxy = _EventEmitterProxy2.default;
  exports.EventHandle = _EventHandle2.default;
  exports.EventHandler = _EventHandler2.default;
});
//# sourceMappingURL=events.js.map