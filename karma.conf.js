const metalKarmaConfig = require('metal-karma-config');

module.exports = function(config) {
	config.set({
		browserDisconnectTimeout: 3000,
		browserNoActivityTimeout: 35000,
		client: {
			mocha: {
				timeout : 35000
			}
		}
	});
	metalKarmaConfig(config);

	// Add required polyfills for IE11
	config.files.unshift(
		'node_modules/es-object-assign/dist/object-assign-auto.min.js',
		'node_modules/promise-polyfill/dist/polyfill.min.js'
	);
};