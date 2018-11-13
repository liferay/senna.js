'use strict';

import { exitDocument } from 'metal-dom';
import globals from '../globals/globals';
import Uri from 'metal-uri';

/**
 * A collection of static utility functions.
 * @const
 */
class utils {

	/**
	 * Copies attributes form source node to target node.
	 * @return {void}
	 * @static
	 */
	static copyNodeAttributes(source, target) {
		Array.prototype.slice.call(source.attributes).forEach((attribute) => target.setAttribute(attribute.name, attribute.value));
	}

	/**
	 * Gets the current browser path including hashbang.
	 * @return {!string}
	 * @static
	 */
	static getCurrentBrowserPath() {
		return this.getCurrentBrowserPathWithoutHash() + globals.window.location.hash;
	}

	/**
	 * Gets the current browser path excluding hashbang.
	 * @return {!string}
	 * @static
	 */
	static getCurrentBrowserPathWithoutHash() {
		return globals.window.location.pathname + globals.window.location.search;
	}

	/**
	 * Gets the given node offset coordinates.
	 * @return {!object}
	 * @static
	 */
	static getNodeOffset(node) {
		let [offsetLeft, offsetTop] = [0, 0];
		do {
			offsetLeft += node.offsetLeft;
			offsetTop += node.offsetTop;
			node = node.offsetParent;
		} while (node);
		return {
			offsetLeft,
			offsetTop
		};
	}

	/**
	 * Extracts the path part of an url.
	 * @return {!string}
	 * @static
	 */
	static getUrlPath(url) {
		var uri = new Uri(url);
		return uri.getPathname() + uri.getSearch() + uri.getHash();
	}

	/**
	 * Extracts the path part of an url without hashbang.
	 * @return {!string}
	 * @static
	 */
	static getUrlPathWithoutHash(url) {
		var uri = new Uri(url);
		return uri.getPathname() + uri.getSearch();
	}

	/**
	 * Extracts the path part of an url without hashbang and query search.
	 * @return {!string}
	 * @static
	 */
	static getUrlPathWithoutHashAndSearch(url) {
		var uri = new Uri(url);
		return uri.getPathname();
	}

	/**
	 * Checks if url is in the same browser current url excluding the hashbang.
	 * @param  {!string} url
	 * @return {boolean}
	 * @static
	 */
	static isCurrentBrowserPath(url) {
		if (url) {
			const currentBrowserPath = this.getCurrentBrowserPathWithoutHash();
			// the getUrlPath will create a Uri and will normalize the path and
			// remove the trailling '/' for properly comparing paths.
			return utils.getUrlPathWithoutHash(url) === this.getUrlPath(currentBrowserPath);
		}
		return false;
	}

	/**
	 * Returns true if HTML5 History api is supported.
	 * @return {boolean}
	 * @static
	 */
	static isHtml5HistorySupported() {
		return !!(globals.window.history && globals.window.history.pushState);
	}

	/**
	 * Checks if a given url is a valid http(s) uri and returns the formed Uri
	 * or false if the parsing failed
	 * @return {Uri|boolean}
	 * @static
	 */
	static isWebUri(url) {
		try {
			return new Uri(url);
		} catch (err) {
			console.error(`${err.message} ${url}`);
			return false;
		}
	}

	/**
	 * Removes all attributes form node.
	 * @return {void}
	 * @static
	 */
	static clearNodeAttributes(node) {
		Array.prototype.slice.call(node.attributes).forEach((attribute) => node.removeAttribute(attribute.name));
	}

	/**
	 * Remove elements from the document.
	 * @param {!Array<Element>} elements
	 */
	static removeElementsFromDocument(elements) {
		elements.forEach((element) => exitDocument(element));
	}

	/**
	* Removes trailing slash in path.
	* @param {!string}
	* @return {string}
	*/
	static removePathTrailingSlash(path) {
		var length = path ? path.length : 0;
		if (length > 1 && path[length - 1] === '/') {
			path = path.substr(0, length - 1);
		}
		return path;
	}

	/**
	 * Adds a random suffix to the href attribute of the element.
	 * @param {!element} element
	 * @return {element}
	 */
	static setElementWithRandomHref(element) {
		element.href = element.href + '?q=' + Math.random();
		return element;
	}

	/**
	 * Overrides document referrer
	 * @param {string} referrer
	 * @static
	 */
	static setReferrer(referrer) {
		Object.defineProperty(globals.document, 'referrer', {
			configurable: true,
			get: function() {
				return referrer;
			}
		});
	}
}

export default utils;
