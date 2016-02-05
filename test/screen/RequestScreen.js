'use strict';

import globals from '../../src/globals/globals';
import RequestScreen from '../../src/screen/RequestScreen';
import UA from 'metal-useragent';

describe('RequestScreen', function() {

	beforeEach(function() {
		this.xhr = sinon.useFakeXMLHttpRequest();

		var requests = this.requests = [];

		this.xhr.onCreate = function(xhr) {
			requests.push(xhr);
		};

		UA.testUserAgent(UA.getNativeUserAgent());
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
		assert.strictEqual(RequestScreen.GET, screen.getHttpMethod());
		screen.setHttpMethod(RequestScreen.POST);
		assert.strictEqual(RequestScreen.POST, screen.getHttpMethod());
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

	it('should screen beforeUpdateHistoryPath returns response path if different from navigate path', function() {
		var screen = new RequestScreen();
		sinon.stub(screen, 'getRequest', function() {
			return {
				responseURL: '/redirect'
			};
		});
		assert.strictEqual('/redirect', screen.beforeUpdateHistoryPath('/path'));
	});

	it('should screen beforeUpdateHistoryState returns null if form navigate to post-without-redirect-get', function() {
		var screen = new RequestScreen();
		assert.strictEqual(null, screen.beforeUpdateHistoryState({
			senna: true,
			form: true,
			redirectPath: '/post',
			path: '/post'
		}));
	});

	it('should request path return null if no requests were made', function() {
		var screen = new RequestScreen();
		assert.strictEqual(null, screen.getRequestPath());
	});

	it('should send request to an url', function(done) {
		UA.testUserAgent('Chrome'); // Simulates chrome user agent to avoid unique url on test case
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

	it('should request fail for invalid status code response', function(done) {
		new RequestScreen().load('/url').catch((error) => {
			assert.ok(error.responseError);
			done();
		});
		this.requests[0].respond(404);
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

	it('should not load response content from cache for post requests', function(done) {
		var screen = new RequestScreen();
		var cache = {};
		screen.setHttpMethod(RequestScreen.POST);
		screen.load('/url').then(() => {
			screen.load('/url').then((cachedContent) => {
				assert.notStrictEqual(cache, cachedContent);
				done();
			});
			this.requests[1].respond(200);
		});
		this.requests[0].respond(200);
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

	it('should form navigate force post method and request body wrapped in FormData', function(done) {
		globals.capturedFormElement = globals.document.createElement('form');
		var screen = new RequestScreen();
		screen.load('/url').then(function() {
			assert.strictEqual(RequestScreen.POST, screen.getRequest().method);
			assert.ok(screen.getRequest().requestBody instanceof FormData);
			globals.capturedFormElement = null;
			done();
		});
		this.requests[0].respond(200);
	});

	it('should not cache get requests on ie browsers', function(done) {
		UA.testUserAgent('MSIE'); // Simulates ie user agent
		var url = '/url';
		var screen = new RequestScreen();
		screen.load(url).then(function() {
			assert.notStrictEqual(url, screen.getRequest().url);
			done();
		});
		this.requests[0].respond(200);
	});

	it('should not cache get requests on edge browsers', function(done) {
		UA.testUserAgent('Edge'); // Simulates edge user agent
		var url = '/url';
		var screen = new RequestScreen();
		screen.load(url).then(function() {
			assert.notStrictEqual(url, screen.getRequest().url);
			done();
		});
		this.requests[0].respond(200);
	});

});
