'use strict';

import { core } from 'metal';
import Route from '../../src/route/Route';

describe('Route', function() {

	describe('Constructor', () => {
		it('should throws error when path and handler not specified', () => {
			assert.throws(() => {
				new Route();
			}, Error);
		});

		it('should throws error when path is null', () => {
			assert.throws(() => {
				new Route(null, core.nullFunction);
			}, Error);
		});

		it('should throws error when path is undefined', () => {
			assert.throws(() => {
				new Route(undefined, core.nullFunction);
			}, Error);
		});

		it('should throws error when handler not specified', () => {
			assert.throws(() => {
				new Route('/path');
			}, Error);
		});

		it('should throws error when handler not a function', () => {
			assert.throws(() => {
				new Route('/path', {});
			}, Error);
		});

		it('should not throws error when handler is a function', () => {
			assert.doesNotThrow(() => {
				new Route('/path', core.nullFunction);
			});
		});

		it('should set path and handler from constructor', () => {
			var route = new Route('/path', core.nullFunction);
			assert.strictEqual('/path', route.getPath());
			assert.strictEqual(core.nullFunction, route.getHandler());
		});
	});

	describe('Matching', () => {
		it('should match route by string path', () => {
			var route = new Route('/path', core.nullFunction);
			assert.ok(route.matchesPath('/path'));
		});

		it('should match route by regex path', () => {
			var route = new Route(/\/path/, core.nullFunction);
			assert.ok(route.matchesPath('/path'));
		});

		it('should match route by function path', () => {
			var route = new Route(function(path) {
				return path === '/path';
			}, core.nullFunction);
			assert.ok(route.matchesPath('/path'));
		});

		it('should not match any route', () => {
			var route = new Route('/path', core.nullFunction);
			assert.ok(!route.matchesPath('/invalid'));
		});

		it('should not match any route for invalid path', () => {
			var route = new Route({}, core.nullFunction);
			assert.ok(!route.matchesPath('/invalid'));
		});
	});

});
