define(['exports', './app/dataAttributeHandler', './app/App', './screen/HtmlScreen', './screen/RequestScreen', './route/Route', './screen/Screen'], function (exports, _dataAttributeHandler, _App, _HtmlScreen, _RequestScreen, _Route, _Screen) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Screen = exports.RequestScreen = exports.Route = exports.HtmlScreen = exports.App = exports.dataAttributeHandler = undefined;

  var _dataAttributeHandler2 = _interopRequireDefault(_dataAttributeHandler);

  var _App2 = _interopRequireDefault(_App);

  var _HtmlScreen2 = _interopRequireDefault(_HtmlScreen);

  var _RequestScreen2 = _interopRequireDefault(_RequestScreen);

  var _Route2 = _interopRequireDefault(_Route);

  var _Screen2 = _interopRequireDefault(_Screen);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _App2.default;
  exports.dataAttributeHandler = _dataAttributeHandler2.default;
  exports.App = _App2.default;
  exports.HtmlScreen = _HtmlScreen2.default;
  exports.Route = _Route2.default;
  exports.RequestScreen = _RequestScreen2.default;
  exports.Screen = _Screen2.default;
});
//# sourceMappingURL=senna.js.map