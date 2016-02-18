define(['exports', 'metal/src/metal', './parseFromAnchor'], function (exports, _metal, _parseFromAnchor) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _parseFromAnchor2 = _interopRequireDefault(_parseFromAnchor);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	/**
  * Parses the given uri string into an object. The URL function will be used
  * when present, otherwise we'll fall back to the anchor node element.
  * @param {*=} opt_uri Optional string URI to parse
  */
	function parse(opt_uri) {
		if (_metal.core.isFunction(URL) && URL.length) {
			return new URL(opt_uri);
		} else {
			return (0, _parseFromAnchor2.default)(opt_uri);
		}
	}

	exports.default = parse;
});
//# sourceMappingURL=parse.js.map