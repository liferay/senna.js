'use strict';

import dom from 'metal-dom';
import globals from '../../src/globals/globals';
import HtmlScreen from '../../src/screen/HtmlScreen';
import Surface from '../../src/surface/Surface';
import UA from 'metal-useragent';
import Uri from 'metal-uri';

describe('HtmlScreen', function() {

	beforeEach(() => {
		var requests = this.requests = [];
		this.xhr = sinon.useFakeXMLHttpRequest();
		this.xhr.onCreate = (xhr) => {
			requests.push(xhr);
		};
		// Prevent log messages from showing up in test output.
		sinon.stub(console, 'log');
	});

	afterEach(() => {
		this.xhr.restore();
		console.log.restore();
	});

	it('should get title selector', () => {
		var screen = new HtmlScreen();
		assert.strictEqual('title', screen.getTitleSelector());
		screen.setTitleSelector('div.title');
		assert.strictEqual('div.title', screen.getTitleSelector());
	});

	it('should returns loaded content', (done) => {
		var screen = new HtmlScreen();
		screen.load('/url').then((content) => {
			assert.strictEqual('content', content);
			done();
		});
		this.requests[0].respond(200, null, 'content');
	});

	it('should set title from response content', (done) => {
		var screen = new HtmlScreen();
		screen.load('/url').then(() => {
			assert.strictEqual('new', screen.getTitle());
			done();
		});
		this.requests[0].respond(200, null, '<title>new</title>');
	});

	it('should not set title from response content if not present', (done) => {
		var screen = new HtmlScreen();
		screen.load('/url').then(() => {
			assert.strictEqual(null, screen.getTitle());
			done();
		});
		this.requests[0].respond(200, null, '');
	});

	it('should cancel load request to an url', (done) => {
		var screen = new HtmlScreen();
		screen.load('/url')
			.catch(reason => {
				assert.ok(reason instanceof Error);
				done();
			}).cancel();
	});

	it('should copy surface root node attributes from response content', (done) => {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('<html attributeA="valueA"><div id="surfaceId">surface</div></html>');
		screen.flip([]).then(() => {
			assert.strictEqual('valueA', document.documentElement.getAttribute('attributeA'));
			done();
		});
	});

	it('should extract surface content from response content', () => {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('<div id="surfaceId">surface</div>');
		assert.strictEqual('surface', screen.getSurfaceContent('surfaceId'));
		screen.allocateVirtualDocumentForContent('<div id="surfaceId">surface</div>');
		assert.strictEqual(undefined, screen.getSurfaceContent('surfaceIdInvalid'));
	});

	it('should extract surface content from response content default child if present', () => {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('<div id="surfaceId">static<div id="surfaceId-default">surface</div></div>');
		assert.strictEqual('surface', screen.getSurfaceContent('surfaceId'));
		screen.allocateVirtualDocumentForContent('<div id="surfaceId">static<div id="surfaceId-default">surface</div></div>');
		assert.strictEqual(undefined, screen.getSurfaceContent('surfaceIdInvalid'));
	});

	it('should release virtual document after activate', () => {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('');
		assert.ok(screen.virtualDocument);
		screen.activate();
		assert.ok(!screen.virtualDocument);
	});

	it('should set body id in virtual document to page body id', () => {
		var screen = new HtmlScreen();
		globals.document.body.id = 'bodyAsSurface';
		screen.allocateVirtualDocumentForContent('<body>body</body>');
		screen.assertSameBodyIdInVirtualDocument();
		assert.strictEqual('bodyAsSurface', screen.virtualDocument.querySelector('body').id);
	});

	it('should set body id in virtual document to page body id even when it was already set', () => {
		var screen = new HtmlScreen();
		globals.document.body.id = 'bodyAsSurface';
		screen.allocateVirtualDocumentForContent('<body id="serverId">body</body>');
		screen.assertSameBodyIdInVirtualDocument();
		assert.strictEqual('bodyAsSurface', screen.virtualDocument.querySelector('body').id);
	});

	it('should set body id in document and use the same in virtual document', () => {
		var screen = new HtmlScreen();
		globals.document.body.id = '';
		screen.allocateVirtualDocumentForContent('<body>body</body>');
		screen.assertSameBodyIdInVirtualDocument();
		assert.ok(globals.document.body.id);
		assert.strictEqual(globals.document.body.id, screen.virtualDocument.querySelector('body').id);
	});

	it('should evaluate surface scripts', (done) => {
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
			exitDocumentElement('surfaceId');
			done();
		});
	});

	it('should evaluate surface styles', (done) => {
		enterDocumentSurfaceElement('surfaceId', '<style id="temporaryStyle">body{background-color:rgb(0, 255, 0);}</style>');
		var surface = new Surface('surfaceId');
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('');
		screen.evaluateStyles({
			surfaceId: surface
		}).then(() => {
			assertComputedStyle('backgroundColor', 'rgb(0, 255, 0)');
			exitDocumentElement('surfaceId');
			done();
		});
	});

	it('should evaluate favicon', (done) => {
		enterDocumentSurfaceElement('surfaceId', '');
		var surface = new Surface('surfaceId');
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('<link rel="Shortcut Icon" href="/for/favicon.ico" />');
		screen.evaluateFavicon_().then(() => {
			var element = document.querySelector('link[rel="Shortcut Icon"]');
			var uri = new Uri(element.href);
			assert.strictEqual('/for/favicon.ico', uri.getPathname());
			exitDocumentElement('surfaceId');
			done();
		});
	});

	it('should always evaluate tracked favicon', (done) => {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('<link id="favicon" rel="Shortcut Icon" href="/for/favicon.ico" />');
		screen.evaluateFavicon_()
			.then(() => {
				assert.ok(document.querySelector('link[rel="Shortcut Icon"]'));
				screen.allocateVirtualDocumentForContent('<link id="favicon" rel="Shortcut Icon" href="/bar/favicon.ico" />');
				screen.evaluateFavicon_({})
					.then(() => {
						var element = document.querySelector('link[rel="Shortcut Icon"]');
						assert.ok(element);
						var uri = new Uri(element.href);
						exitDocumentElement('favicon');
						done();
					});
			});
	});

	it('should not force favicon to change whenever the href change when the browser is IE', (done) => {
		// This test will run only on IE
		if (!UA.isIe) {
			done();
		} else {
			enterDocumentSurfaceElement('surfaceId', '<link rel="Shortcut Icon" href="/bar/favicon.ico" />');
			var surface = new Surface('surfaceId');
			var screen = new HtmlScreen();
			screen.allocateVirtualDocumentForContent('<link rel="Shortcut Icon" href="/for/favicon.ico" />');
			screen.evaluateFavicon_().then(() => {
				var element = document.querySelector('link[rel="Shortcut Icon"]');
				var uri = new Uri(element.href);
				assert.strictEqual('/for/favicon.ico', uri.getPathname());
				assert.ok(uri.hasParameter('q') === false);
				exitDocumentElement('surfaceId');
				done();
			});
		}
	});

	it('should force favicon to change whenever change the href when the browser is not IE', (done) => {
		// This test will run on all browsers except in IE
		if (UA.isIe) {
			done();
		} else {
			enterDocumentSurfaceElement('surfaceId', '<link rel="Shortcut Icon" href="/bar/favicon.ico" />');
			var surface = new Surface('surfaceId');
			var screen = new HtmlScreen();
			screen.allocateVirtualDocumentForContent('<link rel="Shortcut Icon" href="/for/favicon.ico" />');
			screen.evaluateFavicon_().then(() => {
				var element = document.querySelector('link[rel="Shortcut Icon"]');
				var uri = new Uri(element.href);
				assert.strictEqual('/for/favicon.ico', uri.getPathname());
				assert.ok(uri.hasParameter('q'));
				exitDocumentElement('surfaceId');
				done();
			});
		}
	});

	it('should always evaluate tracked temporary scripts', (done) => {
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

	it('should always evaluate tracked temporary styles', (done) => {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('<style id="temporaryStyle" data-senna-track="temporary">body{background-color:rgb(0, 255, 0);}</style>');
		screen.evaluateStyles({})
			.then(() => {
				assertComputedStyle('backgroundColor', 'rgb(0, 255, 0)');
				screen.allocateVirtualDocumentForContent('<style id="temporaryStyle" data-senna-track="temporary">body{background-color:rgb(255, 0, 0);}</style>');
				screen.evaluateStyles({})
					.then(() => {
						assertComputedStyle('backgroundColor', 'rgb(255, 0, 0)');
						exitDocumentElement('temporaryStyle');
						done();
					});
			});
	});

	it('should append existing teporary styles with id in the same place as the reference', (done) => {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('<style id="temporaryStyle" data-senna-track="temporary">body{background-color:rgb(0, 255, 0);}</style>');
		screen.evaluateStyles({})
			.then(() => {
				document.head.appendChild(dom.buildFragment('<style id="mainStyle">body{background-color:rgb(255, 255, 255);}</style>'));
				assertComputedStyle('backgroundColor', 'rgb(255, 255, 255)');
				screen.allocateVirtualDocumentForContent('<style id="temporaryStyle" data-senna-track="temporary">body{background-color:rgb(255, 0, 0);}</style>');
				screen.evaluateStyles({})
					.then(() => {
						assertComputedStyle('backgroundColor', 'rgb(255, 255, 255)');
						exitDocumentElement('mainStyle');
						exitDocumentElement('temporaryStyle');
						done();
					});
			});
	});

	it('should evaluate tracked permanent scripts only once', (done) => {
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

	it('should evaluate tracked permanent styles only once', (done) => {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('<style id="permanentStyle" data-senna-track="permanent">body{background-color:rgb(0, 255, 0);}</style>');
		screen.evaluateStyles({})
			.then(() => {
				assertComputedStyle('backgroundColor', 'rgb(0, 255, 0)');
				screen.allocateVirtualDocumentForContent('<style id="permanentStyle" data-senna-track="permanent">body{background-color:rgb(255, 0, 0);}</style>');
				screen.evaluateStyles({})
					.then(() => {
						assertComputedStyle('backgroundColor', 'rgb(0, 255, 0)');
						exitDocumentElement('permanentStyle');
						done();
					});
			});
	});

	it('should remove from document tracked pending styles on screen dispose', (done) => {
		var screen = new HtmlScreen();
		document.head.appendChild(dom.buildFragment('<style id="mainStyle">body{background-color:rgb(255, 255, 255);}</style>'));
		screen.allocateVirtualDocumentForContent('<style id="temporaryStyle" data-senna-track="temporary">body{background-color:rgb(0, 255, 0);}</style>');
		screen.evaluateStyles({})
			.then(() => {
				assertComputedStyle('backgroundColor', 'rgb(255, 255, 255)');
				exitDocumentElement('mainStyle');
				done();
			});
		screen.dispose();
	});

	it('should clear pendingStyles after screen activates', (done) => {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('<style id="temporaryStyle" data-senna-track="temporary"></style>');
		screen.evaluateStyles({})
			.then(() => {
				assert.ok(!screen.pendingStyles);
				exitDocumentElement('temporaryStyle');
				done();
			});
		assert.ok(screen.pendingStyles);
		screen.activate();
	});

	it('should mutate temporary style hrefs to be unique on ie browsers', (done) => {
		// This test will run only on IE
		if (!UA.isIe) {
			done();
		} else {
			var screen = new HtmlScreen();

			screen.load('/url').then(() => {
				screen.evaluateStyles({})
					.then(() => {
						assert.ok(document.getElementById('testIEStlye').href.indexOf('?zx=') > -1);
						done();
					});
				screen.activate();
			});

			this.requests[0].respond(200, null, '<link id="testIEStlye" data-senna-track="temporary" rel="stylesheet" href="testIEStlye.css">');
		}
	});

	it('link elements should only be loaded once in IE', (done) => {
		// This test will run only on IE
		if (!UA.isIe) {
			done();
		} else {
			var screen = new HtmlScreen();
			window.sentinelLoadCount = 0;

			screen.load('/url').then(() => {
				var style = screen.virtualQuerySelectorAll_('#style')[0];
				style.addEventListener('load', () => {
					window.sentinelLoadCount++;
				});
				style.addEventListener('error', () => {
					window.sentinelLoadCount++;
				});

				screen.evaluateStyles({})
					.then(() => {
						assert.strictEqual(1, window.sentinelLoadCount);
						delete window.sentinelLoadCount;
						done();
					});
				screen.activate();
			});

			this.requests[0].respond(200, null, '<link id="style" data-senna-track="temporary" rel="stylesheet" href="/base/src/senna.js">');
		}
	});

	it('should have correct title', (done) => {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('<title>left</title>');
		screen.resolveTitleFromVirtualDocument();
		screen.flip([]).then(() => {
			assert.strictEqual('left', screen.getTitle());
			done();
		});
	});

	it('should have correct title when the title contains html entities', (done) => {
		var screen = new HtmlScreen();
		screen.allocateVirtualDocumentForContent('<title>left &amp; right</title>');
		screen.resolveTitleFromVirtualDocument();
		screen.flip([]).then(() => {
			assert.strictEqual('left & right', screen.getTitle());
			done();
		});
	});
});

function enterDocumentSurfaceElement(surfaceId, opt_content) {
	dom.enterDocument('<div id="' + surfaceId + '">' + (opt_content ? opt_content : '') + '</div>');
	return document.getElementById(surfaceId);
}

function exitDocumentElement(surfaceId) {
	return dom.exitDocument(document.getElementById(surfaceId));
}

function assertComputedStyle(property, value) {
	assert.strictEqual(value, window.getComputedStyle(document.body, null)[property]);
}


