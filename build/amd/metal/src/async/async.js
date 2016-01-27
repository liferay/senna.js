/*!
 * Polyfill from Google's Closure Library.
 * Copyright 2013 The Closure Library Authors. All Rights Reserved.
 */

'use strict';

define(['exports'], function (exports) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var async = {};

	async.throwException = function (exception) {
		async.nextTick(function () {
			throw exception;
		});
	};

	async.run = function (callback, opt_context) {
		if (!async.run.workQueueScheduled_) {
			async.nextTick(async.run.processWorkQueue);
			async.run.workQueueScheduled_ = true;
		}

		async.run.workQueue_.push(new async.run.WorkItem_(callback, opt_context));
	};

	async.run.workQueueScheduled_ = false;
	async.run.workQueue_ = [];

	async.run.processWorkQueue = function () {
		while (async.run.workQueue_.length) {
			var workItems = async.run.workQueue_;
			async.run.workQueue_ = [];

			for (var i = 0; i < workItems.length; i++) {
				var workItem = workItems[i];

				try {
					workItem.fn.call(workItem.scope);
				} catch (e) {
					async.throwException(e);
				}
			}
		}

		async.run.workQueueScheduled_ = false;
	};

	async.run.WorkItem_ = function (fn, scope) {
		this.fn = fn;
		this.scope = scope;
	};

	async.nextTick = function (callback, opt_context) {
		var cb = callback;

		if (opt_context) {
			cb = callback.bind(opt_context);
		}

		cb = async.nextTick.wrapCallback_(cb);

		if (typeof setImmediate === 'function') {
			setImmediate(cb);
			return;
		}

		if (!async.nextTick.setImmediate_) {
			async.nextTick.setImmediate_ = async.nextTick.getSetImmediateEmulator_();
		}

		async.nextTick.setImmediate_(cb);
	};

	async.nextTick.setImmediate_ = null;

	async.nextTick.getSetImmediateEmulator_ = function () {
		var Channel;

		if (typeof MessageChannel === 'function') {
			Channel = MessageChannel;
		}

		if (typeof Channel === 'undefined' && typeof window !== 'undefined' && window.postMessage && window.addEventListener) {
			Channel = function Channel() {
				var iframe = document.createElement('iframe');
				iframe.style.display = 'none';
				iframe.src = '';
				document.documentElement.appendChild(iframe);
				var win = iframe.contentWindow;
				var doc = win.document;
				doc.open();
				doc.write('');
				doc.close();
				var message = 'callImmediate' + Math.random();
				var origin = win.location.protocol + '//' + win.location.host;

				var onmessage = function (e) {
					if (e.origin !== origin && e.data !== message) {
						return;
					}

					this.port1.onmessage();
				}.bind(this);

				win.addEventListener('message', onmessage, false);
				this.port1 = {};
				this.port2 = {
					postMessage: function postMessage() {
						win.postMessage(message, origin);
					}
				};
			};
		}

		if (typeof Channel !== 'undefined') {
			var channel = new Channel();
			var head = {};
			var tail = head;

			channel.port1.onmessage = function () {
				head = head.next;
				var cb = head.cb;
				head.cb = null;
				cb();
			};

			return function (cb) {
				tail.next = {
					cb: cb
				};
				tail = tail.next;
				channel.port2.postMessage(0);
			};
		}

		if (typeof document !== 'undefined' && 'onreadystatechange' in document.createElement('script')) {
			return function (cb) {
				var script = document.createElement('script');

				script.onreadystatechange = function () {
					script.onreadystatechange = null;
					script.parentNode.removeChild(script);
					script = null;
					cb();
					cb = null;
				};

				document.documentElement.appendChild(script);
			};
		}

		return function (cb) {
			setTimeout(cb, 0);
		};
	};

	async.nextTick.wrapCallback_ = function (opt_returnValue) {
		return opt_returnValue;
	};

	exports.default = async;
});
//# sourceMappingURL=async.js.map