'use strict';

import { isDefAndNotNull } from 'metal';
import Ajax from 'metal-ajax';
import { MultiMap } from 'metal-structs';
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
			error.statusCode = status;
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
		var uri = new Uri(path);

		uri.setHostname(globals.window.location.hostname);
		uri.setProtocol(globals.window.location.protocol);

		if (globals.window.location.port) {
			uri.setPort(globals.window.location.port);
		}

		if (UA.isIeOrEdge && this.httpMethod === RequestScreen.GET) {
			return uri.makeUnique().toString();
		}

		return uri.toString();
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
			var requestPath = request.requestPath;
			var responseUrl = this.maybeExtractResponseUrlFromRequest(request);
			if (responseUrl) {
				requestPath = responseUrl;
			}
			if (UA.isIeOrEdge && this.httpMethod === RequestScreen.GET) {
				requestPath = new Uri(requestPath).removeUnique().toString();
			}
			return utils.getUrlPath(requestPath);
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
   * Returns the form data
   * This method can be extended in order to have a custom implementation of the form params
   * @param {!Element} formElement
   * @param {!Element} submittedButtonElement
   * @return {!FormData}
   */
	getFormData(formElement, submittedButtonElement) {
    let formData = new FormData(formElement);
    this.maybeAppendSubmitButtonValue_(formData, submittedButtonElement);
    return formData;
  }

	/**
	 * @inheritDoc
	 */
	load(path) {
		const cache = this.getCache();
		if (isDefAndNotNull(cache)) {
			return CancellablePromise.resolve(cache);
		}
		let body = null;
		let httpMethod = this.httpMethod;
		const headers = new MultiMap();
		Object.keys(this.httpHeaders).forEach(header => headers.add(header, this.httpHeaders[header]));
		if (globals.capturedFormElement) {
			this.addSafariXHRPolyfill();
			body = this.getFormData(globals.capturedFormElement, globals.capturedFormButtonElement);
			httpMethod = RequestScreen.POST;
			if (UA.isIeOrEdge) {
				headers.add('If-None-Match', '"0"');
			}
		}
		const requestPath = this.formatLoadPath(path);
		return Ajax
			.request(requestPath, httpMethod, body, headers, null, this.timeout)
			.then(xhr => {
				this.removeSafariXHRPolyfill();
				this.setRequest(xhr);
				this.assertValidResponseStatusCode(xhr.status);
				if (httpMethod === RequestScreen.GET && this.isCacheable()) {
					this.addCache(xhr.responseText);
				}
				xhr.requestPath = requestPath;
				return xhr.responseText;
			})
			.catch((reason) => {
				this.removeSafariXHRPolyfill();
				switch (reason.message) {
					case errors.REQUEST_TIMEOUT:
						reason.timeout = true;
						break;
					case errors.REQUEST_ERROR:
						reason.requestError = true;
						break;
					case errors.REQUEST_PREMATURE_TERMINATION:
						reason.requestError = true;
						reason.requestPrematureTermination = true;
						break;
				}
				throw reason;
			});
	}

	/**
	 * Adds aditional data to the body of the request in case a submit button
	 * is captured during form submission.
	 * @param {!FormData} body The FormData containing the request body.
   * @param {!Element} submittedButtonElement
   * @protected
	 */
	maybeAppendSubmitButtonValue_(formData, submittedButtonElement) {
		if (submittedButtonElement && submittedButtonElement.name) {
      formData.append(submittedButtonElement.name, submittedButtonElement.value);
		}
	}

	/**
	 * The following method tries to extract the response url value by checking
	 * the custom response header 'X-Request-URL' if proper value is not present
	 * in XMLHttpRequest. The value of responseURL will be the final URL
	 * obtained after any redirects. Internet Explorer, Edge and Safari <= 7
	 * does not yet support the feature. For more information see:
	 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseURL
	 * https://xhr.spec.whatwg.org/#the-responseurl-attribute
	 * @param {XMLHttpRequest} request
	 * @return {?string} Response url best match.
	 */
	maybeExtractResponseUrlFromRequest(request) {
		var responseUrl = request.responseURL;
		if (responseUrl) {
			return responseUrl;
		}
		return request.getResponseHeader(RequestScreen.X_REQUEST_URL_HEADER);
	}

	/**
	 * This function set attribute data-safari-temp-disabled to 
	 * true and set disable attribute of an input type="file" tag
	 * is used as a polyfill for iOS 11.3 Safari / macOS Safari 11.1 
	 * empty <input type="file"> XHR bug.
	 * https://github.com/rails/rails/issues/32440
	 * https://bugs.webkit.org/show_bug.cgi?id=184490
	 */
	addSafariXHRPolyfill() {
		if (globals.capturedFormElement && UA.isSafari) {
			let inputs = globals.capturedFormElement.querySelectorAll('input[type="file"]:not([disabled])');
			for (let index = 0; index < inputs.length; index++) {
				let input = inputs[index];
				if (input.files.length > 0) {
					return;
				}
				input.setAttribute('data-safari-temp-disabled', 'true');
				input.setAttribute('disabled', '');
			}
		}
	}

	/**
	 * This function remove attribute data-safari-temp-disabled and disable attribute
	 * of an input type="file" tag is used as a polyfill for iOS 11.3 Safari / macOS Safari 11.1
	 * empty <input type="file"> XHR bug.
	 * https://github.com/rails/rails/issues/32440
	 * https://bugs.webkit.org/show_bug.cgi?id=184490
	 */
	removeSafariXHRPolyfill() {
		if (globals.capturedFormElement && UA.isSafari) {
			let inputs = globals.capturedFormElement.querySelectorAll('input[type="file"][data-safari-temp-disabled]');
			for (let index = 0; index < inputs.length; index++) {
				const input = inputs[index];
				input.removeAttribute('data-safari-temp-disabled');
				input.removeAttribute('disabled');
			}
		}
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

/**
 * Fallback http header to retrieve response request url.
 * @type {string}
 * @default 'X-Request-URL'
 * @static
 */
RequestScreen.X_REQUEST_URL_HEADER = 'X-Request-URL';

export default RequestScreen;
