'use strict';

import Screen from '../../src/screen/Screen';
import Surface from '../../src/surface/Surface';
import CancellablePromise from 'bower:metal-promise/src/promise/Promise';

describe('Screen', function() {

	it('should expose lifecycle activate', function() {
		assert.doesNotThrow(function() {
			new Screen().activate();
		});
	});

	it('should expose lifecycle deactivate', function() {
		assert.doesNotThrow(function() {
			new Screen().deactivate();
		});
	});

	it('should expose lifecycle beforeDeactivate', function() {
		assert.doesNotThrow(function() {
			new Screen().beforeDeactivate();
		});
	});

	it('should expose lifecycle load', function() {
		assert.doesNotThrow(function() {
			new Screen().load();
		});
	});

	it('should expose lifecycle getSurfaceContent', function() {
		assert.doesNotThrow(function() {
			new Screen().getSurfaceContent();
		});
	});

	it('should expose lifecycle dispose', function() {
		assert.doesNotThrow(function() {
			new Screen().dispose();
		});
	});

	it('should expose lifecycle flip', function() {
		assert.doesNotThrow(function() {
			new Screen().flip({});
		});
	});

	it('should wait to flip all surfaces', function(done) {
		var surfaces = {
			surface1: new Surface('surface1'),
			surface2: new Surface('surface2')
		};
		var stub1 = sinon.stub();
		var stub2 = sinon.stub();
		surfaces.surface1.show = function() {
			stub1();
			return CancellablePromise.resolve();
		};
		surfaces.surface2.show = function() {
			stub2();
			return CancellablePromise.resolve();
		};
		new Screen().flip(surfaces).then(function() {
			assert.strictEqual(1, stub1.callCount);
			assert.strictEqual(1, stub2.callCount);
			done();
		});
	});

	it('should get screen id', function() {
		var screen = new Screen();
		assert.ok(screen.getId());
		screen.setId('otherId');
		assert.strictEqual('otherId', screen.getId());
	});

	it('should get screen title', function() {
		var screen = new Screen();
		assert.strictEqual(null, screen.getTitle());
		screen.setTitle('other');
		assert.strictEqual('other', screen.getTitle());
	});

	it('should check if object implements a screen', function() {
		assert.ok(Screen.isImplementedBy(new Screen()));
	});

});