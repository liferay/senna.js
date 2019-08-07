/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

'use strict';

import {core} from 'metal';
import dom from 'metal-dom';
import Surface from '../../src/surface/Surface';

describe('Surface', () => {
	describe('Constructor', () => {
		it('throws error when surface id not specified', () => {
			assert.throws(() => {
				new Surface();
			}, Error);
		});

		it('not throw error when surface id specified', () => {
			assert.doesNotThrow(() => {
				new Surface('id');
			});
		});
	});

	describe('Surfaces', () => {
		it('create surface child when adding screen content to surface', () => {
			enterDocumentSurfaceElement('surfaceId');
			const surface = new Surface('surfaceId');
			const surfaceChild = surface.addContent('screenId', 'content');
			assert.ok(core.isElement(surfaceChild));
			exitDocumentSurfaceElement('surfaceId');
		});

		it('create surface child when adding screen content to surface outside document', () => {
			const surface = new Surface('virtualSurfaceId');
			const surfaceChild = surface.addContent('screenId', 'content');
			assert.strictEqual('content', surfaceChild.innerHTML);
		});

		it('wrap initial surface content as default child if default wrapper missing', () => {
			enterDocumentSurfaceElement('surfaceId', 'default');
			const surface = new Surface('surfaceId');
			assert.strictEqual('default', surface.defaultChild.innerHTML);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('add screen content to surface child', () => {
			enterDocumentSurfaceElement('surfaceId');
			const surface = new Surface('surfaceId');
			const surfaceChild = surface.addContent('screenId', 'content');
			assert.strictEqual('content', surfaceChild.innerHTML);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('add empty string as screen content to surface child', () => {
			enterDocumentSurfaceElement('surfaceId');
			const surface = new Surface('surfaceId');
			const surfaceChild = surface.addContent('screenId', '');
			assert.strictEqual('', surfaceChild.innerHTML);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('not add null/undefined as screen content to surface child', () => {
			enterDocumentSurfaceElement('surfaceId');
			const surface = new Surface('surfaceId');
			let surfaceChild = surface.addContent('screenId', undefined);
			assert.strictEqual(surface.defaultChild, surfaceChild);
			surfaceChild = surface.addContent('screenId', null);
			assert.strictEqual(surface.defaultChild, surfaceChild);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('surface child be inserted into surface element', () => {
			enterDocumentSurfaceElement('surfaceId');
			const surface = new Surface('surfaceId');
			const surfaceChild = surface.addContent('screenId', 'content');
			assert.strictEqual(surface.getElement(), surfaceChild.parentNode);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('surface child enter document invisible', () => {
			enterDocumentSurfaceElement('surfaceId');
			const surface = new Surface('surfaceId');
			const surfaceChild = surface.addContent('screenId', 'content');
			assert.strictEqual('none', surfaceChild.style.display);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('surface child become visible for its screen', () => {
			enterDocumentSurfaceElement('surfaceId');
			const surface = new Surface('surfaceId');
			const surfaceChild = surface.addContent('screenId', 'content');
			surface.show('screenId');
			assert.strictEqual('block', surfaceChild.style.display);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('only one surface child be visible at time', () => {
			enterDocumentSurfaceElement('surfaceId');
			const surface = new Surface('surfaceId');
			const surfaceChild = surface.addContent('screenId', 'content');
			surface.show('screenId');
			const surfaceChildNext = surface.addContent(
				'screenNextId',
				'content'
			);
			assert.strictEqual('none', surfaceChildNext.style.display);
			surface.show('screenNextId');
			assert.strictEqual('none', surfaceChild.style.display);
			assert.strictEqual('block', surfaceChildNext.style.display);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('remove screen content from surface child', () => {
			enterDocumentSurfaceElement('surfaceId');
			const surface = new Surface('surfaceId');
			surface.addContent('screenId', 'content');
			surface.remove('screenId');
			assert.strictEqual(null, surface.getChild('screenId'));
			exitDocumentSurfaceElement('surfaceId');
		});

		it('remove screen content from surface child outside document', () => {
			enterDocumentSurfaceElement('surfaceId');
			const surface = new Surface('surfaceId');
			surface.remove('screenId');
			assert.strictEqual(null, surface.getChild('screenId'));
			exitDocumentSurfaceElement('surfaceId');
		});

		it('create surface child relating surface id and screen id', () => {
			const surface = new Surface('surfaceId');
			const surfaceChild = surface.createChild('screenId');
			assert.strictEqual('surfaceId-screenId', surfaceChild.id);
		});

		it('get surface element by surfaceId', () => {
			const surfaceElement = enterDocumentSurfaceElement('surfaceId');
			const surface = new Surface('surfaceId');
			assert.strictEqual(surfaceElement, surface.getElement());
			exitDocumentSurfaceElement('surfaceId');
		});

		it('get surface id', () => {
			const surface = new Surface('surfaceId');
			assert.strictEqual('surfaceId', surface.getId());
			surface.setId('otherId');
			assert.strictEqual('otherId', surface.getId());
		});

		it('show default surface child if screen id not found and hide when found', () => {
			const defaultChild = enterDocumentSurfaceElement(
				'surfaceId-default'
			);
			enterDocumentSurfaceElement('surfaceId').appendChild(defaultChild);
			const surface = new Surface('surfaceId');
			surface.show('screenId');
			const surfaceChild = surface.addContent('screenId', 'content');
			assert.strictEqual('none', surfaceChild.style.display);
			assert.strictEqual('block', defaultChild.style.display);
			surface.show('screenId');
			assert.strictEqual('block', surfaceChild.style.display);
			assert.strictEqual('none', defaultChild.style.display);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('remove surface child content if already in document', () => {
			const surfaceChild = enterDocumentSurfaceElement(
				'surfaceId-screenId'
			);
			enterDocumentSurfaceElement('surfaceId').appendChild(surfaceChild);
			surfaceChild.innerHTML = 'temp';
			const surface = new Surface('surfaceId');
			surface.addContent('screenId', 'content');
			assert.strictEqual('content', surfaceChild.innerHTML);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('be able to overwrite default transition', () => {
			enterDocumentSurfaceElement('surfaceId');
			const surface = new Surface('surfaceId');
			surface.addContent('screenId', 'content');
			const transitionFn = sinon.stub();
			surface.setTransitionFn(transitionFn);
			surface.show('screenId');
			assert.strictEqual(1, transitionFn.callCount);
			assert.strictEqual(transitionFn, surface.getTransitionFn());
			exitDocumentSurfaceElement('surfaceId');
		});

		it('be able to wait deferred transition before removing visible surface child', done => {
			enterDocumentSurfaceElement('surfaceId');
			const surface = new Surface('surfaceId');
			const surfaceChild = surface.addContent('screenId', 'content');
			const surfaceChildNext = surface.addContent(
				'screenNextId',
				'content'
			);
			const transitionFn = () => Promise.resolve();
			surface.setTransitionFn(transitionFn);
			surface.show('screenId');
			surface.show('screenNextId').then(() => {
				assert.ok(!surfaceChild.parentNode);
				assert.ok(surfaceChildNext.parentNode);
				done();
			});
			assert.ok(surfaceChild.parentNode);
			assert.ok(surfaceChildNext.parentNode);
			exitDocumentSurfaceElement('surfaceId');
		});
	});
});

function enterDocumentSurfaceElement(surfaceId, opt_content) {
	dom.enterDocument(
		`<div id="${surfaceId}">${opt_content ? opt_content : ''}</div>`
	);
	return document.getElementById(surfaceId);
}

function exitDocumentSurfaceElement(surfaceId) {
	return dom.exitDocument(document.getElementById(surfaceId));
}
