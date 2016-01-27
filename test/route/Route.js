'use strict';

import core from 'metal/src/core';
import Route from '../../src/route/Route';

describe('Route', function() {

	describe('Constructor', function() {
		it('should throws error when path and handler not specified', function() {
			assert.throws(function() {
				new Route();
			}, Error);
		});

		it('should throws error when path is null', function() {
			assert.throws(function() {
				new Route(null, core.nullFunction);
			}, Error);
		});

		it('should throws error when path is undefined', function() {
			assert.throws(function() {
				new Route(undefined, core.nullFunction);
			}, Error);
		});

		it('should throws error when handler not specified', function() {
			assert.throws(function() {
				new Route('/path');
			}, Error);
		});

		it('should throws error when handler not a function', function() {
			assert.throws(function() {
				new Route('/path', {});
			}, Error);
		});

		it('should not throws error when handler is a function', function() {
			assert.doesNotThrow(function() {
				new Route('/path', core.nullFunction);
			});
		});

		it('should set path and handler from constructor', function() {
			var route = new Route('/path', core.nullFunction);
			assert.strictEqual('/path', route.getPath());
			assert.strictEqual(core.nullFunction, route.getHandler());
		});
	});

	describe('Matching', function() {
		it('should match route by string path', function() {
			var route = new Route('/path', core.nullFunction);
			assert.ok(route.matchesPath('/path'));
		});

		it('should match route by regex path', function() {
			var route = new Route(/\/path/, core.nullFunction);
			assert.ok(route.matchesPath('/path'));
		});

		it('should match route by function path', function() {
			var route = new Route(function(path) {
				return path === '/path';
			}, core.nullFunction);
			assert.ok(route.matchesPath('/path'));
		});

		it('should not match any route', function() {
			var route = new Route('/path', core.nullFunction);
			assert.ok(!route.matchesPath('/invalid'));
		});

		it('should not match any route for invalid path', function() {
			var route = new Route({}, core.nullFunction);
			assert.ok(!route.matchesPath('/invalid'));
		});
	});

});
