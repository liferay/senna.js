'use strict';

var test = {
  originalPath: null,

  queryStringRoute: /^\/querystring\?p=\w+$/,

  assertNavigation: function(url, content) {
    test.assertPath(url);
    test.assertSurfaceContent('body', content);
    test.assertSurfaceContent('header', content);
    assert.equal(content, document.title);
  },

  assertPath: function(path) {
    assert.equal(path, test.getCurrentPath());
  },

  assertSurfaceContent: function(surfaceId, content) {
    assert.equal(content, test.getSurfaceContent(surfaceId));
  },

  click: function(element) {
    if ('createEvent' in document) {
      var evt = element.ownerDocument.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true, element.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      element.dispatchEvent(evt);
    } else {
      element.click();
    }
  },

  delay: function(ms, val) {
    var timeout;
    return new senna.Promise(function(resolve) {
        timeout = setTimeout(function() {
          resolve(val);
        }, ms);
      }, function() {
        clearTimeout(timeout);
      });
  },

  getCurrentPath: function() {
    return window.location.pathname + window.location.search + window.location.hash;
  },

  getOriginalBasePath: function() {
    var path = test.originalPath;
    return path.substr(0, path.lastIndexOf('/'));
  },

  getSurfaceContent: function(surfaceId) {
    var element = document.querySelector('#' + surfaceId + ' div');
    if (element) {
      return element.textContent.trim();
    }
    return null;
  },

  PageScreen: PageScreen,
  QueryStringScreen: QueryStringScreen,
  DelayedScreen: DelayedScreen,
  LockedScreen: LockedScreen,
  LazySurfaceScreen: LazySurfaceScreen
};

// Screens =====================================================================

function PageScreen() {
  PageScreen.base(this, 'constructor');
}
senna.inherits(PageScreen, senna.Screen);

PageScreen.prototype.cacheable = true;
PageScreen.prototype.title = 'page';
PageScreen.prototype.getSurfaceContent = function(surfaceId) {
  switch (surfaceId) {
    case 'header':
      return 'page';
    case 'body':
      return 'page';
  }
};
PageScreen.prototype.getSurfacesContent = function() {
  return 'cached';
};


function QueryStringScreen() {
  QueryStringScreen.base(this, 'constructor');
}
senna.inherits(QueryStringScreen, senna.Screen);

QueryStringScreen.prototype.title = 'querystring';
QueryStringScreen.prototype.getSurfaceContent = function(surfaceId) {
  switch (surfaceId) {
    case 'header':
      return 'querystring';
    case 'body':
      return 'querystring';
  }
};


function DelayedScreen() {
  DelayedScreen.base(this, 'constructor');
}
senna.inherits(DelayedScreen, senna.Screen);
DelayedScreen.prototype.title = 'delayed';
DelayedScreen.prototype.flip = function(surfaces) {
  var instance = this;
  return test.delay(200).then(function() {
    return DelayedScreen.base(instance, 'flip', surfaces);
  });
};
DelayedScreen.prototype.getSurfaceContent = function(surfaceId) {
  switch (surfaceId) {
    case 'header':
      return 'delayed';
    case 'body':
      return 'delayed';
  }
};


function LockedScreen() {
  LockedScreen.base(this, 'constructor');
}
senna.inherits(LockedScreen, senna.Screen);
LockedScreen.locked = true;
LockedScreen.prototype.beforeDeactivate = function() {
  return LockedScreen.locked;
};
LockedScreen.prototype.getSurfacesContent = function() {
  return 'cached';
};


function LazySurfaceScreen() {
  LazySurfaceScreen.base(this, 'constructor');
}
senna.inherits(LazySurfaceScreen, senna.Screen);
LazySurfaceScreen.prototype.getSurfaceContent = function(surfaceId) {
  switch (surfaceId) {
    case 'lazy':
      return 'lazy';
  }
};
