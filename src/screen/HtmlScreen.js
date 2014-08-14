'use strict';

(function() {
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
    var instance = this;
    var promise = senna.HtmlScreen.base(this, 'load', path);

    return promise.then(function(xhr) {
      return instance.resolveContent(xhr);
    }).thenCatch(function(err) {
      instance.abortRequest();
      throw err;
    });
  };

  /**
   * Resolves the screen content as fragment from the response.
   * @param {XMLHttpRequest} xhr
   * @return {?Element}
   */
  senna.HtmlScreen.prototype.resolveContent = function(xhr) {
    var div = document.createElement('div');
    div.innerHTML = xhr.responseText;

    var title = div.querySelector(this.titleSelector);
    if (title) {
      this.setTitle(title.innerHTML.trim());
    }

    this.addCache(div);
    return div;
  };

  /**
   * Sets the title selector.
   * @param {!String} titleSelector
   */
  senna.HtmlScreen.prototype.setTitleSelector = function(titleSelector) {
    this.titleSelector = titleSelector;
  };

}());
