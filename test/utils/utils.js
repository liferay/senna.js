'use strict';

import utils from '../../src/utils/utils';
import globals from '../../src/globals/globals';

describe('utils', function() {

	before(() => {
		globals.window = {
			location: {
				hostname: 'hostname',
				pathname: '/path',
				search: '?a=1',
				hash: '#hash'
			},
			history: {
				pushState: 1
			}
		};
	});

	after(() => {
		globals.window = window;
	});

	it('should get path from url', () => {
		assert.strictEqual('/path?a=1#hash', utils.getUrlPath('http://hostname/path?a=1#hash'));
	});

	it('should get path from url excluding hashbang', () => {
		assert.strictEqual('/path?a=1', utils.getUrlPathWithoutHash('http://hostname/path?a=1#hash'));
	});

	it('should test if path is current browser path', () => {
		assert.ok(utils.isCurrentBrowserPath('http://hostname/path?a=1'));
		assert.ok(utils.isCurrentBrowserPath('http://hostname/path?a=1#hash'));
		assert.ok(!utils.isCurrentBrowserPath('http://hostname/path1?a=1'));
		assert.ok(!utils.isCurrentBrowserPath('http://hostname/path1?a=1#hash'));
		assert.ok(!utils.isCurrentBrowserPath());
	});

	it('should get current browser path', () => {
		assert.strictEqual('/path?a=1#hash', utils.getCurrentBrowserPath());
	});

	it('should get current browser path excluding hashbang', () => {
		assert.strictEqual('/path?a=1', utils.getCurrentBrowserPathWithoutHash());
	});

	it('should test if Html5 history is supported', () => {
		assert.ok(utils.isHtml5HistorySupported());
		globals.window.history = null;
		assert.ok(!utils.isHtml5HistorySupported());
	});

});