'use strict';

/**
 * Holds value error messages.
 * @const
 */
class errors {
}

/**
 * Type error message.
 * Usually thrown when CORS error happen with fetch.
 * @type {string}
 * @static
 */
errors.FAILED_TO_FETCH = 'Failed to fetch';

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
