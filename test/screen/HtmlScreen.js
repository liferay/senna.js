'use strict';

import HtmlScreen from '../../src/screen/HtmlScreen';

describe('HtmlScreen', function() {

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

	it('should get title selector', function() {
		var screen = new HtmlScreen();
		assert.strictEqual('title', screen.getTitleSelector());
		screen.setTitleSelector('div.title');
		assert.strictEqual('div.title', screen.getTitleSelector());
	});

	it('should set title from response content', function(done) {
		var screen = new HtmlScreen();
		screen.load('/url').then(() => {
			assert.strictEqual('new', screen.getTitle());
			done();
		});
		this.requests[0].respond(200, null, '<title>new</title>');
	});

	it('should cancel load request to an url', function(done) {
		var screen = new HtmlScreen();
		screen.load('/url')
			.catch(reason => {
				assert.ok(reason instanceof Error);
				done();
			}).cancel();
	});

	it('should extract surface content from response content', function() {
		var screen = new HtmlScreen();
		screen.resolveContentFromHtmlString('<div id="surfaceId">surface</div>');
		assert.strictEqual('surface', screen.getSurfaceContent('surfaceId'));
		screen.resolveContentFromHtmlString('<div id="surfaceId">surface</div>');
		assert.strictEqual(undefined, screen.getSurfaceContent('surfaceIdInvalid'));
	});

	it('should extract surface content from response content default child if present', function() {
		var screen = new HtmlScreen();
		screen.resolveContentFromHtmlString('<div id="surfaceId">static<div id="surfaceId-default">surface</div></div>');
		assert.strictEqual('surface', screen.getSurfaceContent('surfaceId'));
		screen.resolveContentFromHtmlString('<div id="surfaceId">static<div id="surfaceId-default">surface</div></div>');
		assert.strictEqual(undefined, screen.getSurfaceContent('surfaceIdInvalid'));
	});

});