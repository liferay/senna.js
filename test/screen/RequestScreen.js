'use strict';

import RequestScreen from '../../src/screen/RequestScreen';

describe('RequestScreen', function() {

	beforeEach(function() {
		this.xhr = sinon.useFakeXMLHttpRequest();

		var requests = this.requests = [];

		this.xhr.onCreate = function(xhr) {
			requests.push(xhr);
		};
	});

	afterEach(function() {
		this.xhr.restore();
	});

	it('should be cacheable', function() {
		var screen = new RequestScreen();
		assert.ok(screen.isCacheable());
	});

	it('should set HTTP method', function() {
		var screen = new RequestScreen();
		assert.strictEqual('GET', screen.getHttpMethod());
		screen.setHttpMethod('POST');
		assert.strictEqual('POST', screen.getHttpMethod());
	});

	it('should set HTTP headers', function() {
		var screen = new RequestScreen();
		assert.deepEqual({
			'X-PJAX': 'true',
			'X-Requested-With': 'XMLHttpRequest'
		}, screen.getHttpHeaders());
		screen.setHttpHeaders({});
		assert.deepEqual({}, screen.getHttpHeaders());
	});

	it('should set timeout', function() {
		var screen = new RequestScreen();
		assert.strictEqual(30000, screen.getTimeout());
		screen.setTimeout(0);
		assert.strictEqual(0, screen.getTimeout());
	});

	it('should send request to an url', function(done) {
		var screen = new RequestScreen();
		screen.load('/url').then(function() {
			assert.strictEqual('/url', screen.getRequest().url);
			assert.deepEqual({
				'X-PJAX': 'true',
				'X-Requested-With': 'XMLHttpRequest'
			}, screen.getRequest().requestHeaders);
			done();
		});
		this.requests[0].respond(200);
	});

	it('should load response content from cache', function(done) {
		var screen = new RequestScreen();
		var cache = {};
		screen.addCache(cache);
		screen.load('/url').then(function(cachedContent) {
			assert.strictEqual(cache, cachedContent);
			done();
		});
	});

	it('should cancel load request to an url', function(done) {
		var self = this;
		var screen = new RequestScreen();
		screen.load('/url')
			.then(function() {
				assert.fail();
			})
			.catch(function() {
				assert.ok(self.requests[0].aborted);
				done();
			})
			.cancel();
	});

});