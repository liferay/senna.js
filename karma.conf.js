const metalKarmaConfig = require('metal-karma-config');

module.exports = function(config) {
	config.set({
		browserDisconnectTimeout: 3000,
		browserNoActivityTimeout: 35000,
		client: {
			mocha: {
				timeout : 35000
			}
		},
		files: [
			'https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js'
		]
	});
	metalKarmaConfig(config);
};