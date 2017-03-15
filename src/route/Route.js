'use strict';

import { isDefAndNotNull, isFunction, isString } from 'metal';
import { extractData, parse, toRegex } from 'metal-path-parser';

class Route {

	/**
	 * Route class.
	 * @param {!string|RegExp|Function} path
	 * @param {!Function} handler
	 * @constructor
	 */
	constructor(path, handler) {
		if (!isDefAndNotNull(path)) {
			throw new Error('Route path not specified.');
		}
		if (!isFunction(handler)) {
			throw new Error('Route handler is not a function.');
		}

		/**
		 * Defines the handler which will execute once a URL in the application
		 * matches the path.
		 * @type {!Function}
		 * @protected
		 */
		this.handler = handler;

		/**
		 * Defines the path which will trigger the route handler.
		 * @type {!string|RegExp|Function}
		 * @protected
		 */
		this.path = path;
	}

	/**
	* Builds parsed data (regex and tokens) for this route.
	* @return {!Object}
	* @protected
	*/
	buildParsedData_() {
		if (!this.parsedData_) {
			var tokens = parse(this.path);
			var regex = toRegex(tokens);
			this.parsedData_ = {
				regex,
				tokens
			};
		}
		return this.parsedData_;
	}

	/**
	 * Extracts param data from the given path, according to this route.
	 * @param {string} path The url path to extract params from.
	 * @return {Object} The extracted data, if the path matches this route, or
	 *     null otherwise.
	 */
	extractParams(path) {
		if (isString(this.path)) {
			return extractData(this.buildParsedData_().tokens, path);
		}
		return {};
	}

	/**
	 * Gets the route handler.
	 * @return {!Function}
	 */
	getHandler() {
		return this.handler;
	}

	/**
	 * Gets the route path.
	 * @return {!string|RegExp|Function}
	 */
	getPath() {
		return this.path;
	}

	/**
 	 * Matches if the router can handle the tested path.
 	 * @param {!string} value Path to test (may contain the querystring part).
	 * @return {boolean} Returns true if matches any route.
	 */
	matchesPath(value) {
		var path = this.path;

		if (isFunction(path)) {
			return path(value);
		}
		if (isString(path)) {
			path = this.buildParsedData_().regex;
		}
		if (path instanceof RegExp) {
			return value.search(path) > -1;
		}

		return false;
	}

}

export default Route;
