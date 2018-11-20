'use strict';

import { dom, exitDocument } from 'metal-dom';
import { EventEmitter } from 'metal-events';
import CancellablePromise from 'metal-promise';
import globals from '../../src/globals/globals';
import utils from '../../src/utils/utils';
import App from '../../src/app/App';
import Route from '../../src/route/Route';
import Screen from '../../src/screen/Screen';
import HtmlScreen from '../../src/screen/HtmlScreen';
import Surface from '../../src/surface/Surface';

class StubScreen extends Screen {
}
StubScreen.prototype.activate = sinon.spy();
StubScreen.prototype.beforeDeactivate = sinon.spy();
StubScreen.prototype.deactivate = sinon.spy();
StubScreen.prototype.flip = sinon.spy();
StubScreen.prototype.load = sinon.stub().returns(CancellablePromise.resolve());
StubScreen.prototype.disposeInternal = sinon.spy();
StubScreen.prototype.evaluateStyles = sinon.spy();
StubScreen.prototype.evaluateScripts = sinon.spy();

describe('App', function() {
	before((done) => {
		// Prevent log messages from showing up in test output.
		sinon.stub(console, 'log');
		detectCanScrollIFrame(done);
		preventDOMException18();
	});

	beforeEach(() => {
		var requests = this.requests = [];
		globals.window = window;
		globals.capturedFormElement = undefined;
		globals.capturedFormButtonElement = undefined;
		this.xhr = sinon.useFakeXMLHttpRequest();
		this.xhr.onCreate = (xhr) => {
			requests.push(xhr);
		};

		const beforeunload = sinon.spy();
		window.onbeforeunload = beforeunload;
	});

	afterEach(() => {
		if (this.app && !this.app.isDisposed()) {
			this.app.dispose();
		}
		this.app = null;
		this.xhr.restore();
	});

	after(() => {
		console.log.restore();
		restorePreventDOMException18();
	});

	it('should add route', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		var route = this.app.findRoute('/path');
		assert.ok(this.app.hasRoutes());
		assert.ok(route instanceof Route);
		assert.strictEqual('/path', route.getPath());
		assert.strictEqual(Screen, route.getHandler());
	});

	it('should remove route', () => {
		this.app = new App();
		var route = new Route('/path', Screen);
		this.app.addRoutes(route);
		assert.ok(this.app.removeRoute(route));
	});

	it('should add route from object', () => {
		this.app = new App();
		this.app.addRoutes({
			path: '/path',
			handler: Screen
		});
		var route = this.app.findRoute('/path');
		assert.ok(this.app.hasRoutes());
		assert.ok(route instanceof Route);
		assert.strictEqual('/path', route.getPath());
		assert.strictEqual(Screen, route.getHandler());
	});

	it('should add route from array', () => {
		this.app = new App();
		this.app.addRoutes([{
			path: '/path',
			handler: Screen
		}, new Route('/pathOther', Screen)]);
		var route = this.app.findRoute('/path');
		assert.ok(this.app.hasRoutes());
		assert.ok(route instanceof Route);
		assert.strictEqual('/path', route.getPath());
		assert.strictEqual(Screen, route.getHandler());
		var routeOther = this.app.findRoute('/pathOther');
		assert.ok(routeOther instanceof Route);
		assert.strictEqual('/pathOther', routeOther.getPath());
		assert.strictEqual(Screen, routeOther.getHandler());
	});

	it('should not find route for not registered paths', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		assert.strictEqual(null, this.app.findRoute('/pathOther'));
	});

	it('should not allow navigation for urls with hashbang when navigating to same basepath', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		globals.window = {
			location: {
				hash: '',
				host: '',
				hostname: '',
				pathname: '/path',
				search: ''
			}
		};
		assert.strictEqual(false, this.app.canNavigate('/path#hashbang'));
	});

	it('should allow navigation for urls with hashbang when navigating to different basepath', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		globals.window = {
			location: {
				hash: '',
				host: '',
				hostname: '',
				pathname: '/path1',
				search: ''
			}
		};
		assert.strictEqual(true, this.app.canNavigate('/path#hashbang'));
	});

	it('should find route for urls with hashbang for different basepath', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/pathOther', Screen));
		globals.window = {
			location: {
				host: '',
				pathname: '/path',
				search: ''
			}
		};
		assert.ok(this.app.findRoute('/pathOther#hashbang'));
	});

	it('should find route for urls ending with or without slash', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/pathOther', Screen));
		globals.window = {
			location: {
				host: '',
				pathname: '/path/',
				search: ''
			}
		};
		assert.ok(this.app.findRoute('/pathOther'));
		assert.ok(this.app.findRoute('/pathOther/'));
	});

	it('should ignore query string on findRoute when ignoreQueryStringFromRoutePath is enabled', () => {
		this.app = new App();
		this.app.setIgnoreQueryStringFromRoutePath(true);
		this.app.addRoutes(new Route('/path', Screen));
		assert.ok(this.app.findRoute('/path?foo=1'));
	});

	it('should not ignore query string on findRoute when ignoreQueryStringFromRoutePath is disabled', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		assert.ok(!this.app.findRoute('/path?foo=1'));
	});

	it('should add surface', () => {
		this.app = new App();
		this.app.addSurfaces(new Surface('surfaceId'));
		assert.ok(this.app.surfaces.surfaceId);
		assert.strictEqual('surfaceId', this.app.surfaces.surfaceId.getId());
	});

	it('should add surface from surface id', () => {
		this.app = new App();
		this.app.addSurfaces('surfaceId');
		assert.ok(this.app.surfaces.surfaceId);
		assert.strictEqual('surfaceId', this.app.surfaces.surfaceId.getId());
	});

	it('should add surface from array', () => {
		this.app = new App();
		this.app.addSurfaces([new Surface('surfaceId'), 'surfaceIdOther']);
		assert.ok(this.app.surfaces.surfaceId);
		assert.ok(this.app.surfaces.surfaceIdOther);
		assert.strictEqual('surfaceId', this.app.surfaces.surfaceId.getId());
		assert.strictEqual('surfaceIdOther', this.app.surfaces.surfaceIdOther.getId());
	});

	it('should create screen instance to a route', () => {
		this.app = new App();
		var screen = this.app.createScreenInstance('/path', new Route('/path', Screen));
		assert.ok(screen instanceof Screen);
	});

	it('should create screen instance to a route for Screen class child', () => {
		this.app = new App();
		var screen = this.app.createScreenInstance('/path', new Route('/path', HtmlScreen));
		assert.ok(screen instanceof HtmlScreen);
	});

	it('should create screen instance to a route with function handler', () => {
		this.app = new App();
		var stub = sinon.stub();
		var route = new Route('/path', stub);
		var screen = this.app.createScreenInstance('/path', route);
		assert.strictEqual(1, stub.callCount);
		assert.strictEqual(route, stub.args[0][0]);
		assert.strictEqual(undefined, stub.returnValues[0]);
		assert.ok(screen instanceof Screen);
	});

	it('should get same screen instance to a route', () => {
		this.app = new App();
		var route = new Route('/path', Screen);
		var screen = this.app.createScreenInstance('/path', route);
		this.app.screens['/path'] = screen;
		assert.strictEqual(screen, this.app.createScreenInstance('/path', route));
	});

	it('should use same screen instance when simulating navigate refresh', () => {
		this.app = new App();
		var route = new Route('/path', HtmlScreen);
		var screen = this.app.createScreenInstance('/path', route);
		this.app.screens['/path'] = screen;
		this.app.activePath = '/path';
		this.app.activeScreen = screen;
		var screenRefresh = this.app.createScreenInstance('/path', route);
		assert.strictEqual(screen, screenRefresh);
	});

	it('should store screen for path with query string when ignoreQueryStringFromRoutePath is enabled', (done) => {
		class NoCacheScreen extends Screen {
			constructor() {
				super();
			}
		}

		this.app = new App();
		this.app.setIgnoreQueryStringFromRoutePath(true);
		this.app.addRoutes(new Route('/path', NoCacheScreen));

		this.app.navigate('/path?foo=1').then(() => {
			assert.ok(this.app.screens['/path?foo=1']);
			done();
		});
	});

	it('should create different screen instance when navigate to same path with different query strings if ignoreQueryStringFromRoutePath is enabled', (done) => {
		class NoCacheScreen extends Screen {
			constructor() {
				super();
			}
		}

		this.app = new App();
		this.app.setIgnoreQueryStringFromRoutePath(true);

		this.app.addRoutes(new Route('/path1', NoCacheScreen));
		this.app.addRoutes(new Route('/path2', NoCacheScreen));

		this.app.navigate('/path1?foo=1').then(() => {
			var screenFirstNavigate = this.app.screens['/path1?foo=1'];
			this.app.navigate('/path2').then(() => {
				this.app.navigate('/path1?foo=2').then(() => {
					assert.notStrictEqual(screenFirstNavigate, this.app.screens['/path1?foo=2']);
					done();
				});
			});
		});
	});

	it('should create different screen instance navigate when not cacheable', (done) => {
		class NoCacheScreen extends Screen {
			constructor() {
				super();
				this.cacheable = false;
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path1', NoCacheScreen));
		this.app.addRoutes(new Route('/path2', NoCacheScreen));
		this.app.navigate('/path1').then(() => {
			var screenFirstNavigate = this.app.screens['/path1'];
			this.app.navigate('/path2').then(() => {
				this.app.navigate('/path1').then(() => {
					assert.notStrictEqual(screenFirstNavigate, this.app.screens['/path1']);
					done();
				});
			});
		});
	});

	it('should use same screen instance navigate when is cacheable', (done) => {
		class CacheScreen extends Screen {
			constructor() {
				super();
				this.cacheable = true;
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path1', CacheScreen));
		this.app.addRoutes(new Route('/path2', CacheScreen));
		this.app.navigate('/path1').then(() => {
			var screenFirstNavigate = this.app.screens['/path1'];
			this.app.navigate('/path2').then(() => {
				this.app.navigate('/path1').then(() => {
					assert.strictEqual(screenFirstNavigate, this.app.screens['/path1']);
					done();
				});
			});
		});
	});

	it('should clear screen cache', () => {
		this.app = new App();
		this.app.screens['/path'] = this.app.createScreenInstance('/path', new Route('/path', HtmlScreen));
		this.app.clearScreensCache();
		assert.strictEqual(0, Object.keys(this.app.screens).length);
	});

	it('should clear all screen caches on app dispose', () => {
		this.app = new App();
		var screen1 = this.app.createScreenInstance('/path1', new Route('/path1', HtmlScreen));
		var screen2 = this.app.createScreenInstance('/path2', new Route('/path2', HtmlScreen));
		this.app.activePath = '/path1';
		this.app.activeScreen = screen1;
		this.app.screens['/path1'] = screen1;
		this.app.screens['/path2'] = screen2;
		this.app.dispose();
		assert.strictEqual(0, Object.keys(this.app.screens).length);
	});

	it('should clear screen cache and remove surfaces', () => {
		this.app = new App();
		var surface = new Surface('surfaceId');
		surface.remove = sinon.stub();
		this.app.addSurfaces(surface);
		this.app.screens['/path'] = this.app.createScreenInstance('/path', new Route('/path', HtmlScreen));
		this.app.clearScreensCache();
		assert.strictEqual(1, surface.remove.callCount);
	});

	it('should clear screen cache for activeScreen but not remove it', () => {
		this.app = new App();
		this.app.screens['/path'] = this.app.createScreenInstance('/path', new Route('/path', HtmlScreen));
		this.app.activePath = '/path';
		this.app.activeScreen = this.app.screens['/path'];
		this.app.clearScreensCache();
		assert.strictEqual(1, Object.keys(this.app.screens).length);
		assert.strictEqual(null, this.app.activeScreen.getCache());
	});

	it('should not to clear screen cache the being used in a pending navigation', (done) => {
		const event = new EventEmitter();
		class StubScreen extends Screen {
			constructor() {
				super();

				this.cacheable = true;
			}

			flip(surfaces) {
				super.flip(surfaces);
				event.emit('flip');
			}
		}

		const callback = () => {
			this.app.clearScreensCache();
			assert.strictEqual(1, Object.keys(this.app.screens).length);
			event.dispose();
			done();
		}

		var route = new Route('/path1', StubScreen);

		this.app = new App();
		this.app.addSurfaces(new Surface('surfaceId'));
		this.app.screens['/path1'] = this.app.createScreenInstance('/path1', route);
		this.app.addRoutes(route);
		this.app.navigate('/path1');
		event.on('flip', callback);
	});

	it('should get allow prevent navigate', () => {
		this.app = new App();
		assert.strictEqual(true, this.app.getAllowPreventNavigate());
		this.app.setAllowPreventNavigate(false);
		assert.strictEqual(false, this.app.getAllowPreventNavigate());
	});

	it('should get default title', () => {
		globals.document.title = 'default';
		this.app = new App();
		assert.strictEqual('default', this.app.getDefaultTitle());
		this.app.setDefaultTitle('title');
		assert.strictEqual('title', this.app.getDefaultTitle());
	});

	it('should get basepath', () => {
		this.app = new App();
		assert.strictEqual('', this.app.getBasePath());
		this.app.setBasePath('/base');
		assert.strictEqual('/base', this.app.getBasePath());
	});

	it('should get update scroll position', () => {
		this.app = new App();
		assert.strictEqual(true, this.app.getUpdateScrollPosition());
		this.app.setUpdateScrollPosition(false);
		assert.strictEqual(false, this.app.getUpdateScrollPosition());
	});

	it('should get loading css class', () => {
		this.app = new App();
		assert.strictEqual('senna-loading', this.app.getLoadingCssClass());
		this.app.setLoadingCssClass('');
		assert.strictEqual('', this.app.getLoadingCssClass());
	});

	it('should get form selector', () => {
		this.app = new App();
		assert.strictEqual('form[enctype="multipart/form-data"]:not([data-senna-off])', this.app.getFormSelector());
		this.app.setFormSelector('');
		assert.strictEqual('', this.app.getFormSelector());
	});

	it('should get link selector', () => {
		this.app = new App();
		assert.strictEqual('a:not([data-senna-off]):not([target="_blank"])', this.app.getLinkSelector());
		this.app.setLinkSelector('');
		assert.strictEqual('', this.app.getLinkSelector());
	});

	it('should test if can navigate to url', () => {
		this.app = new App();
		globals.window = {
			history: {},
			location: {
				host: 'localhost',
				hostname: 'localhost',
				pathname: '/path',
				search: ''
			}
		};
		this.app.setBasePath('/base');
		this.app.addRoutes([new Route('/', Screen), new Route('/path', Screen)]);
		assert.ok(this.app.canNavigate('http://localhost/base/'));
		assert.ok(this.app.canNavigate('http://localhost/base'));
		assert.ok(this.app.canNavigate('http://localhost/base/path'));
		assert.ok(!this.app.canNavigate('http://localhost/base/path1'));
		assert.ok(!this.app.canNavigate('http://localhost/path'));
		assert.ok(!this.app.canNavigate('http://external/path'));
		assert.ok(!this.app.canNavigate('tel:+0101010101'));
		assert.ok(!this.app.canNavigate('mailto:contact@sennajs.com'));
	});

	it('should test if can navigate to url with base path ending in "/"', () => {
		this.app = new App();
		globals.window = {
			history: {},
			location: {
				host: 'localhost',
				hostname: 'localhost',
				pathname: '/path',
				search: ''
			}
		};
		this.app.setBasePath('/base/');
		this.app.addRoutes([new Route('/', Screen), new Route('/path', Screen)]);
		assert.ok(this.app.canNavigate('http://localhost/base/'));
		assert.ok(this.app.canNavigate('http://localhost/base'));
		assert.ok(this.app.canNavigate('http://localhost/base/path'));
		assert.ok(!this.app.canNavigate('http://localhost/base/path1'));
		assert.ok(!this.app.canNavigate('http://localhost/path'));
		assert.ok(!this.app.canNavigate('http://external/path'));
	});

	it('should be able to navigate to route that ends with "/"', () => {
		this.app = new App();
		globals.window = {
			history: {},
			location: {
				host: 'localhost',
				hostname: 'localhost',
				pathname: '/path',
				search: ''
			}
		};
		this.app.addRoutes([new Route('/path/', Screen), new Route('/path/(\\d+)/', Screen)]);
		assert.ok(this.app.canNavigate('http://localhost/path'));
		assert.ok(this.app.canNavigate('http://localhost/path/'));
		assert.ok(this.app.canNavigate('http://localhost/path/123'));
		assert.ok(this.app.canNavigate('http://localhost/path/123/'));
	});

	it('should detect a navigation to different port and refresh page', () => {
		this.app = new App();
		globals.window = {
			history: {},
			location: {
				host: 'localhost:8080',
				pathname: '/path',
				search: ''
			}
		};
		this.app.addRoutes([new Route('/path/', Screen), new Route('/path/(\\d+)/', Screen)]);
		assert.isFalse(this.app.canNavigate('http://localhost:9080/path'));
		assert.isFalse(this.app.canNavigate('http://localhost:9081/path/'));
		assert.isFalse(this.app.canNavigate('http://localhost:9082/path/123'));
		assert.isFalse(this.app.canNavigate('http://localhost:9083/path/123/'));
	});

	it('should be able to navigate to a path using default protocol port', () => {
		this.app = new App();
		globals.window = {
			history: {},
			location: {
				host: 'localhost',
				pathname: '/path',
				search: ''
			}
		};
		this.app.addRoutes([new Route('/path/', Screen), new Route('/path/(\\d+)/', Screen)]);
		assert.isTrue(this.app.canNavigate('http://localhost:80/path'));
		assert.isTrue(this.app.canNavigate('http://localhost:80/path/'));
		assert.isTrue(this.app.canNavigate('http://localhost:80/path/123'));
		assert.isTrue(this.app.canNavigate('http://localhost:80/path/123/'));
	});

	it('should store proper senna state after navigate', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.navigate('/path').then(() => {
			const state = globals.window.history.state;
			assert.equal(state.path, '/path');
			assert.equal(state.redirectPath, '/path');
			assert.equal(state.scrollLeft, 0);
			assert.equal(state.scrollTop, 0);
			assert.isFalse(state.form);
			assert.ok(state.referrer);
			assert.ok(state.senna);
			done();
		});
	});

	it('should navigate emit startNavigate and endNavigate custom event', (done) => {
		var startNavigateStub = sinon.stub();
		var endNavigateStub = sinon.stub();
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('startNavigate', startNavigateStub);
		this.app.on('endNavigate', endNavigateStub);
		this.app.navigate('/path').then(() => {
			assert.strictEqual(1, startNavigateStub.callCount);
			assert.strictEqual('/path', startNavigateStub.args[0][0].path);
			assert.strictEqual(false, startNavigateStub.args[0][0].replaceHistory);
			assert.strictEqual(1, endNavigateStub.callCount);
			assert.strictEqual('/path', endNavigateStub.args[0][0].path);
			done();
		});
	});

	it('should navigate emit startNavigate and endNavigate custom event with replace history', (done) => {
		var startNavigateStub = sinon.stub();
		var endNavigateStub = sinon.stub();
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('startNavigate', startNavigateStub);
		this.app.on('endNavigate', endNavigateStub);
		this.app.navigate('/path', true).then(() => {
			assert.strictEqual(1, startNavigateStub.callCount);
			assert.strictEqual('/path', startNavigateStub.args[0][0].path);
			assert.strictEqual(true, startNavigateStub.args[0][0].replaceHistory);
			assert.strictEqual(1, endNavigateStub.callCount);
			assert.strictEqual('/path', endNavigateStub.args[0][0].path);
			done();
		});
	});

	it('should navigate overwrite event.path on beforeNavigate custom event', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.on('beforeNavigate', (event) => {
			event.path = '/path1';
		});
		this.app.navigate('/path').then(() => {
			assert.strictEqual('/path1', globals.window.location.pathname);
			done();
		});
	});

	it('should cancel navigate', (done) => {
		var stub = sinon.stub();
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('endNavigate', (payload) => {
			assert.ok(payload.error instanceof Error);
			stub();
		});
		this.app.navigate('/path').catch((reason) => {
			assert.ok(reason instanceof Error);
			assert.strictEqual(1, stub.callCount);
			done();
		}).cancel();
	});

	it('should clear pendingNavigate after navigate', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.navigate('/path').then(() => {
			assert.ok(!this.app.pendingNavigate);
			done();
		});
		assert.ok(this.app.pendingNavigate);
	});

	it('should wait for pendingNavigate if navigate to same path', (done) => {
		class CacheScreen extends Screen {
			constructor() {
				super();
				this.cacheable = true;
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path', CacheScreen));
		this.app.navigate('/path').then(() => {
			var pendingNavigate1 = this.app.navigate('/path');
			var pendingNavigate2 = this.app.navigate('/path');
			assert.ok(pendingNavigate1);
			assert.ok(pendingNavigate2);
			assert.strictEqual(pendingNavigate1, pendingNavigate2);
			done();
		});
	});

	it('should navigate back when clicking browser back button', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.navigate('/path1')
			.then(() => this.app.navigate('/path2'))
			.then(() => {
				var activeScreen = this.app.activeScreen;
				assert.strictEqual('/path2', globals.window.location.pathname);
				this.app.once('endNavigate', () => {
					assert.strictEqual('/path1', globals.window.location.pathname);
					assert.notStrictEqual(activeScreen, this.app.activeScreen);
					done();
				});
				globals.window.history.back();
			});
	});

	it('should not navigate back on a hash change', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.navigate('/path1')
			.then(() => this.app.navigate('/path1#hash'))
			.then(() => {
				var startNavigate = sinon.stub();
				this.app.on('startNavigate', startNavigate);
				dom.once(globals.window, 'popstate', () => {
					assert.strictEqual(0, startNavigate.callCount);
					done();
				});
				globals.window.history.back();
			});
	});

	it('should only call beforeNavigate when waiting for pendingNavigate if navigate to same path', (done) => {
		class CacheScreen extends Screen {
			constructor() {
				super();
				this.cacheable = true;
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path', CacheScreen));
		this.app.navigate('/path').then(() => {
			this.app.navigate('/path');
			var beforeNavigate = sinon.stub();
			var startNavigate = sinon.stub();
			this.app.on('beforeNavigate', beforeNavigate);
			this.app.on('startNavigate', startNavigate);
			this.app.navigate('/path');
			assert.strictEqual(1, beforeNavigate.callCount);
			assert.strictEqual(0, startNavigate.callCount);
			done();
		});
	});

	it('should not wait for pendingNavigate if navigate to different path', (done) => {
		class CacheScreen extends Screen {
			constructor() {
				super();
				this.cacheable = true;
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path1', CacheScreen));
		this.app.addRoutes(new Route('/path2', CacheScreen));
		this.app.navigate('/path1')
			.then(() => this.app.navigate('/path2'))
			.then(() => {
				var pendingNavigate1 = this.app.navigate('/path1');
				var pendingNavigate2 = this.app.navigate('/path2');
				assert.ok(pendingNavigate1);
				assert.ok(pendingNavigate2);
				assert.notStrictEqual(pendingNavigate1, pendingNavigate2);
				done();
			});
	});

	it('should simulate refresh on navigate to the same path', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.once('startNavigate', (payload) => {
			assert.ok(!payload.replaceHistory);
		});
		this.app.navigate('/path').then(() => {
			this.app.once('startNavigate', (payload) => {
				assert.ok(payload.replaceHistory);
			});
			this.app.navigate('/path').then(() => {
				done();
			});
		});
	});

	it('should add loading css class on navigate', (done) => {
		var containsLoadingCssClass = () => {
			return globals.document.documentElement.classList.contains(this.app.getLoadingCssClass());
		};
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('startNavigate', () => assert.ok(containsLoadingCssClass()));
		this.app.on('endNavigate', () => {
			assert.ok(!containsLoadingCssClass());
			done();
		});
		this.app.navigate('/path').then(() => assert.ok(!containsLoadingCssClass()));
	});

	it('should not remove loading css class on navigate if there is pending navigate', (done) => {
		var containsLoadingCssClass = () => {
			return globals.document.documentElement.classList.contains(this.app.getLoadingCssClass());
		};
		this.app = new App();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.once('startNavigate', () => {
			this.app.once('startNavigate', () => assert.ok(containsLoadingCssClass()));
			this.app.once('endNavigate', () => assert.ok(containsLoadingCssClass()));
			this.app.navigate('/path2').then(() => {
				assert.ok(!containsLoadingCssClass());
				done();
			});
		});
		this.app.navigate('/path1');
	});

	it('should not navigate to unrouted paths', (done) => {
		this.app = new App();
		this.app.on('endNavigate', (payload) => {
			assert.ok(payload.error instanceof Error);
		});
		this.app.navigate('/path', true).catch((reason) => {
			assert.ok(reason instanceof Error);
			done();
		});
	});

	it('should store scroll position on page scroll', (done) => {
		if (!canScrollIFrame_) {
			done();
			return;
		}

		showPageScrollbar();
		this.app = new App();
		setTimeout(() => {
			assert.strictEqual(100, globals.window.history.state.scrollTop);
			assert.strictEqual(100, globals.window.history.state.scrollLeft);
			hidePageScrollbar();
			done();
		}, 300);
		globals.window.scrollTo(100, 100);
	});

	it('should not store page scroll position during navigate', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('startNavigate', () => {
			this.app.onScroll_(); // Coverage
			assert.ok(!this.app.captureScrollPositionFromScrollEvent);
		});
		assert.ok(this.app.captureScrollPositionFromScrollEvent);
		this.app.navigate('/path').then(() => {
			assert.ok(this.app.captureScrollPositionFromScrollEvent);
			done();
		});
	});

	it('should update scroll position on navigate', (done) => {
		if (!canScrollIFrame_) {
			done();
			return;
		}

		showPageScrollbar();
		this.app = new App();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.navigate('/path1').then(() => {
			setTimeout(() => {
				this.app.navigate('/path2').then(() => {
					assert.strictEqual(0, window.pageXOffset);
					assert.strictEqual(0, window.pageYOffset);
					hidePageScrollbar();
					done();
				});
			}, 300);
			globals.window.scrollTo(100, 100);
		});
	});

	it('should not update scroll position on navigate if updateScrollPosition is disabled', (done) => {
		if (!canScrollIFrame_) {
			done();
			return;
		}

		showPageScrollbar();
		this.app = new App();
		this.app.setUpdateScrollPosition(false);
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.navigate('/path1').then(() => {
			setTimeout(() => {
				this.app.navigate('/path2').then(() => {
					assert.strictEqual(100, window.pageXOffset);
					assert.strictEqual(100, window.pageYOffset);
					hidePageScrollbar();
					done();
				});
			}, 100);
			globals.window.scrollTo(100, 100);
		});
	});

	it('should restore scroll position on navigate back', (done) => {
		if (!canScrollIFrame_) {
			done();
			return;
		}

		showPageScrollbar();
		this.app = new App();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.navigate('/path1').then(() => {
			setTimeout(() => {
				this.app.navigate('/path2').then(() => {
					assert.strictEqual(0, window.pageXOffset);
					assert.strictEqual(0, window.pageYOffset);
					this.app.once('endNavigate', () => {
						assert.strictEqual(100, window.pageXOffset);
						assert.strictEqual(100, window.pageYOffset);
						hidePageScrollbar();
						done();
					});
					globals.window.history.back();
				});
			}, 300);
			globals.window.scrollTo(100, 100);
		});
	});

	it('should dispatch navigate to current path', (done) => {
		globals.window.history.replaceState({}, '', '/path1?foo=1#hash');
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('endNavigate', (payload) => {
			assert.strictEqual('/path1?foo=1#hash', payload.path);
			globals.window.history.replaceState({}, '', utils.getCurrentBrowserPath());
			done();
		});
		this.app.dispatch();
	});

	it('should prevent navigation when beforeDeactivate returns "true"', (done) => {
		class NoNavigateScreen extends Screen {
			beforeDeactivate() {
				return true;
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path1', NoNavigateScreen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.navigate('/path1').then(() => {
			this.app.on('endNavigate', (payload) => {
				assert.ok(payload.error instanceof Error);
			});
			this.app.navigate('/path2').catch((reason) => {
				assert.ok(reason instanceof Error);
				done();
			});
		});
	});

	it('should prevent navigation when beforeDeactivate resolves to "true"', (done) => {
		class NoNavigateScreen extends Screen {
			beforeDeactivate() {
				return new CancellablePromise(resolve => {
					resolve(true);
				});
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path1', NoNavigateScreen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.navigate('/path1').then(() => {
			this.app.on('endNavigate', (payload) => {
				assert.ok(payload.error instanceof Error);
			});
			this.app.navigate('/path2').catch((reason) => {
				assert.ok(reason instanceof Error);
				done();
			});
		});
	});

	it('should prevent navigation when beforeActivate returns "true"', (done) => {
		class NoNavigateScreen extends Screen {
			beforeActivate() {
				return true;
			}
		}

		this.app = new App();
		this.app.addRoutes(new Route('/path', NoNavigateScreen));
		this.app.on('endNavigate', (payload) => {
			assert.ok(payload.error instanceof Error);
		});
		this.app.navigate('/path')
			.then(() => assert.fail())
			.catch((reason) => {
				assert.ok(reason instanceof Error);
				assert.equal(reason.message, 'Cancelled by next screen');

				done();
			});
	});

	it('should prevent navigation when beforeActivate promise resolves to "true"', (done) => {
		class NoNavigateScreen extends Screen {
			beforeActivate() {
				return new CancellablePromise(resolve => {
					resolve(true);
				});
			}
		}

		this.app = new App();
		this.app.addRoutes(new Route('/path', NoNavigateScreen));
		this.app.on('endNavigate', (payload) => {
			assert.ok(payload.error instanceof Error);
		});
		this.app.navigate('/path')
			.then(() => assert.fail())
			.catch((reason) => {
				assert.ok(reason instanceof Error);
				assert.equal(reason.message, 'Cancelled by next screen');

				done();
			});
	});

	it('should prefetch paths', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.prefetch('/path').then(() => {
			assert.ok(this.app.screens['/path'] instanceof Screen);
			done();
		});
	});

	it('should prefetch fail on navigate to unrouted paths', (done) => {
		this.app = new App();
		this.app.on('endNavigate', (payload) => {
			assert.ok(payload.error instanceof Error);
		});
		this.app.prefetch('/path').catch((reason) => {
			assert.ok(reason instanceof Error);
			done();
		});
	});

	it('should cancel prefetch', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('endNavigate', (payload) => {
			assert.ok(payload.error instanceof Error);
		});
		this.app.prefetch('/path').catch((reason) => {
			assert.ok(reason instanceof Error);
			done();
		}).cancel();
	});

	it('should navigate when clicking on routed links', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		dom.triggerEvent(enterDocumentLinkElement('/path'), 'click');
		assert.ok(this.app.pendingNavigate);
		exitDocumentLinkElement();
	});

	it('should not navigate when clicking on target blank links', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		let link = enterDocumentLinkElement('/path');
		link.setAttribute('target', '_blank');
		link.addEventListener('click', event => event.preventDefault());
		dom.triggerEvent(link, 'click');
		exitDocumentLinkElement();
		assert.strictEqual(this.app.pendingNavigate, null);
	});

	it('should pass original event object to "beforeNavigate" when a link is clicked', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('beforeNavigate', (data) => {
			assert.ok(data.event);
			assert.equal('click', data.event.type);
		});
		dom.triggerEvent(enterDocumentLinkElement('/path'), 'click');
		exitDocumentLinkElement();

		assert.notEqual('/path', window.location.pathname);
	});

	it('should prevent navigation on both senna and the browser via beforeNavigate', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/preventedPath', Screen));
		this.app.on('beforeNavigate', (data, event) => {
			data.event.preventDefault();
			event.preventDefault();
		});
		dom.triggerEvent(enterDocumentLinkElement('/preventedPath'), 'click');
		exitDocumentLinkElement();

		assert.notEqual('/preventedPath', window.location.pathname);
	});

	it('should not navigate when clicking on external links', () => {
		var link = enterDocumentLinkElement('http://sennajs.com');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		dom.on(link, 'click', preventDefault);
		dom.triggerEvent(link, 'click');
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocumentLinkElement();
	});

	it('should not navigate when clicking on links outside basepath', () => {
		var link = enterDocumentLinkElement('/path');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		this.app.setBasePath('/base');
		dom.on(link, 'click', preventDefault);
		dom.triggerEvent(link, 'click');
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocumentLinkElement();
	});

	it('should not navigate when clicking on unrouted links', () => {
		var link = enterDocumentLinkElement('/path');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		dom.on(link, 'click', preventDefault);
		dom.triggerEvent(link, 'click');
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocumentLinkElement();
	});

	it('should not navigate when clicking on links with invalid mouse button or modifier keys pressed', () => {
		var link = enterDocumentLinkElement('/path');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		this.app.addRoutes(new Route('/path', Screen));
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
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocumentLinkElement();
	});

	it('should not navigate when navigate fails synchronously', () => {
		var link = enterDocumentLinkElement('/path');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		this.app.addRoutes(new Route('/path', Screen));
		this.app.navigate = () => {
			throw new Error();
		};
		dom.on(link, 'click', preventDefault);
		dom.triggerEvent(link, 'click');
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocumentLinkElement();
	});

	it('should reload page on navigate back to a routed page without history state', (done) => {
		this.app = new App();
		this.app.reloadPage = sinon.stub();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.navigate('/path1').then(() => {
			window.history.replaceState(null, null, null);
			this.app.navigate('/path2').then(() => {
				dom.once(globals.window, 'popstate', () => {
					assert.strictEqual(1, this.app.reloadPage.callCount);
					done();
				});
				globals.window.history.back();
			});
		});
	});

	it('should be able to update referrer when Screen history state returns null', (done) => {
		class NullStateScreen extends Screen {
			beforeUpdateHistoryState() {
				return null;
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path1', NullStateScreen));
		this.app.navigate('/path1').then(() => {
			this.app.navigate('/path1#hash').then(() => {
				dom.once(globals.window, 'popstate', () => {
					assert.strictEqual('/path1', utils.getCurrentBrowserPath(document.referrer));
					done();
				});
				globals.window.history.back();
			});
		});
	});

	it('should not reload page on navigate back to a routed page with same path containing hashbang without history state', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.reloadPage = sinon.stub();
		this.app.navigate('/path').then(() => {
			globals.window.location.hash = 'hash1';
			window.history.replaceState(null, null, null);
			this.app.navigate('/path').then(() => {
				dom.once(globals.window, 'popstate', () => {
					assert.strictEqual(0, this.app.reloadPage.callCount);
					done();
				});
				globals.window.history.back();
			});
		});
	});

	it('should reload page on navigate back to a routed page with different path containing hashbang without history state', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.reloadPage = sinon.stub();
		this.app.navigate('/path1').then(() => {
			globals.window.location.hash = 'hash1';
			window.history.replaceState(null, null, null);
			this.app.navigate('/path2').then(() => {
				dom.once(globals.window, 'popstate', () => {
					assert.strictEqual(1, this.app.reloadPage.callCount);
					done();
				});
				globals.window.history.back();
			});
		});
	});

	it('should not reload page on clicking links with same path containing different hashbang without history state', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.reloadPage = sinon.stub();
		window.history.replaceState(null, null, '/path#hash1');
		dom.once(globals.window, 'popstate', () => {
			assert.strictEqual(0, this.app.reloadPage.callCount);
			done();
		});
		dom.triggerEvent(globals.window, 'popstate');
	});

	it('should not navigate on clicking links when onbeforeunload returns truthy value', () => {
		const beforeunload = sinon.spy();
		window.onbeforeunload = beforeunload;
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		let link = enterDocumentLinkElement('/path');
		dom.triggerEvent(link, 'click');
		exitDocumentLinkElement();
		assert.strictEqual(1, beforeunload.callCount);
	});

	it('should not navigate back to the previous page on navigate back when onbeforeunload returns a truthy value', (done) => {
		const beforeunload = sinon.spy();
		window.onbeforeunload = beforeunload;
		this.app = new App();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.navigate('/path1').then(() => {
			this.app.navigate('/path2').then(() => {
				globals.window.history.back();
				// assumes that the path must remain the same
				assert.strictEqual('/path2', this.app.activePath);
				assert.strictEqual(1, beforeunload.callCount);
				done();
			});
		});
	});

	it('should resposition scroll to hashed anchors on hash popstate', (done) => {
		if (!canScrollIFrame_) {
			done();
			return;
		}

		showPageScrollbar();
		var link = enterDocumentLinkElement('/path');
		link.style.position = 'absolute';
		link.style.top = '1000px';
		link.style.left = '1000px';
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.navigate('/path').then(() => {
			globals.window.location.hash = 'link';
			window.history.replaceState(null, null, null);
			globals.window.location.hash = 'other';
			window.history.replaceState(null, null, null);
			dom.once(globals.window, 'popstate', () => {
				assert.strictEqual(1000, window.pageXOffset);
				assert.strictEqual(1000, window.pageYOffset);
				exitDocumentLinkElement();
				hidePageScrollbar();

				dom.once(globals.window, 'popstate', () => {
					done();
				});
				globals.window.history.back();
			});
			globals.window.history.back();
		});
	});

	it('should navigate when submitting routed forms', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		const form = enterDocumentFormElement('/path', 'post');
		dom.triggerEvent(form, 'submit');
		assert.ok(this.app.pendingNavigate);
		return this.app.on('endNavigate', () => {
			exitDocument(form);
		});
	});

	it('should not navigate when submitting routed forms if submit event was prevented', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		var form = enterDocumentFormElement('/path', 'post');
		return new CancellablePromise((resolve, reject) => {
			dom.once(form, 'submit', (event) => {
				event.preventDefault();
				assert.ok(!this.app.pendingNavigate);
				resolve();
			});
			dom.triggerEvent(form, 'submit');
		}).thenAlways(() => {
			exitDocument(form);
		});
	});

	it('should not capture form element when submit event was prevented', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		var form = enterDocumentFormElement('/path', 'post');
		return new CancellablePromise((resolve, reject) => {
			dom.once(form, 'submit', (event) => {
				event.preventDefault();
				assert.ok(!globals.capturedFormElement);
				resolve();
			});
			dom.triggerEvent(form, 'submit');
		}).thenAlways(() => {
			exitDocument(form);
		});
	});

	it('should expose form reference in event data when submitting routed forms', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		const form = enterDocumentFormElement('/path', 'post');
		dom.triggerEvent(form, 'submit');
		this.app.on('startNavigate', (data) => {
			assert.ok(data.form);
		});
		this.app.on('endNavigate', (data) => {
			assert.ok(data.form);
			exitDocument(form);
			done();
		});
	});

	it('should not navigate when submitting forms with method get', () => {
		var form = enterDocumentFormElement('/path', 'get');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		this.app.addRoutes(new Route('/path', Screen));
		dom.on(form, 'submit', preventDefault);
		dom.triggerEvent(form, 'submit');
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocument(form);
	});

	it('should not navigate when submitting on external forms', () => {
		var form = enterDocumentFormElement('http://sennajs.com', 'post');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		dom.on(form, 'submit', preventDefault);
		dom.triggerEvent(form, 'submit');
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocument(form);
	});

	it('should not navigate when submitting on forms outside basepath', () => {
		var form = enterDocumentFormElement('/path', 'post');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		this.app.setBasePath('/base');
		dom.on(form, 'submit', preventDefault);
		dom.triggerEvent(form, 'submit');
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocument(form);
	});

	it('should not navigate when submitting on unrouted forms', () => {
		var form = enterDocumentFormElement('/path', 'post');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		dom.on(form, 'submit', preventDefault);
		dom.triggerEvent(form, 'submit');
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocument(form);
	});

	it('should not capture form if navigate fails when submitting forms', () => {
		var form = enterDocumentFormElement('/path', 'post');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		dom.on(form, 'submit', preventDefault);
		dom.triggerEvent(form, 'submit');
		assert.ok(!globals.capturedFormElement);
		exitDocument(form);
	});

	it('should capture form on beforeNavigate', (done) => {
		const form = enterDocumentFormElement('/path', 'post');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('beforeNavigate', (event) => {
			assert.ok(event.form);
			exitDocument(form);
			globals.capturedFormElement = null;
			done();
		});
		dom.on(form, 'submit', sinon.stub());
		dom.triggerEvent(form, 'submit');
		assert.ok(globals.capturedFormElement);
	});

	it('should capture form button when submitting', () => {
		const form = enterDocumentFormElement('/path', 'post');
		const button = globals.document.createElement('button');
		form.appendChild(button);
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		this.app.addRoutes(new Route('/path', StubScreen));

		return new CancellablePromise((resolve, reject) => {
			this.app.on('beforeNavigate', (event) => {
				assert.ok(globals.capturedFormButtonElement);
				resolve();
			});

			dom.triggerEvent(form, 'submit');
		}).thenAlways(() => {
			exitDocument(form);
			globals.capturedFormElement = null;
			globals.capturedFormButtonElement = null
		});
	});

	it('should capture form button when clicking submit button', () => {
		const form = enterDocumentFormElement('/path', 'post');
		const button = globals.document.createElement('button');
		button.type = 'submit';
		button.tabindex = 1;
		form.appendChild(button);
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		this.app.addRoutes(new Route('/path', Screen));
		button.click();
		assert.ok(globals.capturedFormButtonElement);
		globals.capturedFormButtonElement = null;
		exitDocument(form);
	});

	it('should set redirect path if history path was redirected', (done) => {
		class RedirectScreen extends Screen {
			beforeUpdateHistoryPath() {
				return '/redirect';
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path', RedirectScreen));
		this.app.navigate('/path').then(() => {
			assert.strictEqual('/redirect', this.app.redirectPath);
			assert.strictEqual('/path', this.app.activePath);
			done();
		});
	});

	it('should update the state with the redirected path', (done) => {
		class RedirectScreen extends Screen {
			beforeUpdateHistoryPath() {
				return '/redirect';
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path', RedirectScreen));
		this.app.navigate('/path').then(() => {
			assert.strictEqual('/redirect', globals.window.location.pathname);
			done();
		});
	});

	it('should restore hashbang if redirect path is the same as requested path', (done) => {
		class RedirectScreen extends Screen {
			beforeUpdateHistoryPath() {
				return '/path';
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path', RedirectScreen));
		this.app.navigate('/path#hash').then(() => {
			assert.strictEqual('/path#hash', utils.getCurrentBrowserPath());
			done();
		});
	});

	it('should not restore hashbang if redirect path is not the same as requested path', (done) => {
		class RedirectScreen extends Screen {
			beforeUpdateHistoryPath() {
				return '/redirect';
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path', RedirectScreen));
		this.app.navigate('/path#hash').then(() => {
			assert.strictEqual('/redirect', utils.getCurrentBrowserPath());
			done();
		});
	});

	it('should skipLoadPopstate before page is loaded', (done) => {
		this.app = new App();
		this.app.onLoad_(); // Simulate
		assert.ok(this.app.skipLoadPopstate);
		setTimeout(() => {
			assert.ok(!this.app.skipLoadPopstate);
			done();
		}, 0);
	});

	it('should respect screen lifecycle on navigate', () => {
		class StubScreen2 extends Screen {
		}
		StubScreen2.prototype.activate = sinon.spy();
		StubScreen2.prototype.beforeDeactivate = sinon.spy();
		StubScreen2.prototype.deactivate = sinon.spy();
		StubScreen2.prototype.flip = sinon.spy();
		StubScreen2.prototype.load = sinon.stub().returns(CancellablePromise.resolve());
		StubScreen2.prototype.evaluateStyles = sinon.spy();
		StubScreen2.prototype.evaluateScripts = sinon.spy();
		this.app = new App();
		this.app.addRoutes(new Route('/path1', StubScreen));
		this.app.addRoutes(new Route('/path2', StubScreen2));
		return this.app.navigate('/path1').then(() => {
			this.app.navigate('/path2').then(() => {
				var lifecycleOrder = [
					StubScreen.prototype.load,
					StubScreen.prototype.evaluateStyles,
					StubScreen.prototype.flip,
					StubScreen.prototype.evaluateScripts,
					StubScreen.prototype.activate,
					StubScreen.prototype.beforeDeactivate,
					StubScreen2.prototype.load,
					StubScreen.prototype.deactivate,
					StubScreen2.prototype.evaluateStyles,
					StubScreen2.prototype.flip,
					StubScreen2.prototype.evaluateScripts,
					StubScreen2.prototype.activate,
					StubScreen.prototype.disposeInternal
				];
				for (var i = 1; i < lifecycleOrder.length - 1; i++) {
					assert.ok(lifecycleOrder[i - 1].calledBefore(lifecycleOrder[i]));
				}
			});
		});
	});

	it('should render surfaces', (done) => {
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
		this.app = new App();
		this.app.addRoutes(new Route('/path', ContentScreen));
		this.app.addSurfaces(surface);
		this.app.navigate('/path').then(() => {
			assert.strictEqual(1, surface.addContent.callCount);
			assert.strictEqual('screenId', surface.addContent.args[0][0]);
			assert.strictEqual('surfaceId', surface.addContent.args[0][1]);
			done();
		});
	});

	it('should pass extracted params to "getSurfaceContent"', (done) => {
		var screen;
		class ContentScreen extends Screen {
			constructor() {
				super();
				screen = this;
			}

			getId() {
				return 'screenId';
			}
		}
		ContentScreen.prototype.getSurfaceContent = sinon.stub();

		var surface = new Surface('surfaceId');
		this.app = new App();
		this.app.addRoutes(new Route('/path/:foo(\\d+)/:bar', ContentScreen));
		this.app.addSurfaces(surface);
		this.app.navigate('/path/123/abc').then(() => {
			assert.strictEqual(1, screen.getSurfaceContent.callCount);
			assert.strictEqual('surfaceId', screen.getSurfaceContent.args[0][0]);

			var expectedParams = {
				foo: '123',
				bar: 'abc'
			};
			assert.deepEqual(expectedParams, screen.getSurfaceContent.args[0][1]);
			done();
		});
	});

	it('should pass extracted params to "getSurfaceContent" with base path', (done) => {
		var screen;
		class ContentScreen extends Screen {
			constructor() {
				super();
				screen = this;
			}

			getId() {
				return 'screenId';
			}
		}
		ContentScreen.prototype.getSurfaceContent = sinon.stub();

		var surface = new Surface('surfaceId');
		this.app = new App();
		this.app.setBasePath('/path');
		this.app.addRoutes(new Route('/:foo(\\d+)/:bar', ContentScreen));
		this.app.addSurfaces(surface);
		this.app.navigate('/path/123/abc').then(() => {
			assert.strictEqual(1, screen.getSurfaceContent.callCount);
			assert.strictEqual('surfaceId', screen.getSurfaceContent.args[0][0]);

			var expectedParams = {
				foo: '123',
				bar: 'abc'
			};
			assert.deepEqual(expectedParams, screen.getSurfaceContent.args[0][1]);
			done();
		});
	});

	it('should extract params for the given route and path', () => {
		this.app = new App();
		this.app.setBasePath('/path');
		var route = new Route('/:foo(\\d+)/:bar', () => {
		});
		var params = this.app.extractParams(route, '/path/123/abc');
		var expectedParams = {
			foo: '123',
			bar: 'abc'
		};
		assert.deepEqual(expectedParams, params);
	});

	it('should render default surface content when not provided by screen', (done) => {
		class ContentScreen1 extends Screen {
			getSurfaceContent(surfaceId) {
				if (surfaceId === 'surfaceId1') {
					return 'content1';
				}
			}
			getId() {
				return 'screenId1';
			}
		}
		class ContentScreen2 extends Screen {
			getSurfaceContent(surfaceId) {
				if (surfaceId === 'surfaceId2') {
					return 'content2';
				}
			}
			getId() {
				return 'screenId2';
			}
		}
		dom.enterDocument('<div id="surfaceId1"><div id="surfaceId1-default">default1</div></div>');
		dom.enterDocument('<div id="surfaceId2"><div id="surfaceId2-default">default2</div></div>');
		var surface1 = new Surface('surfaceId1');
		var surface2 = new Surface('surfaceId2');
		surface1.addContent = sinon.stub();
		surface2.addContent = sinon.stub();
		this.app = new App();
		this.app.addRoutes(new Route('/path1', ContentScreen1));
		this.app.addRoutes(new Route('/path2', ContentScreen2));
		this.app.addSurfaces([surface1, surface2]);
		this.app.navigate('/path1').then(() => {
			assert.strictEqual(1, surface1.addContent.callCount);
			assert.strictEqual('screenId1', surface1.addContent.args[0][0]);
			assert.strictEqual('content1', surface1.addContent.args[0][1]);
			assert.strictEqual(1, surface2.addContent.callCount);
			assert.strictEqual('screenId1', surface2.addContent.args[0][0]);
			assert.strictEqual(undefined, surface2.addContent.args[0][1]);
			assert.strictEqual('default2', surface2.getChild('default').innerHTML);
			this.app.navigate('/path2').then(() => {
				assert.strictEqual(2, surface1.addContent.callCount);
				assert.strictEqual('screenId2', surface1.addContent.args[1][0]);
				assert.strictEqual(undefined, surface1.addContent.args[1][1]);
				assert.strictEqual('default1', surface1.getChild('default').innerHTML);
				assert.strictEqual(2, surface2.addContent.callCount);
				assert.strictEqual('screenId2', surface2.addContent.args[1][0]);
				assert.strictEqual('content2', surface2.addContent.args[1][1]);
				dom.exitDocument(surface1.getElement());
				dom.exitDocument(surface2.getElement());
				done();
			});
		});
	});

	it('should add surface content after history path is updated', (done) => {
		var surface = new Surface('surfaceId');
		surface.addContent = () => {
			assert.strictEqual('/path', globals.window.location.pathname);
		};
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.addSurfaces(surface);
		this.app.navigate('/path').then(() => {
			done();
		});
	});

	it('should not navigate when HTML5 History api is not supported', () => {
		var original = utils.isHtml5HistorySupported;
		assert.throws(() => {
			this.app = new App();
			this.app.addRoutes(new Route('/path', Screen));
			utils.isHtml5HistorySupported = () => {
				return false;
			};
			this.app.navigate('/path');
		}, Error);
		utils.isHtml5HistorySupported = original;
	});


	it('should navigate cancelling navigation to multiple paths after navigation is scheduled to keep only the last one', (done) => {
		const app = this.app = new App();

		class TestScreen extends Screen {
			evaluateStyles(surfaces) {
				dom.triggerEvent(enterDocumentLinkElement('/path2'), 'click');
				exitDocumentLinkElement();
				return super.evaluateStyles(surfaces);
			}

			evaluateScripts(surfaces) {
				assert.ok(app.scheduledNavigationEvent);
				return super.evaluateScripts(surfaces);
			}
		}

		class TestScreen2 extends Screen {
			evaluateStyles(surfaces) {
				dom.triggerEvent(enterDocumentLinkElement('/path3'), 'click');
				exitDocumentLinkElement();
				return super.evaluateStyles(surfaces);
			}

			evaluateScripts(surfaces) {
				assert.ok(app.scheduledNavigationEvent);
				return super.evaluateScripts(surfaces);
			}
		}

		this.app.addRoutes(new Route('/path1', TestScreen));
		this.app.addRoutes(new Route('/path2', TestScreen2));
		this.app.addRoutes(new Route('/path3', TestScreen2));

		this.app.navigate('/path1');

		this.app.on('endNavigate', (event) => {
			if (event.path === '/path3') {
				assert.ok(!this.app.scheduledNavigationEvent);
				assert.strictEqual(globals.window.location.pathname, '/path3');
				done();
			}
		});
	});


	it('should navigate cancelling navigation to multiple paths when navigation strategy is setted up to be immediate', (done) => {
		this.app = new App();

		class TestScreen extends Screen {
			load(path) {
				dom.triggerEvent(enterDocumentLinkElement('/path2'), 'click');
				exitDocumentLinkElement();
				return super.load(path);
			}
		}

		class TestScreen2 extends Screen {
			load(path) {
				dom.triggerEvent(enterDocumentLinkElement('/path3'), 'click');
				exitDocumentLinkElement();
				return super.load(path);
			}
		}

		this.app.addRoutes(new Route('/path1', TestScreen));
		this.app.addRoutes(new Route('/path2', TestScreen2));
		this.app.addRoutes(new Route('/path3', TestScreen2));

		this.app.navigate('/path1');

		assert.ok(!this.app.scheduledNavigationEvent);

		this.app.on('endNavigate', (event) => {
			if (event.path === '/path3') {
				assert.ok(!this.app.scheduledNavigationEvent);
				assert.strictEqual(globals.window.location.pathname, '/path3');
				done();
			}
		});

	});

	it('should set document title from screen title', (done) => {
		class TitledScreen extends Screen {
			getTitle() {
				return 'title';
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path', TitledScreen));
		this.app.navigate('/path').then(() => {
			assert.strictEqual('title', globals.document.title);
			done();
		});
	});

	it('should set globals.capturedFormElement to null after navigate', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.navigate('/path').then(() => {
			assert.strictEqual(null, globals.capturedFormElement);
			done();
		});
	});

	it('should cancel nested promises on canceled navigate', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', HtmlScreen));
		this.app.navigate('/path')
			.then(() => assert.fail())
			.catch(() => {
				assert.equal(this.requests.length, 0);
				done();
			})
			.cancel();
	});

	it('should cancel nested promises on canceled prefetch', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', HtmlScreen));
		this.app.prefetch('/path')
			.then(() => assert.fail())
			.catch(() => {
				assert.ok(this.requests[0].aborted);
				done();
			})
			.cancel();
	});

	it('should wait for pendingNavigate before removing screen on double back navigation', (done) => {
		class CacheScreen extends Screen {
			constructor() {
				super();
				this.cacheable = true;
			}

			load() {
				return new CancellablePromise(resolve => setTimeout(resolve, 100));
			}
		}

		var app = new App();
		this.app = app;
		app.addRoutes(new Route('/path1', CacheScreen));
		app.addRoutes(new Route('/path2', CacheScreen));
		app.addRoutes(new Route('/path3', CacheScreen));

		app.navigate('/path1')
			.then(() => app.navigate('/path2'))
			.then(() => app.navigate('/path3'))
			.then(() => {
				var pendingNavigate;
				app.on('startNavigate', () => {
					pendingNavigate = app.pendingNavigate;
					assert.ok(app.screens['/path2']);
				});
				app.once('endNavigate', () => {
					if (app.isNavigationPending) {
						assert.ok(!app.screens['/path2']);
						done();
					} else {
						pendingNavigate.thenAlways(() => {
							assert.ok(!app.screens['/path2']);
							done();
						});
						pendingNavigate.cancel();
					}
				});
				globals.window.history.go(-1);
				setTimeout(() => globals.window.history.go(-1), 50);
			});
	});

	it('should scroll to anchor element on navigate', (done) => {
		if (!canScrollIFrame_) {
			done();
			return;
		}

		showPageScrollbar();
		const parentNode = dom.enterDocument('<div style="position:absolute;top:400px;"><div id="surfaceId1" style="position:relative;top:400px"></div></div>');
		this.app = new App();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addSurfaces(['surfaceId1']);
		this.app.navigate('/path1#surfaceId1').then(() => {
			const surfaceNode = document.querySelector('#surfaceId1');
			const {offsetLeft, offsetTop} = utils.getNodeOffset(surfaceNode);
			assert.strictEqual(window.pageYOffset, offsetTop);
			assert.strictEqual(window.pageXOffset, offsetLeft);
			hidePageScrollbar();
			dom.exitDocument(parentNode);
			done();
		});
	});

	it('should update the document.referrer upon navigation', (done) => {
		// Specify this test to only retry up to 4 times
		// See: https://mochajs.org/#retry-tests
		this.retries(4);

		this.app = new App();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.addRoutes(new Route('/path3', Screen));

		this.app.navigate('/path1')
			.then(() => {
				return this.app.navigate('/path2');
			})
			.then(() => {
				assert.strictEqual(utils.getUrlPathWithoutHash(globals.document.referrer), '/path1');
				return this.app.navigate('/path3');
			})
			.then(() => {
				assert.strictEqual(utils.getUrlPathWithoutHash(globals.document.referrer), '/path2');
				this.app.on('endNavigate', () => {
					assert.strictEqual(utils.getUrlPathWithoutHash(globals.document.referrer), '/path1');
					done();
				}, true);
				globals.window.history.back();
			});
	});

	it('should not reload page on navigate back to a routed page without history state and skipLoadPopstate is active', () => {
		this.app = new App();
		this.app.reloadPage = sinon.stub();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		return this.app.navigate('/path1').then(() => {
			window.history.replaceState(null, null, null);
			return this.app.navigate('/path2').then(() => {
				return new CancellablePromise((resolve, reject) => {
					dom.once(globals.window, 'popstate', () => {
						assert.strictEqual(0, this.app.reloadPage.callCount);
						resolve();
					});
					this.app.skipLoadPopstate = true;
					globals.window.history.back();
				});
			});
		});
	});
});

var canScrollIFrame_ = false;
/**
 * Checks if the current browser allows scrolling iframes. Mobile Safari doesn't
 * allow it, so we have to skip any tests that require window scrolling, since
 * these tests all run inside an iframe.
 */
function detectCanScrollIFrame(done) {
	showPageScrollbar();
	dom.once(document, 'scroll', () => {
		canScrollIFrame_ = true;
	});
	window.scrollTo(100, 100);
	setTimeout(() => {
		hidePageScrollbar();
		done();
	}, 1000);
}

function enterDocumentLinkElement(href) {
	dom.enterDocument('<a id="link" href="' + href + '">link</a>');
	return document.getElementById('link');
}

function enterDocumentFormElement(action, method) {
	const random = Math.floor(Math.random() * 10000);
	dom.enterDocument(`<form id="form_${random}" action="${action}" method="${method}" enctype="multipart/form-data"></form>`);
	return document.getElementById(`form_${random}`);
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

/**
 * On recent versions of Safari, DOMException 18 is thrown when more than 100
 * calls are made to pushState or replaceState in less than 30 seconds. This
 * workaround aims to prevent this exception from being thrown during test
 * execution.
 */
const originalPushState = globals.window.history.pushState;
const originalReplaceState = globals.window.history.replaceState;

const syncTimeout = (fn, ms) => {
	const start = Date.now();
	let now = start;
	while (now - start < ms) {
		now = Date.now();
	}
	fn();
};

const retryWhenDOMException18 = (fn, args) => {
	try {
		fn.apply(globals.window.history, args);
	} catch (e) {
		if (e instanceof globals.window.DOMException &&
			e.code === globals.window.DOMException.SECURITY_ERR) {

			syncTimeout(() => fn.apply(globals.window.history, args), 30000);
		} else {
			throw e;
		}
	}
};

function preventDOMException18() {
	globals.window.history.pushState = function(...args) {
		retryWhenDOMException18(originalPushState, args);
	};

	globals.window.history.replaceState = function(...args) {
		retryWhenDOMException18(originalReplaceState, args);
	};
}

function restorePreventDOMException18() {
	globals.window.history.pushState = originalPushState;
	globals.window.history.replaceState = originalReplaceState;
}