'use strict';

import Cacheable from '../../src/cacheable/Cacheable';

describe('Cacheable', () => {

	it('should not be cacheable by default', () => {
		assert.ok(!new Cacheable().isCacheable());
	});

	it('should be cacheable', () => {
		const cacheable = new Cacheable();
		cacheable.setCacheable(true);
		assert.ok(cacheable.isCacheable());
	});

	it('should clear cache when toggle cacheable state', () => {
		const cacheable = new Cacheable();
		cacheable.setCacheable(true);
		cacheable.addCache('data');
		assert.strictEqual('data', cacheable.getCache());
		cacheable.setCacheable(false);
		assert.strictEqual(null, cacheable.getCache());
	});

	it('should clear cache on dispose', () => {
		const cacheable = new Cacheable();
		cacheable.setCacheable(true);
		cacheable.addCache('data');
		cacheable.dispose();
		assert.strictEqual(null, cacheable.getCache());
	});

});