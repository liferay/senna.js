define(['exports'], function (exports) {
  'use strict';

  /**
   * Holds value error messages.
   * @const
   */

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var errors = function errors() {
    _classCallCheck(this, errors);
  };

  /**
   * Invalid status error message.
   * @type {string}
   * @static
   */
  errors.INVALID_STATUS = 'Invalid status code';

  /**
   * Request error message.
   * @type {string}
   * @static
   */
  errors.REQUEST_ERROR = 'Request error';

  /**
   * Request timeout error message.
   * @type {string}
   * @static
   */
  errors.REQUEST_TIMEOUT = 'Request timeout';

  /**
   * Request is blocked by CORS issue message.
   * @type {string}
   * @static
   */
  errors.REQUEST_PREMATURE_TERMINATION = 'Request terminated prematurely';

  exports.default = errors;
});
//# sourceMappingURL=errors.js.map
