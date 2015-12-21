'use strict';

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
	disposeInternal() {
		this.virtualDocumentElement = null;
		super.disposeInternal();
	}

	/**
	 * @inheritDoc
	 */
	getSurfaceContent(surfaceId) {
		var surface = this.virtualDocumentElement.querySelector('#' + surfaceId);
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
			.then(content => this.resolveContentFromHtmlString(content))
			.thenCatch(err => {
				throw err;
			});
	}

	/**
	 * Resolves the screen content from the response string.
	 * @param {XMLHttpRequest} xhr
	 */
	resolveContentFromHtmlString(htmlString) {
		if (!this.virtualDocumentElement) {
			this.virtualDocumentElement = document.documentElement.cloneNode();
		}

		this.virtualDocumentElement.innerHTML = htmlString;

		var title = this.virtualDocumentElement.querySelector(this.titleSelector);
		if (title) {
			this.setTitle(title.innerHTML.trim());
		}
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