'use strict';

import Cacheable from '../../src/cacheable/Cacheable';

describe('Cacheable', function() {

	it('should not be cacheable by default', function() {
		assert.ok(!new Cacheable().isCacheable());
	});

	it('should be cacheable', function() {
		var cacheable = new Cacheable();
		cacheable.setCacheable(true);
		assert.ok(cacheable.isCacheable());
	});

	it('should clear cache when toggle cacheable state', function() {
		var cacheable = new Cacheable();
		cacheable.setCacheable(true);
		cacheable.addCache('data');
		assert.strictEqual('data', cacheable.getCache());
		cacheable.setCacheable(false);
		assert.strictEqual(null, cacheable.getCache());
	});

	it('should clear cache on dispose', function() {
		var cacheable = new Cacheable();
		cacheable.setCacheable(true);
		cacheable.addCache('data');
		cacheable.dispose();
		assert.strictEqual(null, cacheable.getCache());
	});

});