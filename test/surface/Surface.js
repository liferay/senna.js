'use strict';

import { core } from 'metal';
import dom from 'metal-dom';
import Surface from '../../src/surface/Surface';
import CancellablePromise from 'metal-promise';

describe('Surface', function() {

	describe('Constructor', () => {
		it('should throws error when surface id not specified', () => {
			assert.throws(() => {
				new Surface();
			}, Error);
		});

		it('should not throw error when surface id specified', () => {
			assert.doesNotThrow(() => {
				new Surface('id');
			});
		});
	});

	describe('Surfaces', () => {
		it('should create surface child when adding screen content to surface', () => {
			enterDocumentSurfaceElement('surfaceId');
			var surface = new Surface('surfaceId');
			var surfaceChild = surface.addContent('screenId', 'content');
			assert.ok(core.isElement(surfaceChild));
			exitDocumentSurfaceElement('surfaceId');
		});

		it('should create surface child when adding screen content to surface outside document', () => {
			var surface = new Surface('virtualSurfaceId');
			var surfaceChild = surface.addContent('screenId', 'content');
			assert.strictEqual('content', surfaceChild.innerHTML);
		});

		it('should wrap initial surface content as default child if default wrapper missing', () => {
			enterDocumentSurfaceElement('surfaceId', 'default');
			var surface = new Surface('surfaceId');
			assert.strictEqual('default', surface.defaultChild.innerHTML);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('should add screen content to surface child', () => {
			enterDocumentSurfaceElement('surfaceId');
			var surface = new Surface('surfaceId');
			var surfaceChild = surface.addContent('screenId', 'content');
			assert.strictEqual('content', surfaceChild.innerHTML);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('should add empty string as screen content to surface child', () => {
			enterDocumentSurfaceElement('surfaceId');
			var surface = new Surface('surfaceId');
			var surfaceChild = surface.addContent('screenId', '');
			assert.strictEqual('', surfaceChild.innerHTML);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('should not add null/undefined as screen content to surface child', () => {
			enterDocumentSurfaceElement('surfaceId');
			var surface = new Surface('surfaceId');
			var surfaceChild = surface.addContent('screenId', undefined);
			assert.strictEqual(surface.defaultChild, surfaceChild);
			surfaceChild = surface.addContent('screenId', null);
			assert.strictEqual(surface.defaultChild, surfaceChild);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('should surface child be inserted into surface element', () => {
			enterDocumentSurfaceElement('surfaceId');
			var surface = new Surface('surfaceId');
			var surfaceChild = surface.addContent('screenId', 'content');
			assert.strictEqual(surface.getElement(), surfaceChild.parentNode);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('should surface child enter document invisible', () => {
			enterDocumentSurfaceElement('surfaceId');
			var surface = new Surface('surfaceId');
			var surfaceChild = surface.addContent('screenId', 'content');
			assert.strictEqual('none', surfaceChild.style.display);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('should surface child become visible for its screen', () => {
			enterDocumentSurfaceElement('surfaceId');
			var surface = new Surface('surfaceId');
			var surfaceChild = surface.addContent('screenId', 'content');
			surface.show('screenId');
			assert.strictEqual('block', surfaceChild.style.display);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('should only one surface child be visible at time', () => {
			enterDocumentSurfaceElement('surfaceId');
			var surface = new Surface('surfaceId');
			var surfaceChild = surface.addContent('screenId', 'content');
			surface.show('screenId');
			var surfaceChildNext = surface.addContent('screenNextId', 'content');
			assert.strictEqual('none', surfaceChildNext.style.display);
			surface.show('screenNextId');
			assert.strictEqual('none', surfaceChild.style.display);
			assert.strictEqual('block', surfaceChildNext.style.display);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('should remove screen content from surface child', () => {
			enterDocumentSurfaceElement('surfaceId');
			var surface = new Surface('surfaceId');
			surface.addContent('screenId', 'content');
			surface.remove('screenId');
			assert.strictEqual(null, surface.getChild('screenId'));
			exitDocumentSurfaceElement('surfaceId');
		});

		it('should remove screen content from surface child outside document', () => {
			enterDocumentSurfaceElement('surfaceId');
			var surface = new Surface('surfaceId');
			surface.remove('screenId');
			assert.strictEqual(null, surface.getChild('screenId'));
			exitDocumentSurfaceElement('surfaceId');
		});

		it('should create surface child relating surface id and screen id', () => {
			var surface = new Surface('surfaceId');
			var surfaceChild = surface.createChild('screenId');
			assert.strictEqual('surfaceId-screenId', surfaceChild.id);
		});

		it('should get surface element by surfaceId', () => {
			var surfaceElement = enterDocumentSurfaceElement('surfaceId');
			var surface = new Surface('surfaceId');
			assert.strictEqual(surfaceElement, surface.getElement());
			exitDocumentSurfaceElement('surfaceId');
		});

		it('should get surface id', () => {
			var surface = new Surface('surfaceId');
			assert.strictEqual('surfaceId', surface.getId());
			surface.setId('otherId');
			assert.strictEqual('otherId', surface.getId());
		});

		it('should show default surface child if screen id not found and hide when found', () => {
			var defaultChild = enterDocumentSurfaceElement('surfaceId-default');
			enterDocumentSurfaceElement('surfaceId').appendChild(defaultChild);
			var surface = new Surface('surfaceId');
			surface.show('screenId');
			var surfaceChild = surface.addContent('screenId', 'content');
			assert.strictEqual('none', surfaceChild.style.display);
			assert.strictEqual('block', defaultChild.style.display);
			surface.show('screenId');
			assert.strictEqual('block', surfaceChild.style.display);
			assert.strictEqual('none', defaultChild.style.display);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('should remove surface child content if already in document', () => {
			var surfaceChild = enterDocumentSurfaceElement('surfaceId-screenId');
			enterDocumentSurfaceElement('surfaceId').appendChild(surfaceChild);
			surfaceChild.innerHTML = 'temp';
			var surface = new Surface('surfaceId');
			surface.addContent('screenId', 'content');
			assert.strictEqual('content', surfaceChild.innerHTML);
			exitDocumentSurfaceElement('surfaceId');
		});

		it('should be able to overwrite default transition', () => {
			enterDocumentSurfaceElement('surfaceId');
			var surface = new Surface('surfaceId');
			surface.addContent('screenId', 'content');
			var transitionFn = sinon.stub();
			surface.setTransitionFn(transitionFn);
			surface.show('screenId');
			assert.strictEqual(1, transitionFn.callCount);
			assert.strictEqual(transitionFn, surface.getTransitionFn());
			exitDocumentSurfaceElement('surfaceId');
		});

		it('should be able to wait deferred transition before removing visible surface child', (done) => {
			enterDocumentSurfaceElement('surfaceId');
			var surface = new Surface('surfaceId');
			var surfaceChild = surface.addContent('screenId', 'content');
			var surfaceChildNext = surface.addContent('screenNextId', 'content');
			var transitionFn = () => CancellablePromise.resolve();
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

		it('should transition deferred be cancellable', (done) => {
			var surface = new Surface('surfaceId');
			var transitionFn = () => CancellablePromise.resolve();
			surface.setTransitionFn(transitionFn);
			surface.transition(null, null).catch(() => done()).cancel();
		});
	});

});

function enterDocumentSurfaceElement(surfaceId, opt_content) {
	dom.enterDocument('<div id="' + surfaceId + '">' + (opt_content ? opt_content : '') + '</div>');
	return document.getElementById(surfaceId);
}

function exitDocumentSurfaceElement(surfaceId) {
	return dom.exitDocument(document.getElementById(surfaceId));
}
