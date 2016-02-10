'use strict';

import dom from 'metal-dom';
import globals from '../../src/globals/globals';
import HtmlScreen from '../../src/screen/HtmlScreen';
import Surface from '../../src/surface/Surface';

describe('HtmlScreen', function() {

	beforeEach(function() {
		this.xhr = sinon.useFakeXMLHttpRequest();

		var requests = this.requests = [];

		this.xhr.onCreate = function(xhr) {
			requests.push(xhr);
		};

		// Prevent log messages from showing up in test output.
		sinon.stub(console, 'log');
	});

	afterEach(function() {
		this.xhr.restore();
		console.log.restore();
	});

	it('should get title selector', function() {
		var screen = new HtmlScreen();
		assert.strictEqual('title', screen.getTitleSelector());
		screen.setTitleSelector('div.title');
		assert.strictEqual('div.title', screen.getTitleSelector());
	});

	it('should returns loaded content', function(done) {
		var screen = new HtmlScreen();
		screen.load('/url').then((content) => {
			assert.strictEqual('content', content);
			done();
		});
		this.requests[0].respond(200, null, 'content');
	});

	it('should set title from response content', function(done) {
		var screen = new HtmlScreen();
		screen.load('/url').then(() => {
			assert.strictEqual('new', screen.getTitle());
			done();
		});
		this.requests[0].respond(200, null, '<title>new</title>');
	});

	it('should not set title from response content if not present', function(done) {
		var screen = new HtmlScreen();
		screen.load('/url').then(() => {
			assert.strictEqual(null, screen.getTitle());
			done();
		});
		this.requests[0].respond(200, null, '');
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
		screen.allocateVirtualDocumentForContent('<div id="surfaceId">surface</div>');
		assert.strictEqual('surface', screen.getSurfaceContent('surfaceId'));
		screen.allocateVirtualDocumentForContent('<div id="surfaceId">surface</div>');
		assert.strictEqual(undefined, screen.getSurfaceContent('surfaceIdInvalid'));
	});

	it('should extract surface content from response content default child if present', function() {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('<div id="surfaceId">static<div id="surfaceId-default">surface</div></div>');
		assert.strictEqual('surface', screen.getSurfaceContent('surfaceId'));
		screen.allocateVirtualDocumentForContent('<div id="surfaceId">static<div id="surfaceId-default">surface</div></div>');
		assert.strictEqual(undefined, screen.getSurfaceContent('surfaceIdInvalid'));
	});

	it('should release virtual document after activate', function() {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('');
		assert.ok(screen.virtualDocument);
		screen.activate();
		assert.ok(!screen.virtualDocument);
	});

	it('should set body id in virtual document to page body id', function() {
		var screen = new HtmlScreen();
		globals.document.body.id = 'bodyAsSurface';
		screen.allocateVirtualDocumentForContent('<body data-senna-surface>body</body>');
		screen.maybeSetBodyIdInVirtualDocument();
		assert.strictEqual('bodyAsSurface', screen.virtualDocument.querySelector('body').id);
	});

	it('should evaluate surface scripts', function(done) {
		enterDocumentSurfaceElement('surfaceId', '<script>window.sentinel=true;</script>');
		var surface = new Surface('surfaceId');
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('');
		assert.ok(!window.sentinel);
		screen.evaluateScripts({
			surfaceId: surface
		}).then(() => {
			assert.ok(window.sentinel);
			delete window.sentinel;
			exitDocumentSurfaceElement('surfaceId');
			done();
		});
	});

	it('should evaluate surface styles', function(done) {
		enterDocumentSurfaceElement('surfaceId', '<style id="temporaryStyle">body{background-color:rgb(0, 255, 0);}</style>');
		var surface = new Surface('surfaceId');
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('');
		screen.evaluateStyles({
			surfaceId: surface
		}).then(() => {
			assertComputedStyle('backgroundColor', 'rgb(0, 255, 0)');
			exitDocumentSurfaceElement('surfaceId');
			dom.exitDocument(document.getElementById('temporaryStyle'));
			done();
		});
	});

	it('should always evaluate tracked temporary scripts', function(done) {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('<script data-senna-track="temporary">window.sentinel=true;</script>');
		assert.ok(!window.sentinel);
		screen.evaluateScripts({})
			.then(() => {
				assert.ok(window.sentinel);
				delete window.sentinel;
				screen.allocateVirtualDocumentForContent('<script data-senna-track="temporary">window.sentinel=true;</script>');
				screen.evaluateScripts({})
					.then(() => {
						assert.ok(window.sentinel);
						delete window.sentinel;
						done();
					});
			});
	});

	it('should always evaluate tracked temporary styles', function(done) {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('<style id="temporaryStyle" data-senna-track="temporary">body{background-color:rgb(0, 255, 0);}</style>');
		screen.evaluateStyles({})
			.then(() => {
				assertComputedStyle('backgroundColor', 'rgb(0, 255, 0)');
				screen.allocateVirtualDocumentForContent('<style id="temporaryStyle" data-senna-track="temporary">body{background-color:rgb(255, 0, 0);}</style>');
				screen.evaluateStyles({})
					.then(() => {
						assertComputedStyle('backgroundColor', 'rgb(255, 0, 0)');
						dom.exitDocument(document.getElementById('temporaryStyle'));
						done();
					});
			});
	});

	it('should evaluate tracked permanent scripts only once', function(done) {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('<script id="permanentScriptKey" data-senna-track="permanent">window.sentinel=true;</script>');
		assert.ok(!window.sentinel);
		screen.evaluateScripts({})
			.then(() => {
				assert.ok(window.sentinel);
				delete window.sentinel;
				screen.allocateVirtualDocumentForContent('<script id="permanentScriptKey" data-senna-track="permanent">window.sentinel=true;</script>');
				screen.evaluateScripts({})
					.then(() => {
						assert.ok(!window.sentinel);
						done();
					});
			});
	});

	it('should evaluate tracked permanent styles only once', function(done) {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('<style id="permanentStyle" data-senna-track="permanent">body{background-color:rgb(0, 255, 0);}</style>');
		screen.evaluateStyles({})
			.then(() => {
				assertComputedStyle('backgroundColor', 'rgb(0, 255, 0)');
				screen.allocateVirtualDocumentForContent('<style id="permanentStyle" data-senna-track="permanent">body{background-color:rgb(255, 0, 0);}</style>');
				screen.evaluateStyles({})
					.then(() => {
						assertComputedStyle('backgroundColor', 'rgb(0, 255, 0)');
						dom.exitDocument(document.getElementById('permanentStyle'));
						done();
					});
			});
	});

});

function enterDocumentSurfaceElement(surfaceId, opt_content) {
	dom.enterDocument('<div id="' + surfaceId + '">' + (opt_content ? opt_content : '') + '</div>');
	return document.getElementById(surfaceId);
}

function exitDocumentSurfaceElement(surfaceId) {
	return dom.exitDocument(document.getElementById(surfaceId));
}

function assertComputedStyle(property, value) {
	assert.strictEqual(value, window.getComputedStyle(document.body, null)[property]);
}


