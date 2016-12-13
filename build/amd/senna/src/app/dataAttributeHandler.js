define(['exports', '../globals/globals', './AppDataAttributeHandler'], function (exports, _globals, _AppDataAttributeHandler) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _globals2 = _interopRequireDefault(_globals);

  var _AppDataAttributeHandler2 = _interopRequireDefault(_AppDataAttributeHandler);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * Data attribute handler.
   * @type {AppDataAttributeHandler}
   */
  var dataAttributeHandler = new _AppDataAttributeHandler2.default();

  _globals2.default.document.addEventListener('DOMContentLoaded', function () {
    dataAttributeHandler.setBaseElement(_globals2.default.document.body);
    dataAttributeHandler.handle();
  });

  exports.default = dataAttributeHandler;
});
//# sourceMappingURL=dataAttributeHandler.js.map
