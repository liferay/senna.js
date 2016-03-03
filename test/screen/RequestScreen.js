'use strict';

import globals from '../../src/globals/globals';
import RequestScreen from '../../src/screen/RequestScreen';
import UA from 'metal-useragent';

describe('RequestScreen', function() {

	beforeEach(() => {
		var requests = this.requests = [];
		this.xhr = sinon.useFakeXMLHttpRequest();
		this.xhr.onCreate = (xhr) => {
			requests.push(xhr);
		};
		UA.testUserAgent(UA.getNativeUserAgent());
	});

	afterEach(() => {
		this.xhr.restore();
	});

	it('should be cacheable', () => {
		var screen = new RequestScreen();
		assert.ok(screen.isCacheable());
	});

	it('should set HTTP method', () => {
		var screen = new RequestScreen();
		assert.strictEqual(RequestScreen.GET, screen.getHttpMethod());
		screen.setHttpMethod(RequestScreen.POST);
		assert.strictEqual(RequestScreen.POST, screen.getHttpMethod());
	});

	it('should set HTTP headers', () => {
		var screen = new RequestScreen();
		assert.deepEqual({
			'X-PJAX': 'true',
			'X-Requested-With': 'XMLHttpRequest'
		}, screen.getHttpHeaders());
		screen.setHttpHeaders({});
		assert.deepEqual({}, screen.getHttpHeaders());
	});

	it('should set timeout', () => {
		var screen = new RequestScreen();
		assert.strictEqual(30000, screen.getTimeout());
		screen.setTimeout(0);
		assert.strictEqual(0, screen.getTimeout());
	});

	it('should screen beforeUpdateHistoryPath return request path if responseURL or X-Request-URL not present', () => {
		var screen = new RequestScreen();
		sinon.stub(screen, 'getRequest', () => {
			return {
				requestPath: '/path',
				getResponseHeader: function() {
					return null;
				}
			};
		});
		assert.strictEqual('/path', screen.beforeUpdateHistoryPath('/path'));
	});

	it('should screen beforeUpdateHistoryPath return responseURL if present', () => {
		var screen = new RequestScreen();
		sinon.stub(screen, 'getRequest', () => {
			return {
				requestPath: '/path',
				responseURL: '/redirect'
			};
		});
		assert.strictEqual('/redirect', screen.beforeUpdateHistoryPath('/path'));
	});

	it('should screen beforeUpdateHistoryPath return X-Request-URL if present and responseURL is not', () => {
		var screen = new RequestScreen();
		sinon.stub(screen, 'getRequest', () => {
			return {
				requestPath: '/path',
				getResponseHeader: (header) => {
					return {
						'X-Request-URL': '/redirect'
					}[header];
				}
			};
		});
		assert.strictEqual('/redirect', screen.beforeUpdateHistoryPath('/path'));
	});

	it('should screen beforeUpdateHistoryState return null if form navigate to post-without-redirect-get', () => {
		var screen = new RequestScreen();
		assert.strictEqual(null, screen.beforeUpdateHistoryState({
			senna: true,
			form: true,
			redirectPath: '/post',
			path: '/post'
		}));
	});

	it('should request path return null if no requests were made', () => {
		var screen = new RequestScreen();
		assert.strictEqual(null, screen.getRequestPath());
	});

	it('should send request to an url', (done) => {
		UA.testUserAgent('Chrome'); // Simulates chrome user agent to avoid unique url on test case
		var screen = new RequestScreen();
		screen.load('/url').then(() => {
			assert.strictEqual('/url', screen.getRequest().url);
			assert.deepEqual({
				'X-PJAX': 'true',
				'X-Requested-With': 'XMLHttpRequest'
			}, screen.getRequest().requestHeaders);
			done();
		});
		this.requests[0].respond(200);
	});

	it('should load response content from cache', (done) => {
		var screen = new RequestScreen();
		var cache = {};
		screen.addCache(cache);
		screen.load('/url').then((cachedContent) => {
			assert.strictEqual(cache, cachedContent);
			done();
		});
	});

	it('should not load response content from cache for post requests', (done) => {
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

	it('should cancel load request to an url', (done) => {
		var screen = new RequestScreen();
		screen.load('/url')
			.then(() => assert.fail())
			.catch(() => {
				assert.ok(this.requests[0].aborted);
				done();
			})
			.cancel();
	});

	it('should fail for timeout request', (done) => {
		var screen = new RequestScreen();
		screen.setTimeout(0);
		screen.load('/url')
			.catch((reason) => {
				assert.ok(reason.timeout);
				clearTimeout(id);
				done();
			});
		var id = setTimeout(() => this.requests[0].respond(200), 100);
	});

	it('should fail for invalid status code response', (done) => {
		new RequestScreen()
			.load('/url')
			.catch((error) => {
				assert.ok(error.invalidStatus);
				done();
			});
		this.requests[0].respond(404);
	});

	it('should fail for request errors response', (done) => {
		new RequestScreen()
			.load('/url')
			.catch((error) => {
				assert.ok(error.requestError);
				done();
			});
		this.requests[0].abort();
	});

	it('should form navigate force post method and request body wrapped in FormData', (done) => {
		globals.capturedFormElement = globals.document.createElement('form');
		var screen = new RequestScreen();
		screen.load('/url').then(() => {
			assert.strictEqual(RequestScreen.POST, screen.getRequest().method);
			assert.ok(screen.getRequest().requestBody instanceof FormData);
			globals.capturedFormElement = null;
			done();
		});
		this.requests[0].respond(200);
	});

	it('should not cache get requests on ie browsers', (done) => {
		UA.testUserAgent('MSIE'); // Simulates ie user agent
		var url = '/url';
		var screen = new RequestScreen();
		screen.load(url).then(() => {
			assert.notStrictEqual(url, screen.getRequest().url);
			assert.strictEqual(url, screen.getRequestPath());
			done();
		});
		this.requests[0].respond(200);
	});

	it('should not cache get requests on edge browsers', (done) => {
		UA.testUserAgent('Edge'); // Simulates edge user agent
		var url = '/url';
		var screen = new RequestScreen();
		screen.load(url).then(() => {
			assert.notStrictEqual(url, screen.getRequest().url);
			done();
		});
		this.requests[0].respond(200);
	});

});
