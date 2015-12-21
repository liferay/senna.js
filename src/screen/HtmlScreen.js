'use strict';

import core from 'bower:metal/src/core';
import dom from 'bower:metal/src/dom/dom';
import RequestScreen from './RequestScreen';
import Surface from '../surface/Surface';

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
	getSurfaceContent(surfaceId) {
		var surface = this.resolvedContentAsFragment.querySelector('#' + surfaceId);
		if (surface) {
			var defaultChild = surface.querySelector('#' + surfaceId + '-' + Surface.DEFAULT);
			if (defaultChild) {
				return defaultChild.innerHTML;
			}
			return surface.innerHTML; // If default content not found, use surface content
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
			content = dom.buildFragment(content);
		}
		var title = content.querySelector(this.titleSelector);
		if (title) {
			this.setTitle(title.innerHTML.trim());
		}
		this.resolvedContentAsFragment = content;
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