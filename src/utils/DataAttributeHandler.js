(function() {
  'use strict';

  /**
   * Initilizes senna.App, register surfaces and routes from data attributes.
   * @constructor
   */
  senna.DataAttributeHandler = function(baseElement) {
    if (!senna.isElement(baseElement)) {
      throw new Error('Base element not specified.');
    }
    this.setBaseElement(baseElement);
    this.initApp_();
  };

  /**
   * Holds app reference.
   * @type {senna.App}
   */
  senna.DataAttributeHandler.prototype.app = null;

  /**
   * Holds the base element to search initialization data attributes.
   * @type {Element}
   * @default null
   */
  senna.DataAttributeHandler.prototype.baseElement = null;

  /**
   * Gets app reference.
   * @return {senna.App}
   */
  senna.DataAttributeHandler.prototype.getApp = function() {
    return this.app;
  };

  /**
   * Gets base element.
   * @return {Element}
   */
  senna.DataAttributeHandler.prototype.getBaseElement = function() {
    return this.baseElement;
  };

  /**
   * Initializes app.
   * @protected
   */
  senna.DataAttributeHandler.prototype.initApp_ = function() {
    var baseElement = this.baseElement;
    if (!baseElement.hasAttribute('data-senna')) {
      console.log('Senna not initialized from data attribute, try passing <body data-senna>.');
      return;
    }

    console.log('Senna initialized from data attribute.');
    this.app = new senna.App();

    var basePath = baseElement.getAttribute('data-senna-basepath');
    if (!senna.isNull(basePath)) {
      this.app.setBasePath(basePath);
      console.log('Senna scanned basepath ' + basePath);
    }
    var linkSelector = baseElement.getAttribute('data-senna-link-selector');
    if (!senna.isNull(linkSelector)) {
      this.app.setLinkSelector(linkSelector);
      console.log('Senna scanned link selector ' + linkSelector);
    }
    this.scanSurfaces();
    this.scanRoutes();
  };

  /**
   * Makes default route in case of not found any.
   * @return {Element}
   */
  senna.DataAttributeHandler.prototype.makeDefaultRoute_ = function() {
    var link = document.createElement('link');
    link.href = 'regex:.*';
    link.rel = 'senna-route';
    link.type = 'senna.HtmlScreen';
    return link;
  };

  /**
   * Scans routes from link elements.
   */
  senna.DataAttributeHandler.prototype.scanRoutes = function() {
    var routes = document.querySelectorAll('link[rel="senna-route"]');
    if (routes.length === 0) {
      console.log('Senna can\'t find a route element, adding default.');
      routes = [this.makeDefaultRoute_()];
    }

    for (var i = 0; i < routes.length; i++) {
      var route = routes[i];
      if (route.hasAttribute('senna-parsed')) {
        continue;
      }

      var path = route.getAttribute('href');
      var handler = route.getAttribute('type');

      if (senna.isDefAndNotNull(path) && senna.isDefAndNotNull(handler)) {
        if (path.indexOf('regex:') === 0) {
          path = new RegExp(path.substring(6));
        }
        this.app.addRoutes(new senna.Route(path, senna.getObjectByName(handler)));
        route.setAttribute('data-parsed', '');
        console.log('Senna scanned route ' + path);
      }
    }
  };

  /**
   * Scans surfaces with data attribute.
   */
  senna.DataAttributeHandler.prototype.scanSurfaces = function() {
    var surfaces = this.baseElement.querySelectorAll('[data-senna-surface]');
    for (var i = 0; i < surfaces.length; i++) {
      var surfaceId = surfaces[i].id;
      if (surfaceId) {
        if (!this.app.surfaces[surfaceId]) {
          this.app.addSurfaces(surfaceId);
          console.log('Senna scanned surface ' + surfaceId);
        }
      } else {
        throw new Error('Surface element id not specified.');
      }
    }
  };

  /**
   * Sets the app.
   * @param {senna.App} app
   */
  senna.DataAttributeHandler.prototype.setApp = function(app) {
    this.app = app;
  };

  /**
   * Sets the base element.
   * @param {Element} baseElement
   */
  senna.DataAttributeHandler.prototype.setBaseElement = function(baseElement) {
    this.baseElement = baseElement;
  };
}());
