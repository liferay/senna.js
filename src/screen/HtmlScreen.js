(function() {
  'use strict';

  /**
   * Screen class that perform a request and extracts surface contents from
   * the response content.
   * @constructor
   * @extends {senna.RequestScreen}
   */
  senna.HtmlScreen = function() {
    senna.HtmlScreen.base(this, 'constructor');
  };

  senna.inherits(senna.HtmlScreen, senna.RequestScreen);

  /**
   * Holds the title selector. Relevant to extract the <code><title></code>
   * element from request fragments to use as the screen title.
   * @type {!String}
   * @default title
   * @protected
   */
  senna.HtmlScreen.prototype.titleSelector = 'title';

  /**
   * @inheritDoc
   */
  senna.HtmlScreen.prototype.getSurfaceContent = function(surfaceId, contents) {
    var surface = contents.querySelector('#' + surfaceId);
    if (surface) {
      return surface.innerHTML;
    }
  };

  /**
   * Gets the title selector.
   * @return {!String}
   */
  senna.HtmlScreen.prototype.getTitleSelector = function() {
    return this.titleSelector;
  };

  /**
   * @inheritDoc
   */
  senna.HtmlScreen.prototype.load = function(path) {
    var self = this;
    var promise = senna.HtmlScreen.base(this, 'load', path);

    return promise.then(function(content) {
      return self.resolveContent(content);
    }).thenCatch(function(err) {
      self.abortRequest();
      throw err;
    });
  };

  /**
   * Resolves the screen content as fragment from the response.
   * @param {XMLHttpRequest} xhr
   * @return {?Element}
   */
  senna.HtmlScreen.prototype.resolveContent = function(content) {
    if (senna.isString(content)) {
      var div = document.createElement('div');
      div.innerHTML = content;
      content = div;
    }

    var title = content.querySelector(this.titleSelector);
    if (title) {
      this.setTitle(title.innerHTML.trim());
    }
    this.addCache(content);
    return content;
  };

  /**
   * Sets the title selector.
   * @param {!String} titleSelector
   */
  senna.HtmlScreen.prototype.setTitleSelector = function(titleSelector) {
    this.titleSelector = titleSelector;
  };

}());
