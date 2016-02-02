'use strict';

import { core } from 'metal';

class Route {

	/**
	 * Route class.
	 * @param {!string|RegExp|Function} path
	 * @param {!Function} handler
	 * @constructor
	 */
	constructor(path, handler) {
		if (!core.isDefAndNotNull(path)) {
			throw new Error('Route path not specified.');
		}
		if (!core.isFunction(handler)) {
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
	 * @param {!string} value Path to test and may contains the querystring
	 *     part.
	 * @return {Boolean} Returns true if matches any route.
	 */
	matchesPath(value) {
		var path = this.path;

		if (core.isString(path)) {
			return value === path;
		}
		if (core.isFunction(path)) {
			return path(value);
		}
		if (path instanceof RegExp) {
			return value.search(path) > -1;
		}

		return false;
	}

}

export default Route;
