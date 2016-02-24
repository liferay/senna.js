'use strict';

import { core } from 'metal';
import Ajax from 'metal-ajax';
import MultiMap from 'metal-multimap';
import CancellablePromise from 'metal-promise';
import errors from '../errors/errors';
import utils from '../utils/utils';
import globals from '../globals/globals';
import Screen from './Screen';
import Uri from 'metal-uri';
import UA from 'metal-useragent';

class RequestScreen extends Screen {

	/**
	 * Request screen abstract class to perform io operations on descendant
	 * screens.
	 * @constructor
	 * @extends {Screen}
	 */
	constructor() {
		super();

		/**
		 * @inheritDoc
		 * @default true
		 */
		this.cacheable = true;

		/**
		 * Holds default http headers to set on request.
		 * @type {?Object=}
		 * @default {
		 *   'X-PJAX': 'true',
		 *   'X-Requested-With': 'XMLHttpRequest'
		 * }
		 * @protected
		 */
		this.httpHeaders = {
			'X-PJAX': 'true',
			'X-Requested-With': 'XMLHttpRequest'
		};

		/**
		 * Holds default http method to perform the request.
		 * @type {!string}
		 * @default RequestScreen.GET
		 * @protected
		 */
		this.httpMethod = RequestScreen.GET;

		/**
		 * Holds the XHR object responsible for the request.
		 * @type {XMLHttpRequest}
		 * @default null
		 * @protected
		 */
		this.request = null;

		/**
		 * Holds the request timeout in milliseconds.
		 * @type {!number}
		 * @default 30000
		 * @protected
		 */
		this.timeout = 30000;
	}

	/**
	 * Asserts that response status code is valid.
	 * @param {number} status
	 * @protected
	 */
	assertValidResponseStatusCode(status) {
		if (!this.isValidResponseStatusCode(status)) {
			var error = new Error(errors.INVALID_STATUS);
			error.invalidStatus = true;
			throw error;
		}
	}

	/**
	 * @inheritDoc
	 */
	beforeUpdateHistoryPath(path) {
		var redirectPath = this.getRequestPath();
		if (redirectPath && redirectPath !== path) {
			return redirectPath;
		}
		return path;
	}

	/**
	 * @inheritDoc
	 */
	beforeUpdateHistoryState(state) {
		// If state is ours and navigate to post-without-redirect-get set
		// history state to null, that way Senna will reload the page on
		// popstate since it cannot predict post data.
		if (state.senna && state.form && state.redirectPath === state.path) {
			return null;
		}
		return state;
	}

	/**
	 * Formats load path before invoking ajax call.
	 * @param {string} path
	 * @return {string} Formatted path;
	 * @protected
	 */
	formatLoadPath(path) {
		if (UA.isIeOrEdge && this.httpMethod === RequestScreen.GET) {
			var uri = new Uri(path);
			uri.makeUnique();
			return uri.toString();
		}
		return path;
	}

	/**
	 * Gets the http headers.
	 * @return {?Object=}
	 */
	getHttpHeaders() {
		return this.httpHeaders;
	}

	/**
	 * Gets the http method.
	 * @return {!string}
	 */
	getHttpMethod() {
		return this.httpMethod;
	}

	/**
	 * Gets request path.
	 * @return {string=}
	 */
	getRequestPath() {
		var request = this.getRequest();
		if (request) {
			return utils.getUrlPath(request.responseURL);
		}
		return null;
	}

	/**
	 * Gets the request object.
	 * @return {?Object}
	 */
	getRequest() {
		return this.request;
	}

	/**
	 * Gets the request timeout.
	 * @return {!number}
	 */
	getTimeout() {
		return this.timeout;
	}

	/**
	 * Checks if response succeeded. Any status code 2xx or 3xx is considered
	 * valid.
	 * @param {number} statusCode
	 */
	isValidResponseStatusCode(statusCode) {
		return statusCode >= 200 && statusCode <= 399;
	}

	/**
	 * @inheritDoc
	 */
	load(path) {
		var cache = this.getCache();
		if (core.isDefAndNotNull(cache)) {
			return CancellablePromise.resolve(cache);
		}

		var body = null;
		var httpMethod = this.httpMethod;

		if (globals.capturedFormElement) {
			body = new FormData(globals.capturedFormElement);
			httpMethod = RequestScreen.POST;
		}

		var headers = new MultiMap();
		Object.keys(this.httpHeaders).forEach(header => headers.add(header, this.httpHeaders[header]));

		return Ajax
			.request(this.formatLoadPath(path), httpMethod, body, headers, null, this.timeout)
			.then(xhr => {
				this.setRequest(xhr);
				this.assertValidResponseStatusCode(xhr.status);
				if (httpMethod === RequestScreen.GET && this.isCacheable()) {
					this.addCache(xhr.responseText);
				}
				return xhr.responseText;
			})
			.catch((reason) => {
				switch (reason.message) {
					case errors.REQUEST_TIMEOUT:
						reason.timeout = true;
						break;
					case errors.REQUEST_ERROR:
						reason.requestError = true;
						break;
				}
				throw reason;
			});
	}

	/**
	 * Sets the http headers.
	 * @param {?Object=} httpHeaders
	 */
	setHttpHeaders(httpHeaders) {
		this.httpHeaders = httpHeaders;
	}

	/**
	 * Sets the http method.
	 * @param {!string} httpMethod
	 */
	setHttpMethod(httpMethod) {
		this.httpMethod = httpMethod.toLowerCase();
	}

	/**
	 * Sets the request object.
	 * @param {?Object} request
	 */
	setRequest(request) {
		this.request = request;
	}

	/**
	 * Sets the request timeout in milliseconds.
	 * @param {!number} timeout
	 */
	setTimeout(timeout) {
		this.timeout = timeout;
	}

}

/**
 * Holds value for method get.
 * @type {string}
 * @default 'get'
 * @static
 */
RequestScreen.GET = 'get';

/**
 * Holds value for method post.
 * @type {string}
 * @default 'post'
 * @static
 */
RequestScreen.POST = 'post';

export default RequestScreen;
