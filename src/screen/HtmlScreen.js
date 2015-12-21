'use strict';

import core from 'bower:metal/src/core';
import globals from '../globals/globals';
import RequestScreen from './RequestScreen';

class HtmlScreen extends RequestScreen {

	/**
	 * Screen class that perform a request and extracts surface contents from
	 * the response content.
	 * @constructor
	 * @extends {RequestScreen}
	 */
	constructor() {
		super();

		/**
		 * Holds the title selector. Relevant to extract the <code><title></code>
		 * element from request fragments to use as the screen title.
		 * @type {!string}
		 * @default title
		 * @protected
		 */
		this.titleSelector = 'title';
	}

	/**
	 * @inheritDoc
	 */
	getSurfaceContent(surfaceId, resolvedContentAsElement) {
		var surface = resolvedContentAsElement.querySelector('#' + surfaceId);
		if (surface) {
			return surface.innerHTML;
		}
	}

	/**
	 * Gets the title selector.
	 * @return {!string}
	 */
	getTitleSelector() {
		return this.titleSelector;
	}

	/**
	 * @inheritDoc
	 */
	load(path) {
		return super.load(path)
			.then(content => this.resolveContent(content))
			.thenCatch(err => {
				throw err;
			});
	}

	/**
	 * Resolves the screen content as fragment from the response.
	 * @param {XMLHttpRequest} xhr
	 * @return {?Element}
	 */
	resolveContent(content) {
		if (core.isString(content)) {
			var div = globals.document.createElement('div');
			div.innerHTML = content;
			content = div;
		}

		var title = content.querySelector(this.titleSelector);
		if (title) {
			this.setTitle(title.innerHTML.trim());
		}
		return content;
	}

	/**
	 * Sets the title selector.
	 * @param {!string} titleSelector
	 */
	setTitleSelector(titleSelector) {
		this.titleSelector = titleSelector;
	}


}

export default HtmlScreen;