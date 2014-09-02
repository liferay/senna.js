(function() {
  'use strict';

  /**
   * Abstract class for cacheable classes.
   * @constructor
   */
  senna.Cacheable = function() {};

  /**
   * Holds the cached data.
   * @type {!Object}
   * @default null
   * @protected
   */
  senna.Cacheable.prototype.cache = null;

  /**
   * Holds whether class is cacheable.
   * @type {boolean}
   * @default false
   * @protected
   */
  senna.Cacheable.prototype.cacheable = false;

  /**
   * Adds content to the cache.
   * @param {String} content Content to be cached.
   * @chainable
   */
  senna.Cacheable.prototype.addCache = function(content) {
    if (this.cacheable) {
      this.cache = content;
    } else {
      console.log('[' + this + '] is not cacheable');
    }
    return this;
  };

  /**
   * Clears the cache.
   * @chainable
   */
  senna.Cacheable.prototype.clearCache = function() {
    this.cache = null;
    return this;
  };

  /**
   * Destructor logic for the cacheable class. Clears the cache when
   * destroyed. Make sure to invoke
   * <code>MyCacheableClass.base(this, 'destroy');</code> from implementers
   * destroy.
   */
  senna.Cacheable.prototype.destroy = function() {
    this.clearCache();
  };

  /**
   * Gets the cached content.
   * @return {Object} Cached content.
   * @protected
   */
  senna.Cacheable.prototype.getCache = function() {
    return this.cache;
  };

  /**
   * Whether the class is cacheable.
   * @return {Boolean} Returns true when class is cacheable, false otherwise.
   */
  senna.Cacheable.prototype.isCacheable = function() {
    return this.cacheable;
  };

  /**
   * Sets whether the class is cacheable.
   * @param {Boolean} cacheable
   */
  senna.Cacheable.prototype.setCacheable = function(cacheable) {
    if (!cacheable) {
      this.clearCache();
    }
    this.cacheable = cacheable;
  };
}());
