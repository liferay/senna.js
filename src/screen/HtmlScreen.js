'use strict';

import { core } from 'metal';
import { dom, globalEval, globalEvalStyles } from 'metal-dom';
import CancellablePromise from 'metal-promise';
import globals from '../globals/globals';
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
	activate() {
		super.activate();
		this.releaseVirtualDocument();
		this.pendingStyles = null;
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
	 * Customizes logic to append styles into document. Relevant to when
	 * tracking a style by id make sure to re-positions the new style in the
	 * same dom order.
	 * @param {Element} newStyle
	 */
	appendStyleIntoDocument_(newStyle) {
		var isTemporaryStyle = dom.match(newStyle, HtmlScreen.selectors.stylesTemporary);
		if (isTemporaryStyle) {
			this.pendingStyles.push(newStyle);
		}
		if (newStyle.id) {
			var styleInDoc = globals.document.getElementById(newStyle.id);
			if (styleInDoc) {
				styleInDoc.parentNode.insertBefore(newStyle, styleInDoc.nextSibling);
				return;
			}
		}
		globals.document.head.appendChild(newStyle);
	}

	/**
	 * If body is used as surface forces the requested documents to have same id
	 * of the initial page.
	 */
	assertSameBodyIdInVirtualDocument() {
		var bodySurface = this.virtualDocument.querySelector('body');
		if (!globals.document.body.id) {
			globals.document.body.id = 'senna_surface_' + core.getUid();
		}
		if (bodySurface) {
			bodySurface.id = globals.document.body.id;
		}
	}

	/**
	 * @Override
	 */
	disposeInternal() {
		this.disposePendingStyles();
		super.disposeInternal();
	}

	/**
	 * Disposes pending styles if screen get disposed prior to its loading.
	 */
	disposePendingStyles() {
		if (this.pendingStyles) {
			this.pendingStyles.forEach((style) => dom.exitDocument(style));
		}
	}

	/**
	 * @Override
	 */
	evaluateScripts(surfaces) {
		var evaluateTrackedScripts = this.evaluateTrackedResources_(
			globalEval.runScriptsInElement, HtmlScreen.selectors.scripts,
			HtmlScreen.selectors.scriptsTemporary, HtmlScreen.selectors.scriptsPermanent);

		return evaluateTrackedScripts.then(() => super.evaluateScripts(surfaces));
	}

	/**
	 * @Override
	 */
	evaluateStyles(surfaces) {
		this.pendingStyles = [];
		var evaluateTrackedStyles = this.evaluateTrackedResources_(
			globalEvalStyles.runStylesInElement, HtmlScreen.selectors.styles,
			HtmlScreen.selectors.stylesTemporary, HtmlScreen.selectors.stylesPermanent,
			this.appendStyleIntoDocument_.bind(this));

		return evaluateTrackedStyles.then(() => super.evaluateStyles(surfaces));
	}

	/**
	 * Evaluates tracked resources inside incoming fragment and remove existing
	 * temporary resources.
	 * @param {?function()} appendFn Function to append the node into document.
	 * @param {!string} selector Selector used to find resources to track.
	 * @param {!string} selectorTemporary Selector used to find temporary
	 *     resources to track.
	 * @param {!string} selectorPermanent Selector used to find permanent
	 *     resources to track.
	 * @param {!function} opt_appendResourceFn Optional function used to
	 *     evaluate fragment containing resources.
	 * @return {CancellablePromise} Deferred that waits resources evaluation to
	 *     complete.
	 * @private
	 */
	evaluateTrackedResources_(evaluatorFn, selector, selectorTemporary, selectorPermanent, opt_appendResourceFn) {
		var tracked = this.virtualQuerySelectorAll_(selector);
		var temporariesInDoc = this.querySelectorAll_(selectorTemporary);
		var permanentsInDoc = this.querySelectorAll_(selectorPermanent);

		// Adds permanent resources in document to cache.
		permanentsInDoc.forEach((resource) => {
			var resourceKey = this.getResourceKey_(resource);
			if (resourceKey) {
				HtmlScreen.permanentResourcesInDoc[resourceKey] = true;
			}
		});

		var frag = dom.buildFragment();
		tracked.forEach((resource) => {
			var resourceKey = this.getResourceKey_(resource);
			// Do not load permanent resources if already in document.
			if (!HtmlScreen.permanentResourcesInDoc[resourceKey]) {
				frag.appendChild(resource);
			}
			// If resource has key and is permanent add to cache.
			if (resourceKey && dom.match(resource, selectorPermanent)) {
				HtmlScreen.permanentResourcesInDoc[resourceKey] = true;
			}
		});

		return new CancellablePromise((resolve) => {
			evaluatorFn(frag, () => {
				temporariesInDoc.forEach((resource) => dom.exitDocument(resource));
				resolve();
			}, opt_appendResourceFn);
		});
	}

	/**
	 * Extracts a key to identify the resource based on its attributes.
	 * @param {Element} resource
	 * @return {string} Extracted key based on resource attributes in order of
	 *     preference: id, href, src.
	 */
	getResourceKey_(resource) {
		return resource.id || resource.href || resource.src || '';
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
			.then(content => {
				this.allocateVirtualDocumentForContent(content);
				this.resolveTitleFromVirtualDocument();
				this.assertSameBodyIdInVirtualDocument();
				return content;
			});
	}

	/**
	 * Queries elements from virtual document and returns an array of elements.
	 * @param {!string} selector
	 * @return {array.<Element>}
	 */
	virtualQuerySelectorAll_(selector) {
		return Array.prototype.slice.call(this.virtualDocument.querySelectorAll(selector));
	}

	/**
	 * Queries elements from document and returns an array of elements.
	 * @param {!string} selector
	 * @return {array.<Element>}
	 */
	querySelectorAll_(selector) {
		return Array.prototype.slice.call(globals.document.querySelectorAll(selector));
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

}

/**
 * Helper selectors for tracking resources.
 * @type {object}
 * @protected
 * @static
 */
HtmlScreen.selectors = {
	scripts: 'script[data-senna-track]',
	scriptsPermanent: 'script[data-senna-track="permanent"]',
	scriptsTemporary: 'script[data-senna-track="temporary"]',
	styles: 'style[data-senna-track],link[data-senna-track]',
	stylesPermanent: 'style[data-senna-track="permanent"],link[data-senna-track="permanent"]',
	stylesTemporary: 'style[data-senna-track="temporary"],link[data-senna-track="temporary"]'
};

/**
 * Caches permanent resource keys.
 * @type {object}
 * @protected
 * @static
 */
HtmlScreen.permanentResourcesInDoc = {};

export default HtmlScreen;