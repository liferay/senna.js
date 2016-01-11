'use strict';

import core from 'bower:metal/src/core';
import Ajax from 'bower:metal-ajax/src/Ajax';
import MultiMap from 'bower:metal-multimap/src/MultiMap';
import CancellablePromise from 'bower:metal-promise/src/promise/Promise';
import globals from '../globals/globals';
import Screen from './Screen';

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
	 * @inheritDoc
	 */
	beforeUpdateHistoryPath(path) {
		var redirectPath = this.getRequestResponsePath();
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
		if (state.senna && state.form && state.navigatePath === state.path) {
			return null;
		}
		return state;
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
	 * Gets request response path.
	 * @return {string=}
	 */
	getRequestResponsePath() {
		var request = this.getRequest();
		if (request) {
			var link = globals.document.createElement('a');
			link.href = request.responseURL;
			return link.pathname + link.search + link.hash;
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
			.request(path, httpMethod, body, headers, null, this.timeout)
			.then(xhr => {
				this.setRequest(xhr);
				if (!this.isValidResponseStatusCode(xhr.status)) {
					var error = new Error('Invalid response status code. ' +
						'To customize which status codes are valid, ' +
						'overwrite `screen.isValidResponseStatusCode` method.');
					error.responseError = true;
					throw error;
				}
				if (httpMethod === RequestScreen.GET && this.isCacheable()) {
					this.addCache(xhr.responseText);
				}
				return xhr.responseText;
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