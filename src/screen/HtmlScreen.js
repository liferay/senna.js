'use strict';

import globals from '../globals/globals';
import RequestScreen from './RequestScreen';
import Surface from '../surface/Surface';
import dataAttributes from '../app/dataAttributes';

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
	activate() {
		super.activate();
		this.releaseVirtualDocument();
	}

	/**
	 * Allocates virtual document for content. After allocated virtual document
	 * can be accessed by <code>this.virtualDocument</code>.
	 * @param {!string} htmlString
	 */
	allocateVirtualDocumentForContent(htmlString) {
		if (!this.virtualDocument) {
			this.virtualDocument = globals.document.createElement('html');
		}
		this.virtualDocument.innerHTML = htmlString;
	}

	/**
	 * @inheritDoc
	 */
	getSurfaceContent(surfaceId) {
		var surface = this.virtualDocument.querySelector('#' + surfaceId);
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
			.then(content => this.allocateVirtualDocumentForContent(content))
			.then(() => this.resolveTitleFromVirtualDocument())
			.then(() => this.maybeSetBodyIdInVirtualDocument())
			.catch(err => {
				throw err;
			});
	}

	/**
	 * Releases virtual document allocated for content.
	 */
	releaseVirtualDocument() {
		this.virtualDocument = null;
	}

	/**
	 * Resolves title from allocated virtual document.
	 */
	resolveTitleFromVirtualDocument() {
		var title = this.virtualDocument.querySelector(this.titleSelector);
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

	/**
	 * If body is used as surface forces the requested documents to have same id
	 * of the initial page.
	 */
	maybeSetBodyIdInVirtualDocument() {
		var bodySurface = this.virtualDocument.querySelector('body[' + dataAttributes.surface + ']');
		if (bodySurface) {
			bodySurface.id = globals.document.body.id;
		}
	}

}

export default HtmlScreen;