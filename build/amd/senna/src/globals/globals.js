define(['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var globals = globals || {};

	if (typeof window !== 'undefined') {
		globals.window = window;
	}

	if (typeof document !== 'undefined') {
		globals.document = document;
	}

	exports.default = globals;
});
//# sourceMappingURL=globals.js.map
