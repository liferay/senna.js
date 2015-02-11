'use strict';

describe('Senna', function() {

  // Setup =====================================================================

  var app;

  test.originalPath = test.getCurrentPath();

  before(function(done) {
    senna.request('fixture/doc.html', 'GET', {}, null, true).then(
      function(data) {
        var fixtures = document.createElement('div');

        fixtures.setAttribute('id', 'fixtures');
        fixtures.innerHTML = data.response;

        document.body.appendChild(fixtures);
        done();
    });
  });

  // Tests =====================================================================

  beforeEach(function() {
    app = new senna.App();
    app.setBasePath('/base');
    app.setDefaultTitle('default');

    app.addSurfaces([
      'body',
      'unknown',
      new senna.Surface('header')
    ]);

    app.addRoutes([
      {
        path: '/lazy',
        handler: test.LazySurfaceScreen
      },
      {
        path: '/locked',
        handler: test.LockedScreen
      },
      {
        path: test.queryStringRoute,
        handler: test.QueryStringScreen
      },
      {
        path: function(value) {
          return value === '/delayed200ms';
        },
        handler: test.DelayedScreen
      },
      {
        path: NaN,
        handler: senna.Screen
      },
      new senna.Route('/page', test.PageScreen)
    ]);
  });

  afterEach(function() {
    app.destroy();
    window.history.pushState(null, null, test.originalPath);
  });

  it('should set / get surface transitions', function (done) {
    assert.equal(app.surfaces.body.getTransitionFn(), null);
    app.surfaces.body.setTransitionFn(senna.Surface.TRANSITION);
    assert.equal(app.surfaces.body.getTransitionFn(), senna.Surface.TRANSITION);

    done();
  });

  it('should set / get base path', function(done) {
    app.setBasePath('/common');
    assert.equal(app.getBasePath(), '/common');

    done();
  });

  it('should set / get link selector', function(done) {
    app.setLinkSelector('button');
    assert.equal(app.getLinkSelector(), 'button');

    done();
  });

  it('should set / get HTMLScreen title selector', function(done) {
    var htmlScreen = new senna.HtmlScreen();

    htmlScreen.setTitleSelector('h1');
    assert.equal(htmlScreen.getTitleSelector(), 'h1');

    htmlScreen.destroy();

    done();
  });

  it('should set / get loading CSS class', function(done) {
    app.setLoadingCssClass('loading-page');
    assert.equal(app.getLoadingCssClass(), 'loading-page');

    done();
  });

  it('should set / get the update scroll position', function(done) {
    app.setUpdateScrollPosition(false);
    assert.equal(app.getUpdateScrollPosition(), false);

    done();
  });

  it('should find route from path', function(done) {
    var route = app.findRoute('/base/unknown');
    assert.strictEqual(route, null);

    route = app.findRoute('/base/page');
    assert.ok(route instanceof senna.Route);
    assert.equal(route.getPath(), '/page');

    route = app.findRoute('/base/querystring?p=1');
    assert.ok(route instanceof senna.Route);
    assert.equal(route.getPath(), test.queryStringRoute);

    done();
  });

  it('should throw error when route path is not found', function(done) {
    assert.throws(function() {
      new senna.Route();
    }, Error);

    done();
  });

  it('should throw error when route handler is not found', function(done) {
    assert.throws(function() {
      new senna.Route('/foo.html');
    }, Error);

    done();
  });

  it('should throw error when surface is not found', function(done) {
    assert.throws(function() {
      new senna.Surface('');
    }, Error);

    done();
  });

  it('should set HTTP method', function(done) {
    var requestScreen = new senna.RequestScreen();

    requestScreen.setHttpMethod('POST');

    assert.ok(requestScreen.getHttpMethod(), 'POST');

    done();
  });

  it('should set HTTP headers', function(done) {
    var requestScreen = new senna.RequestScreen();

    requestScreen.setHttpHeaders({
      'X-test': 'true'
    });

    assert.ok(requestScreen.getHttpHeaders()['X-test'] === 'true');

    done();
  });

  it('should set Request timeout', function(done) {
    var requestScreen = new senna.RequestScreen();

    requestScreen.setTimeout(1);

    assert.equal(requestScreen.getTimeout(), 1);

    done();
  });

  it('should abort request', function(done) {
    var requestScreen = new senna.RequestScreen();
    requestScreen.load(test.getOriginalBasePath() + '/fixture/content.txt').then(function() {
      assert.equal(200, requestScreen.getRequest().status);
      requestScreen.abortRequest();
      assert.equal(0, requestScreen.getRequest().status);

      done();
    });
  });

  it('should match surface elements', function(done) {
    assert.equal(document.querySelector('#body'), app.surfaces.body.getEl());
    assert.equal(document.querySelector('#header'), app.surfaces.header.getEl());

    done();
  });

  it('should lazily match surface element', function(done) {
    var lazySurface = new senna.Surface('lazy');
    app.addSurfaces(lazySurface);
    assert.equal(lazySurface.getEl(), null);
    assert.equal(lazySurface.activeChild, null);
    assert.equal(lazySurface.defaultChild, null);

    app.navigate('/base/lazy').then(function() {
      app.navigate('/base/page').then(function() {
        var div = document.createElement('div');
        var content = document.createElement('div');
        div.id = 'lazy';
        content.id = 'lazy-default';
        div.appendChild(content);
        document.querySelector('body').appendChild(div);
        assert.notEqual(lazySurface.getEl(), null);
        assert.equal(lazySurface.activeChild, null);
        assert.equal(lazySurface.defaultChild, null);
        app.navigate('/base/lazy').then(function() {
          test.assertPath('/base/lazy');
          test.assertSurfaceContent('lazy', 'lazy');
          test.assertSurfaceContent('body', 'default');
          test.assertSurfaceContent('header', 'default');
          assert.notEqual(lazySurface.activeChild, null);
          assert.notEqual(lazySurface.defaultChild, null);

          done();
        });
      });
    });
  });

  it('should prefetch', function(done) {
    var fetched = false;

    app.prefetch('/base/page').then(function() {
      fetched = true;
    })
    .thenAlways(function() {
      assert.ok(fetched);

      done();
    });
  });

  it('should prefetch fail using HtmlScreen', function(done) {
    var fail = false;

    app.setBasePath(test.getOriginalBasePath());
    app.addRoutes({
      path: '/fixture/404.txt',
      handler: senna.HtmlScreen
    });
    app.prefetch(test.getOriginalBasePath() + '/fixture/404.txt').thenCatch(function() {
      fail = true;
    })
    .thenAlways(function() {
      assert.ok(fail);

      done();
    });
  });

  it('should not prefetch unrouted path', function(done) {
    var fail = false;

    app.prefetch('/no-route').thenCatch(function() {
      fail = true;
    })
    .thenAlways(function() {
      assert.ok(fail);

      done();
    });
  });

  it('should navigate with screen lifecycle', function(done) {
    var lifecycle = [];
    var cycle = {
      flip: 0,
      activate: 0,
      deactivate: 0,
      destroy: 0,
      startNavigate: 0,
      endNavigate: 0
    };

    var LifecycleScreen = function() {
      LifecycleScreen.base(this, 'constructor');
    };
    senna.inherits(LifecycleScreen, senna.Screen);
    LifecycleScreen.prototype.cacheable = false;
    LifecycleScreen.prototype.flip = function(surfaces) {
      LifecycleScreen.base(this, 'flip', surfaces);
      lifecycle.push('flip' + (++cycle.flip));
    };
    LifecycleScreen.prototype.activate = function() {
      LifecycleScreen.base(this, 'activate');
      lifecycle.push('activate' + (++cycle.activate));
    };
    LifecycleScreen.prototype.deactivate = function() {
      LifecycleScreen.base(this, 'deactivate');
      lifecycle.push('deactivate' + (++cycle.deactivate));
    };
    LifecycleScreen.prototype.destroy = function() {
      LifecycleScreen.base(this, 'destroy');
      lifecycle.push('destroy' + (++cycle.destroy));
    };

    app.addRoutes([
      {
        path: '/lifecycle1',
        handler: LifecycleScreen
      },
      {
        path: '/lifecycle2',
        handler: LifecycleScreen
      }
    ]);

    app.on('startNavigate', function() {
      lifecycle.push('startNavigate' + (++cycle.startNavigate));
    });

    app.on('endNavigate', function() {
      lifecycle.push('endNavigate' + (++cycle.endNavigate));
    });

    app.navigate('/base/lifecycle1').then(function() {
      app.navigate('/base/lifecycle2').then(function() {
        assert.deepEqual(['startNavigate1', 'flip1', 'activate1', 'endNavigate1', 'startNavigate2', 'deactivate1', 'flip2', 'activate2', 'destroy1', 'endNavigate2'], lifecycle);

        done();
      });
    });
  });

  it('should navigate with hash', function(done) {
    app.navigate('/base/page#hash').then(function() {
      test.assertNavigation('/base/page#hash', 'page');

      done();
    });
  });

  it('should navigate asynchronously', function(done) {
    var pathBeforeAsync;
    app.navigate('/base/querystring?p=beforeasync').then(function() {
      app.on('startNavigate', function() {
        pathBeforeAsync = test.getCurrentPath();
      });
      app.navigate('/base/delayed200ms').then(function() {
        assert.equal(pathBeforeAsync, '/base/querystring?p=beforeasync');
        test.assertNavigation('/base/delayed200ms', 'delayed');

        done();
      });
    });
  });

  it('should dispatch to the current url', function(done) {
    window.history.pushState(null, '', '/base/querystring?p=dispatch');
    app.dispatch().then(function() {
      test.assertNavigation('/base/querystring?p=dispatch', 'querystring');

      done();
    });
  });

  it('should not navigate to unrouted path', function(done) {
    var err1;
    var endNavigateCalled = false;
    var startNavigateCalled = false;

    app.navigate('/base/querystring?p=beforeunrouted').then(function() {
      app.on('startNavigate', function() {
        startNavigateCalled = true;
      });
      app.on('endNavigate', function(event) {
        err1 = event.error;
        endNavigateCalled = true;
      });
      app.navigate('/base/unknown').thenCatch(function(err2) {
        test.assertNavigation('/base/querystring?p=beforeunrouted', 'querystring');
        assert.ok(startNavigateCalled && endNavigateCalled);
        assert.ok(err1 instanceof Error);
        assert.equal(err1.message, 'No route for /base/unknown');
        assert.ok(err2 instanceof Error);
        assert.equal(err2.message, 'No route for /base/unknown');

        done();
      });
    });
  });

  it('should not navigate when prevented by active screen', function(done) {
    var err1;
    var startNavigateCalled = false;
    var endNavigateCalled = false;

    app.navigate('/base/locked').then(function() {
      app.on('startNavigate', function() {
        startNavigateCalled = true;
      });
      app.on('endNavigate', function(event) {
        err1 = event.error;
        endNavigateCalled = true;
      });
      app.navigate('/base/querystring?p=afterlocked').thenCatch(function(err2) {
        test.LockedScreen.locked = false;
        test.assertNavigation('/base/locked', 'default');
        assert.ok(startNavigateCalled && endNavigateCalled);
        assert.ok(err1 instanceof Error);
        assert.equal(err1.message, 'Cancelled by active screen');
        assert.ok(err2 instanceof Error);
        assert.equal(err2.message, 'Cancelled by active screen');

        done();
      });
    });
  });

  it('should cancel pending navigate', function(done) {
    var err = [];
    var startNavigate = [];
    var endNavigate = [];

    app.on('startNavigate', function(event) {
      startNavigate.push(event.path);
    });
    app.on('endNavigate', function(event) {
      endNavigate.push(event.path);
      err.push(event.error);
    });

    app.navigate('/base/delayed200ms').thenCatch(function(error) {
      err.push(error);
    });

    senna.async.nextTick(function() {
      app.navigate('/base/querystring?p=cancelpending').then(function() {
        test.assertNavigation('/base/querystring?p=cancelpending', 'querystring');
        assert.deepEqual(['/base/delayed200ms', '/base/querystring?p=cancelpending'], startNavigate);
        assert.deepEqual(['/base/delayed200ms', '/base/querystring?p=cancelpending'], endNavigate);
        assert.strictEqual(err[2], undefined);
        assert.ok(err[0] instanceof Error);
        assert.equal(err[0].message, 'Cancel pending navigation');
        assert.ok(err[1] instanceof Error);
        assert.equal(err[1].message, 'Cancel pending navigation');

        done();
      });
    });
  });

  it('should remember the scroll position', function(done) {
    var pageXOffsetAfterFirstNavigate = 0;
    var pageYOffsetAfterFirstNavigate = 0;

    app.navigate('/base/querystring?p=scroll1').then(function() {
      document.addEventListener('scroll', function onceScrollInternal() {
        document.removeEventListener('scroll', onceScrollInternal, false);
        // History scrolling requires some time to persist the
        // scroll position set by the back/forward button
        setTimeout(function() {
          app.navigate('/base/querystring?p=scroll2').then(function() {
            app.once('endNavigate', function() {
              assert.equal(pageXOffsetAfterFirstNavigate, 0);
              assert.equal(pageYOffsetAfterFirstNavigate, 0);
              assert.equal(window.pageXOffset, 10);
              assert.equal(window.pageYOffset, 10);

              done();
            });
            // After the new navigation happens the scroll
            // position goes back to 0,0 and also needs some
            // time to persist before back/forward button is
            // invoked
            setTimeout(function() {
              window.history.back();
            }, 300);
          });
        }, 1000);
      }, false);
      pageXOffsetAfterFirstNavigate = window.pageXOffset;
      pageYOffsetAfterFirstNavigate = window.pageYOffset;
      window.scrollTo(10, 10);
    });
  });

  it('should navigate when history buttons are clicked', function(done) {
    var history = [];

    app.navigate('/base/querystring?p=pageback').then(function() {
      app.navigate('/base/querystring?p=pageforward').then(function() {
        app.once('endNavigate', function(event) {
          history.push(event.path);
          app.once('endNavigate', function(event) {
            history.push(event.path);
            test.assertNavigation('/base/querystring?p=pageforward', 'querystring');
            assert.deepEqual(['/base/querystring?p=pageback', '/base/querystring?p=pageforward'], history);

            done();
          });
          window.history.forward();
        });
        window.history.back();
      });
    });
  });

  it('should not navigate to history states that are not ours', function(done) {
    window.history.pushState({}, '', '/unknown/state');
    app.navigate('/base/page').then(function() {
      setTimeout(function() {
        test.assertPath('/unknown/state');
        test.assertSurfaceContent('body', 'page');
        test.assertSurfaceContent('header', 'page');
        assert.equal(document.title, 'page');

        done();
      }, 300);
      window.history.back();
    });
  });

  it('should navigate to clicked links', function(done) {
    app.on('endNavigate', function() {
      test.assertNavigation('/base/page', 'page');

      done();
    });
    test.click(document.querySelector('a[href="/base/page"]'));
  });

  it('should not navigate to unrouted clicked links', function(done) {
    test.click(document.querySelector('a[href="/base/unrouted"]'));
    assert.strictEqual(app.pendingNavigate, null);

    done();
  });

  it('should not navigate to external clicked links', function(done) {
    test.click(document.querySelector('a[href="http://alloyui.com/external"]'));
    assert.strictEqual(app.pendingNavigate, null);

    done();
  });

  it('should not navigate to clicked links outside base path', function(done) {
    test.click(document.querySelector('a[href="/outside"]'));
    assert.strictEqual(app.pendingNavigate, null);

    done();
  });

  it('should not navigate to hash clicked links in the same url', function(done) {
    app.navigate('/base/page').then(function() {
      test.click(document.querySelector('a[href="/base/page#hash"]'));
      assert.strictEqual(app.pendingNavigate, null);

      done();
    });
  });

  it('should not navigate to links clicked with invalid mouse button or modifier keys pressed', function(done) {
    var link = document.querySelector('a[href="/base/page#hash"]');

    function simulateEvent(element, type, modifiers) {
      modifiers.cancelable = true;
      element.dispatchEvent(new MouseEvent(type, modifiers));
    }

    simulateEvent(link, 'click', {altKey: true});
    assert.strictEqual(app.pendingNavigate, null);

    simulateEvent(link, 'click', {ctrlKey: true});
    assert.strictEqual(app.pendingNavigate, null);

    simulateEvent(link, 'click', {metaKey: true});
    assert.strictEqual(app.pendingNavigate, null);

    simulateEvent(link, 'click', {shiftKey: true});
    assert.strictEqual(app.pendingNavigate, null);

    simulateEvent(link, 'click', {button: 2});
    assert.strictEqual(app.pendingNavigate, null);

    done();
  });

  it('should navigate to previous page asynchronously', function(done) {
    app.navigate('/base/delayed200ms').then(function() {
      var start = Date.now();
      app.navigate('/base/querystring?p=afterasync').then(function() {
        app.on('endNavigate', function() {
          assert.ok((Date.now() - start) > 200);

          done();
        });
        window.history.back();
      });
    });
  });

  it('should navigate using HtmlScreen', function(done) {
    var path = test.getOriginalBasePath() + '/fixture/content.txt';
    app.addRoutes({
      path: '/fixture/content.txt',
      handler: senna.HtmlScreen
    });
    app.setBasePath(test.getOriginalBasePath());
    app.navigate(path).then(function() {
      test.assertNavigation(path, 'html');

      done();
    });
  });

  it('should navigate missing <title> using HtmlScreen', function(done) {
    var path = test.getOriginalBasePath() + '/fixture/notitle.txt';
    app.addRoutes({
      path: '/fixture/notitle.txt',
      handler: senna.HtmlScreen
    });
    app.setBasePath(test.getOriginalBasePath());
    app.navigate(path).then(function() {
      test.assertPath(path);
      test.assertSurfaceContent('body', 'html');
      test.assertSurfaceContent('header', 'html');
      assert.equal(document.title, 'default');

      done();
    });
  });

  it('should navigate fail using HtmlScreen', function(done) {
    app.navigate('/base/querystring?p=before404').then(function() {
      app.setBasePath(test.getOriginalBasePath());
      app.addRoutes({
        path: '/fixture/404.txt',
        handler: senna.HtmlScreen
      });
      app.navigate(test.getOriginalBasePath() + '/fixture/404.txt').thenCatch(function() {
        test.assertNavigation('/base/querystring?p=before404', 'querystring');

        done();
      });
    });
  });

  it('should resolve content for HtmlScreen with HTML element', function(done) {
    var htmlScreen = new senna.HtmlScreen();
    var element = document.createElement('div');

    htmlScreen.resolveContent(element);
    htmlScreen.destroy();

    done();
  });


  it('should parse scripts', function(done) {
    senna.parseScripts(senna.buildFragment('Hello<script src="' + test.getOriginalBasePath() + '/fixture/sentinel.js"></script><script>window.sentinel_inline_ = window.sentinel_ + 1;</script>'));
    senna.async.nextTick(function() {
      assert.equal(window.sentinel_, 1);
      assert.equal(window.sentinel_inline_, 2);

      done();
    });
  });

  it('should not parse scripts twice', function(done) {
    window.sentinel_ = 0;
    var frag = senna.buildFragment('<script>window.sentinel_++;</script>');
    senna.parseScripts(frag);
    senna.async.nextTick(function() {
      senna.parseScripts(frag);
      senna.async.nextTick(function() {
        assert.equal(window.sentinel_, 1);

        done();
      });
    });
  });

  it('should keep surfaces contents until transition is done', function(done) {
    var defaultTransition = senna.Surface.TRANSITION;
    senna.Surface.TRANSITION = function() {
      return new senna.Promise(function(res) {
        setTimeout(res, 10);
      });
    };
    app.navigate('/base/page').then(function() {
      app.navigate('/base/querystring?p=transition').then(function() {
        assert.equal(1, document.querySelectorAll('#body div').length);
        assert.equal(1, document.querySelectorAll('#header div').length);
        senna.Surface.TRANSITION = defaultTransition;
        done();
      });
      setTimeout(function(){
        assert.equal(2, document.querySelectorAll('#body div').length);
        assert.equal(2, document.querySelectorAll('#header div').length);
      }, 5);
    });
  });

});
