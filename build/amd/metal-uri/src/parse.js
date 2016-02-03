define(['exports', 'metal/src/index', './parseFromAnchor'], function (exports, _index, _parseFromAnchor) {
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

	function parse(opt_uri) {
		if (_index.core.isFunction(URL) && URL.length) {
			return new URL(opt_uri);
		} else {
			return (0, _parseFromAnchor2.default)(opt_uri);
		}
	}

	exports.default = parse;
});
//# sourceMappingURL=parse.js.map