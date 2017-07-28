'use strict';

/**
 * Holds value error messages.
 * @const
 */
class errors {
}

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

export default errors;
