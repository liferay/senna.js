'use strict';

import utils from '../../src/utils/utils';
import globals from '../../src/globals/globals';

describe('utils', function() {

	before(function() {
		globals.window = {
			location: {
				hostname: 'hostname',
				pathname: '/path',
				search: '?a=1',
				hash: '#hash'
			}
		};
	});

	after(function() {
		globals.window = window;
	});

	it('should get path from url', function() {
		assert.strictEqual('/path?a=1#hash', utils.getUrlPath('http://hostname/path?a=1#hash'));
	});

	it('should get path from url excluding hashbang', function() {
		assert.strictEqual('/path?a=1', utils.getUrlPathWithoutHash('http://hostname/path?a=1#hash'));
	});

	it('should test if path is current browser path', function() {
		assert.ok(utils.isCurrentBrowserPath('http://hostname/path?a=1'));
		assert.ok(utils.isCurrentBrowserPath('http://hostname/path?a=1#hash'));
		assert.ok(!utils.isCurrentBrowserPath('http://hostname/path1?a=1'));
		assert.ok(!utils.isCurrentBrowserPath('http://hostname/path1?a=1#hash'));
		assert.ok(!utils.isCurrentBrowserPath());
	});

	it('should get current browser path', function() {
		assert.strictEqual('/path?a=1#hash', utils.getCurrentBrowserPath());
	});

	it('should get current browser path excluding hashbang', function() {
		assert.strictEqual('/path?a=1', utils.getCurrentBrowserPathWithoutHash());
	});

});