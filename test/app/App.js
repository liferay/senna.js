'use strict';

import dom from 'bower:metal/src/dom/dom';
import globals from '../../src/globals/globals';
import App from '../../src/app/App';
import Route from '../../src/route/Route';
import Screen from '../../src/screen/Screen';
import HtmlScreen from '../../src/screen/HtmlScreen';
import Surface from '../../src/surface/Surface';

describe('App', function() {

	it('should add route', function() {
		var app = new App();
		app.addRoutes(new Route('/path', Screen));
		var route = app.findRoute('/path');
		assert.ok(app.hasRoutes());
		assert.ok(route instanceof Route);
		assert.strictEqual('/path', route.getPath());
		assert.strictEqual(Screen, route.getHandler());
		app.dispose();
	});

	it('should add route from object', function() {
		var app = new App();
		app.addRoutes({
			path: '/path',
			handler: Screen
		});
		var route = app.findRoute('/path');
		assert.ok(app.hasRoutes());
		assert.ok(route instanceof Route);
		assert.strictEqual('/path', route.getPath());
		assert.strictEqual(Screen, route.getHandler());
		app.dispose();
	});

	it('should add route from array', function() {
		var app = new App();
		app.addRoutes([{
			path: '/path',
			handler: Screen
		}, new Route('/pathOther', Screen)]);
		var route = app.findRoute('/path');
		assert.ok(app.hasRoutes());
		assert.ok(route instanceof Route);
		assert.strictEqual('/path', route.getPath());
		assert.strictEqual(Screen, route.getHandler());
		var routeOther = app.findRoute('/pathOther');
		assert.ok(routeOther instanceof Route);
		assert.strictEqual('/pathOther', routeOther.getPath());
		assert.strictEqual(Screen, routeOther.getHandler());
		app.dispose();
	});

	it('should not find route for not registered paths', function() {
		var app = new App();
		app.addRoutes(new Route('/path', Screen));
		assert.strictEqual(null, app.findRoute('/pathOther'));
		app.dispose();
	});

	it('should not find route for urls with hashbang when navigate to same basepath', function() {
		var app = new App();
		app.addRoutes(new Route('/path', Screen));
		globals.window = {
			location: {
				pathname: '/path',
				search: ''
			}
		};
		assert.strictEqual(null, app.findRoute('/path#hashbang'));
		app.dispose();
		globals.window = window;
	});

	it('should find route for urls with hashbang for different basepath', function() {
		var app = new App();
		app.addRoutes(new Route('/pathOther', Screen));
		globals.window = {
			location: {
				pathname: '/path',
				search: ''
			}
		};
		assert.ok(app.findRoute('/pathOther#hashbang'));
		app.dispose();
		globals.window = window;
	});

	it('should add surface', function() {
		var app = new App();
		app.addSurfaces(new Surface('surfaceId'));
		assert.ok(app.surfaces.surfaceId);
		assert.strictEqual('surfaceId', app.surfaces.surfaceId.getId());
		app.dispose();
	});

	it('should add surface from surface id', function() {
		var app = new App();
		app.addSurfaces('surfaceId');
		assert.ok(app.surfaces.surfaceId);
		assert.strictEqual('surfaceId', app.surfaces.surfaceId.getId());
		app.dispose();
	});

	it('should add surface from array', function() {
		var app = new App();
		app.addSurfaces([new Surface('surfaceId'), 'surfaceIdOther']);
		assert.ok(app.surfaces.surfaceId);
		assert.ok(app.surfaces.surfaceIdOther);
		assert.strictEqual('surfaceId', app.surfaces.surfaceId.getId());
		assert.strictEqual('surfaceIdOther', app.surfaces.surfaceIdOther.getId());
		app.dispose();
	});

	it('should create screen instance to a route', function() {
		var app = new App();
		var screen = app.createScreenInstance('/path', new Route('/path', Screen));
		assert.ok(screen instanceof Screen);
		app.dispose();
	});

	it('should create screen instance to a route for Screen class child', function() {
		var app = new App();
		var screen = app.createScreenInstance('/path', new Route('/path', HtmlScreen));
		assert.ok(screen instanceof HtmlScreen);
		app.dispose();
	});

	it('should create screen instance to a route with function handler', function() {
		var app = new App();
		var stub = sinon.stub();
		var route = new Route('/path', stub);
		var screen = app.createScreenInstance('/path', route);
		assert.strictEqual(1, stub.callCount);
		assert.strictEqual(route, stub.args[0][0]);
		assert.strictEqual(undefined, stub.returnValues[0]);
		assert.ok(screen instanceof Screen);
		app.dispose();
	});

	it('should get same screen instance to a route', function() {
		var app = new App();
		var route = new Route('/path', Screen);
		var screen = app.createScreenInstance('/path', route);
		app.screens['/path'] = screen;
		assert.strictEqual(screen, app.createScreenInstance('/path', route));
		app.dispose();
	});

	it('should create different screen instance and inherit same cache when simulating navigate refresh', function() {
		var app = new App();
		var route = new Route('/path', HtmlScreen);
		var screen = app.createScreenInstance('/path', route);
		screen.addCache('<h1>content</h1>');
		app.screens['/path'] = screen;
		app.activePath = '/path';
		var screenRefresh = app.createScreenInstance('/path', route);
		assert.notStrictEqual(screen, screenRefresh);
		assert.strictEqual('<h1>content</h1>', screenRefresh.getCache());
		app.dispose();
	});

	it('should clear screen cache', function() {
		var app = new App();
		var screen = app.createScreenInstance('/path', new Route('/path', HtmlScreen));
		app.screens['/path'] = screen;
		app.clearScreensCache();
		assert.strictEqual(0, Object.keys(app.screens).length);
		app.dispose();
	});

	it('should clear screen cache and remove surfaces', function() {
		var app = new App();
		var surface = new Surface('surfaceId');
		surface.remove = sinon.stub();
		app.addSurfaces(surface);
		var screen = app.createScreenInstance('/path', new Route('/path', HtmlScreen));
		app.screens['/path'] = screen;
		app.clearScreensCache();
		assert.strictEqual(1, surface.remove.callCount);
		app.dispose();
	});

	it('should not clear screen cache for activePath', function() {
		var app = new App();
		var screen = app.createScreenInstance('/path', new Route('/path', HtmlScreen));
		app.screens['/path'] = screen;
		app.activePath = '/path';
		app.clearScreensCache();
		assert.strictEqual(1, Object.keys(app.screens).length);
		app.dispose();
	});

	it('should get default title', function() {
		var app = new App();
		assert.strictEqual('', app.getDefaultTitle());
		app.setDefaultTitle('title');
		assert.strictEqual('title', app.getDefaultTitle());
		app.dispose();
	});

	it('should get basepath', function() {
		var app = new App();
		assert.strictEqual('', app.getBasePath());
		app.setBasePath('/base');
		assert.strictEqual('/base', app.getBasePath());
		app.dispose();
	});

	it('should get update scroll position', function() {
		var app = new App();
		assert.strictEqual(true, app.getUpdateScrollPosition());
		app.setUpdateScrollPosition(false);
		assert.strictEqual(false, app.getUpdateScrollPosition());
		app.dispose();
	});

	it('should get loading css class', function() {
		var app = new App();
		assert.strictEqual('senna-loading', app.getLoadingCssClass());
		app.setLoadingCssClass('');
		assert.strictEqual('', app.getLoadingCssClass());
		app.dispose();
	});

	it('should get link selector', function() {
		var app = new App();
		assert.strictEqual('a:not([data-senna-off])', app.getLinkSelector());
		app.setLinkSelector('');
		assert.strictEqual('', app.getLinkSelector());
		app.dispose();
	});

	it('should get link selector', function() {
		var app = new App();
		assert.strictEqual('a:not([data-senna-off])', app.getLinkSelector());
		app.setLinkSelector('');
		assert.strictEqual('', app.getLinkSelector());
		app.dispose();
	});

	it('should get scroll position capturing delay', function() {
		var app = new App();
		assert.strictEqual(50, app.getScrollPositionCapturingDelay());
		app.setScrollPositionCapturingDelay(0);
		assert.strictEqual(0, app.getScrollPositionCapturingDelay());
		app.dispose();
	});

	it('should navigate emit startNavigate and endNavigate custom event', function(done) {
		var startNavigateStub = sinon.stub();
		var endNavigateStub = sinon.stub();
		var app = new App();
		app.addRoutes(new Route('/path', Screen));
		app.on('startNavigate', startNavigateStub);
		app.on('endNavigate', endNavigateStub);
		app.navigate('/path').then(function() {
			assert.strictEqual(1, startNavigateStub.callCount);
			assert.strictEqual('/path', startNavigateStub.args[0][0].path);
			assert.strictEqual(false, startNavigateStub.args[0][0].replaceHistory);
			assert.strictEqual(1, endNavigateStub.callCount);
			assert.strictEqual('/path', endNavigateStub.args[0][0].path);
			app.dispose();
			done();
		});
	});

	it('should navigate emit startNavigate and endNavigate custom event with replace history', function(done) {
		var startNavigateStub = sinon.stub();
		var endNavigateStub = sinon.stub();
		var app = new App();
		app.addRoutes(new Route('/path', Screen));
		app.on('startNavigate', startNavigateStub);
		app.on('endNavigate', endNavigateStub);
		app.navigate('/path', true).then(function() {
			assert.strictEqual(1, startNavigateStub.callCount);
			assert.strictEqual('/path', startNavigateStub.args[0][0].path);
			assert.strictEqual(true, startNavigateStub.args[0][0].replaceHistory);
			assert.strictEqual(1, endNavigateStub.callCount);
			assert.strictEqual('/path', endNavigateStub.args[0][0].path);
			app.dispose();
			done();
		});
	});

	it('should cancel navigate', function(done) {
		var app = new App();
		app.addRoutes(new Route('/path', Screen));
		app.on('endNavigate', function(payload) {
			assert.ok(payload.error instanceof Error);
		});
		app.navigate('/path').catch(function(reason) {
			assert.ok(reason instanceof Error);
			app.dispose();
			done();
		}).cancel();
	});

	it('should simulate refresh on navigate to the same path', function(done) {
		var app = new App();
		app.addRoutes(new Route('/path', Screen));
		app.once('startNavigate', function(payload) {
			assert.ok(!payload.replaceHistory);
		});
		app.navigate('/path').then(function() {
			app.once('startNavigate', function(payload) {
				assert.ok(payload.replaceHistory);
			});
			app.navigate('/path').then(function() {
				app.dispose();
				done();
			});
		});
	});

	it('should add loading css class on navigate', function(done) {
		var failIfNotContainsLoadingCssClass = function() {
			if (!globals.document.documentElement.classList.contains(app.getLoadingCssClass())) {
				assert.fail();
			}
		};
		var app = new App();
		app.addRoutes(new Route('/path', Screen));
		app.on('startNavigate', failIfNotContainsLoadingCssClass);
		app.on('endNavigate', failIfNotContainsLoadingCssClass);
		app.navigate('/path').then(function() {
			if (globals.document.documentElement.classList.contains(app.getLoadingCssClass())) {
				assert.fail();
			}
			app.dispose();
			done();
		});
	});

	it('should not navigate to unrouted paths', function(done) {
		var app = new App();
		app.on('endNavigate', function(payload) {
			assert.ok(payload.error instanceof Error);
		});
		app.navigate('/path', true).catch(function(reason) {
			assert.ok(reason instanceof Error);
			app.dispose();
			done();
		});
	});

	it('should store scroll position on page scroll', function(done) {
		showPageScrollbar();
		var app = new App();
		setTimeout(function() {
			assert.strictEqual(100, globals.window.history.state.scrollTop);
			assert.strictEqual(100, globals.window.history.state.scrollLeft);
			app.dispose();
			hidePageScrollbar();
			done();
		}, app.getScrollPositionCapturingDelay() * 2);
		globals.window.scrollTo(100, 100);
	});

	it('should not store scroll position during navigate', function(done) {
		var app = new App();
		app.addRoutes(new Route('/path', Screen));
		app.on('startNavigate', function() {
			app.onScroll_(); // Coverage
			assert.ok(!app.captureHistoryScrollPosition);
		});
		assert.ok(app.captureHistoryScrollPosition);
		app.navigate('/path').then(function() {
			assert.ok(app.captureHistoryScrollPosition);
			app.dispose();
			done();
		});
	});

	it('should update scroll position on navigate', function(done) {
		showPageScrollbar();
		var app = new App();
		app.addRoutes(new Route('/path1', Screen));
		app.addRoutes(new Route('/path2', Screen));
		app.navigate('/path1').then(function() {
			setTimeout(function() {
				app.navigate('/path2').then(function() {
					assert.strictEqual(0, window.pageXOffset);
					assert.strictEqual(0, window.pageYOffset);
					app.dispose();
					hidePageScrollbar();
					done();
				});
			}, app.getScrollPositionCapturingDelay() * 2);
			globals.window.scrollTo(100, 100);
		});
	});

	it('should not update scroll position on navigate if updateScrollPosition is disabled', function(done) {
		showPageScrollbar();
		var app = new App();
		app.setUpdateScrollPosition(false);
		app.addRoutes(new Route('/path1', Screen));
		app.addRoutes(new Route('/path2', Screen));
		app.navigate('/path1').then(function() {
			setTimeout(function() {
				app.navigate('/path2').then(function() {
					assert.strictEqual(100, window.pageXOffset);
					assert.strictEqual(100, window.pageYOffset);
					app.dispose();
					hidePageScrollbar();
					done();
				});
			}, app.getScrollPositionCapturingDelay() * 2);
			globals.window.scrollTo(100, 100);
		});
	});

	it('should restore scroll position on navigate back', function(done) {
		showPageScrollbar();
		var app = new App();
		app.addRoutes(new Route('/path1', Screen));
		app.addRoutes(new Route('/path2', Screen));
		app.navigate('/path1').then(function() {
			setTimeout(function() {
				app.navigate('/path2').then(function() {
					assert.strictEqual(0, window.pageXOffset);
					assert.strictEqual(0, window.pageYOffset);
					app.once('endNavigate', function() {
						assert.strictEqual(100, window.pageXOffset);
						assert.strictEqual(100, window.pageYOffset);
						app.dispose();
						hidePageScrollbar();
						done();
					});
					globals.window.history.back();
				});
			}, app.getScrollPositionCapturingDelay() * 2);
			globals.window.scrollTo(100, 100);
		});
	});

	it('should dispatch navigate to current path', function(done) {
		var currentPath = globals.window.location.pathname + globals.window.location.search + globals.window.location.hash;
		globals.window.history.replaceState({}, '', '/path1?foo=1#hash');
		var app = new App();
		app.addRoutes(new Route('/path', Screen));
		app.on('endNavigate', function(payload) {
			assert.strictEqual('/path1?foo=1#hash', payload.path);
			app.dispose();
			globals.window.history.replaceState({}, '', currentPath);
			done();
		});
		app.dispatch();
	});

	it('should not navigate if active screen forbid deactivate', function(done) {
		class NoNavigateScreen extends Screen {
			beforeDeactivate() {
				return true;
			}
		}
		var app = new App();
		app.addRoutes(new Route('/path1', NoNavigateScreen));
		app.addRoutes(new Route('/path2', Screen));
		app.navigate('/path1').then(function() {
			app.on('endNavigate', function(payload) {
				assert.ok(payload.error instanceof Error);
			});
			app.navigate('/path2').catch(function(reason) {
				assert.ok(reason instanceof Error);
				app.dispose();
				done();
			});
		});
	});

	it('should prefetch paths', function(done) {
		var app = new App();
		app.addRoutes(new Route('/path', Screen));
		app.prefetch('/path').then(function() {
			assert.ok(app.screens['/path'] instanceof Screen);
			app.dispose();
			done();
		});
	});

	it('should prefetch fail on navigate to unrouted paths', function(done) {
		var app = new App();
		app.on('endNavigate', function(payload) {
			assert.ok(payload.error instanceof Error);
		});
		app.prefetch('/path').catch(function(reason) {
			assert.ok(reason instanceof Error);
			app.dispose();
			done();
		});
	});

	it('should cancel prefetch', function(done) {
		var app = new App();
		app.addRoutes(new Route('/path', Screen));
		app.on('endNavigate', function(payload) {
			assert.ok(payload.error instanceof Error);
		});
		app.prefetch('/path').catch(function(reason) {
			assert.ok(reason instanceof Error);
			app.dispose();
			done();
		}).cancel();
	});

	it('should navigate when clicking on routed links', function() {
		var app = new App();
		app.addRoutes(new Route('/path', Screen));
		dom.triggerEvent(enterDocumentLinkElement('/path'), 'click');
		assert.ok(app.pendingNavigate);
		exitDocumentLinkElement();
		app.dispose();
	});

	it('should not navigate when clicking on external links', function() {
		var link = enterDocumentLinkElement('http://sennajs.com');
		var app = new App();
		dom.on(link, 'click', preventDefault);
		dom.triggerEvent(link, 'click');
		assert.strictEqual(null, app.pendingNavigate);
		exitDocumentLinkElement();
		app.dispose();
	});

	it('should not navigate when clicking on links outside basepath', function() {
		var link = enterDocumentLinkElement('/path');
		var app = new App();
		app.setBasePath('/base');
		dom.on(link, 'click', preventDefault);
		dom.triggerEvent(link, 'click');
		assert.strictEqual(null, app.pendingNavigate);
		exitDocumentLinkElement();
		app.dispose();
	});

	it('should not navigate when clicking on unrouted links', function() {
		var link = enterDocumentLinkElement('/path');
		var app = new App();
		dom.on(link, 'click', preventDefault);
		dom.triggerEvent(link, 'click');
		assert.strictEqual(null, app.pendingNavigate);
		exitDocumentLinkElement();
		app.dispose();
	});

	it('should not navigate when clicking on links with invalid mouse button or modifier keys pressed', function() {
		var link = enterDocumentLinkElement('/path');
		var app = new App();
		app.addRoutes(new Route('/path', Screen));
		dom.on(link, 'click', preventDefault);
		dom.triggerEvent(link, 'click', {
			altKey: true
		});
		dom.triggerEvent(link, 'click', {
			ctrlKey: true
		});
		dom.triggerEvent(link, 'click', {
			metaKey: true
		});
		dom.triggerEvent(link, 'click', {
			shiftKey: true
		});
		dom.triggerEvent(link, 'click', {
			button: true
		});
		assert.strictEqual(null, app.pendingNavigate);
		exitDocumentLinkElement();
		app.dispose();
	});

	it('should not navigate when navigate fails synchronously', function() {
		var link = enterDocumentLinkElement('/path');
		var app = new App();
		app.addRoutes(new Route('/path', Screen));
		app.navigate = function() {
			throw new Error();
		};
		dom.on(link, 'click', preventDefault);
		dom.triggerEvent(link, 'click');
		assert.strictEqual(null, app.pendingNavigate);
		exitDocumentLinkElement();
		app.dispose();
	});

	it('should reload page on navigate back to a routed page without history state', function(done) {
		var app = new App();
		app.reloadPage = sinon.stub();
		app.addRoutes(new Route('/path1', Screen));
		app.addRoutes(new Route('/path2', Screen));
		app.navigate('/path1').then(function() {
			window.history.replaceState(null, null, null);
			app.navigate('/path2').then(function() {
				dom.once(globals.window, 'popstate', function() {
					assert.strictEqual(1, app.reloadPage.callCount);
					app.dispose();
					done();
				});
				globals.window.history.back();
			});
		});
	});

	it('should not reload page on navigate back to a routed page with hashbang without history state', function(done) {
		var app = new App();
		app.reloadPage = sinon.stub();
		app.addRoutes(new Route('/path', Screen));
		app.navigate('/path#hash').then(function() {
			window.history.replaceState(null, null, null);
			app.navigate('/path').then(function() {
				dom.once(globals.window, 'popstate', function() {
					assert.strictEqual(0, app.reloadPage.callCount);
					app.dispose();
					done();
				});
				globals.window.history.back();
			});
		});
	});

	it('should not reload page on navigate back to a routed page without history state and skipLoadPopstate is active', function(done) {
		var app = new App();
		app.reloadPage = sinon.stub();
		app.addRoutes(new Route('/path1', Screen));
		app.addRoutes(new Route('/path2', Screen));
		app.navigate('/path1').then(function() {
			window.history.replaceState(null, null, null);
			app.navigate('/path2').then(function() {
				dom.once(globals.window, 'popstate', function() {
					assert.strictEqual(0, app.reloadPage.callCount);
					app.dispose();
					done();
				});
				app.skipLoadPopstate = true;
				globals.window.history.back();
			});
		});
	});

	it('should skipLoadPopstate before page is loaded', function(done) {
		var app = new App();
		app.onLoad_(); // Simulate
		assert.ok(app.skipLoadPopstate);
		setTimeout(function() {
			assert.ok(!app.skipLoadPopstate);
			app.dispose();
			done();
		}, 0);
	});

	it('should respect screen lifecycle on navigate', function(done) {
		class StubScreen1 extends Screen {
		}
		StubScreen1.prototype.activate = sinon.spy();
		StubScreen1.prototype.beforeDeactivate = sinon.spy();
		StubScreen1.prototype.deactivate = sinon.spy();
		StubScreen1.prototype.flip = sinon.spy();
		StubScreen1.prototype.load = sinon.spy();
		StubScreen1.prototype.disposeInternal = sinon.spy();
		class StubScreen2 extends Screen {
		}
		StubScreen2.prototype.activate = sinon.spy();
		StubScreen2.prototype.beforeDeactivate = sinon.spy();
		StubScreen2.prototype.deactivate = sinon.spy();
		StubScreen2.prototype.flip = sinon.spy();
		StubScreen2.prototype.load = sinon.spy();
		var app = new App();
		app.addRoutes(new Route('/path1', StubScreen1));
		app.addRoutes(new Route('/path2', StubScreen2));
		app.navigate('/path1').then(function() {
			app.navigate('/path2').then(function() {
				var lifecycleOrder = [
					StubScreen1.prototype.load,
					StubScreen1.prototype.flip,
					StubScreen1.prototype.activate,
					StubScreen1.prototype.beforeDeactivate,
					StubScreen2.prototype.load,
					StubScreen1.prototype.deactivate,
					StubScreen2.prototype.flip,
					StubScreen2.prototype.activate,
					StubScreen1.prototype.disposeInternal
				];
				for (var i = 1; i < lifecycleOrder.length - 1; i++) {
					assert.ok(lifecycleOrder[i - 1].calledBefore(lifecycleOrder[i]));
				}
				app.dispose();
				done();
			});
		});
	});

	it('should render surfaces', function(done) {
		class ContentScreen extends Screen {
			getSurfaceContent(surfaceId) {
				return surfaceId;
			}
			getId() {
				return 'screenId';
			}
		}
		var surface = new Surface('surfaceId');
		surface.addContent = sinon.stub();
		var app = new App();
		app.addRoutes(new Route('/path', ContentScreen));
		app.addSurfaces(surface);
		app.navigate('/path').then(function() {
			assert.strictEqual(1, surface.addContent.callCount);
			assert.strictEqual('screenId', surface.addContent.args[0][0]);
			assert.strictEqual('surfaceId', surface.addContent.args[0][1]);
			app.dispose();
			done();
		});
	});

});

function enterDocumentLinkElement(href) {
	dom.enterDocument('<a id="link" href="' + href + '">link</a>');
	return document.getElementById('link');
}

function exitDocumentLinkElement() {
	dom.exitDocument(document.getElementById('link'));
}

function preventDefault(event) {
	event.preventDefault();
}

function showPageScrollbar() {
	globals.document.documentElement.style.height = '9999px';
	globals.document.documentElement.style.width = '9999px';
}

function hidePageScrollbar() {
	globals.document.documentElement.style.height = '';
	globals.document.documentElement.style.width = '';
}
