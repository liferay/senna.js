/*!
 * Promises polyfill based on Google's Closure Library promises.
 *
 *      Copyright 2013 The Closure Library Authors. All Rights Reserved.
 *
 * NOTE(eduardo): Promise support is not ready on all supported browsers,
 * therefore senna.js is temporarily using Google's promises as polyfill. It
 * supports cancellable promises and has clean and fast implementation.
 */
'use strict';

(function(window) {
  var goog = {};

  goog.inherits = senna.inherits;
  goog.isDef = senna.isDef;
  goog.isFunction = senna.isFunction;
  goog.isObject = senna.isObject;

  /**
   * Provides a more strict interface for Thenables in terms of
   * http://promisesaplus.com for interop with {@see goog.Promise}.
   *
   * @interface
   * @extends {IThenable.<TYPE>}
   * @template TYPE
   */
  goog.Thenable = function() {};


  /**
   * Adds callbacks that will operate on the result of the Thenable, returning a
   * new child Promise.
   *
   * If the Thenable is fulfilled, the {@code onFulfilled} callback will be
   * invoked with the fulfillment value as argument, and the child Promise will
   * be fulfilled with the return value of the callback. If the callback throws
   * an exception, the child Promise will be rejected with the thrown value
   * instead.
   *
   * If the Thenable is rejected, the {@code onRejected} callback will be invoked
   * with the rejection reason as argument, and the child Promise will be rejected
   * with the return value of the callback or thrown value.
   *
   * @param {?(function(this:THIS, TYPE):
   *             (RESULT|IThenable.<RESULT>|Thenable))=} opt_onFulfilled A
   *     function that will be invoked with the fulfillment value if the Promise
   *     is fullfilled.
   * @param {?(function(*): *)=} opt_onRejected A function that will be invoked
   *     with the rejection reason if the Promise is rejected.
   * @param {THIS=} opt_context An optional context object that will be the
   *     execution context for the callbacks. By default, functions are executed
   *     with the default this.
   * @return {!goog.Promise.<RESULT>} A new Promise that will receive the result
   *     of the fulfillment or rejection callback.
   * @template RESULT,THIS
   */
  goog.Thenable.prototype.then = function() {};


  /**
   * An expando property to indicate that an object implements
   * {@code goog.Thenable}.
   *
   * {@see addImplementation}.
   *
   * @const
   */
  goog.Thenable.IMPLEMENTED_BY_PROP = '$goog_Thenable';


  /**
   * Marks a given class (constructor) as an implementation of Thenable, so
   * that we can query that fact at runtime. The class must have already
   * implemented the interface.
   * Exports a 'then' method on the constructor prototype, so that the objects
   * also implement the extern {@see goog.Thenable} interface for interop with
   * other Promise implementations.
   * @param {function(new:goog.Thenable,...[?])} ctor The class constructor. The
   *     corresponding class must have already implemented the interface.
   */
  goog.Thenable.addImplementation = function(ctor) {
    ctor.prototype.then = ctor.prototype.then;
    ctor.prototype.$goog_Thenable = true;
  };


  /**
   * @param {*} object
   * @return {boolean} Whether a given instance implements {@code goog.Thenable}.
   *     The class/superclass of the instance must call {@code addImplementation}.
   */
  goog.Thenable.isImplementedBy = function(object) {
    if (!object) {
      return false;
    }
    try {
      return !!object.$goog_Thenable;
    } catch (e) {
      // Property access seems to be forbidden.
      return false;
    }
  };


  /**
   * Like bind(), except that a 'this object' is not required. Useful when the
   * target function is already bound.
   *
   * Usage:
   * var g = partial(f, arg1, arg2);
   * g(arg3, arg4);
   *
   * @param {Function} fn A function to partially apply.
   * @param {...*} var_args Additional arguments that are partially applied to fn.
   * @return {!Function} A partially-applied form of the function bind() was
   *     invoked as a method of.
   */
  goog.partial = function(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
      // Clone the array (with slice()) and append additional arguments
      // to the existing arguments.
      var newArgs = args.slice();
      newArgs.push.apply(newArgs, arguments);
      return fn.apply(this, newArgs);
    };
  };


  goog.async = {};


  /**
   * Throw an item without interrupting the current execution context.  For
   * example, if processing a group of items in a loop, sometimes it is useful
   * to report an error while still allowing the rest of the batch to be
   * processed.
   * @param {*} exception
   */
  goog.async.throwException = function(exception) {
    // Each throw needs to be in its own context.
    goog.async.nextTick(function() {
      throw exception;
    });
  };


  /**
   * Fires the provided callback just before the current callstack unwinds, or as
   * soon as possible after the current JS execution context.
   * @param {function(this:THIS)} callback
   * @param {THIS=} opt_context Object to use as the "this value" when calling
   *     the provided function.
   * @template THIS
   */
  goog.async.run = function(callback, opt_context) {
    if (!goog.async.run.workQueueScheduled_) {
      // Nothing is currently scheduled, schedule it now.
      goog.async.nextTick(goog.async.run.processWorkQueue);
      goog.async.run.workQueueScheduled_ = true;
    }

    goog.async.run.workQueue_.push(
      new goog.async.run.WorkItem_(callback, opt_context));
  };


  /** @private {boolean} */
  goog.async.run.workQueueScheduled_ = false;


  /** @private {!Array.<!goog.async.run.WorkItem_>} */
  goog.async.run.workQueue_ = [];

  /**
   * Run any pending goog.async.run work items. This function is not intended
   * for general use, but for use by entry point handlers to run items ahead of
   * goog.async.nextTick.
   */
  goog.async.run.processWorkQueue = function() {
    // NOTE: additional work queue items may be pushed while processing.
    while (goog.async.run.workQueue_.length) {
      // Don't let the work queue grow indefinitely.
      var workItems = goog.async.run.workQueue_;
      goog.async.run.workQueue_ = [];
      for (var i = 0; i < workItems.length; i++) {
        var workItem = workItems[i];
        try {
          workItem.fn.call(workItem.scope);
        } catch (e) {
          goog.async.throwException(e);
        }
      }
    }

    // There are no more work items, reset the work queue.
    goog.async.run.workQueueScheduled_ = false;
  };


  /**
   * @constructor
   * @final
   * @struct
   * @private
   *
   * @param {function()} fn
   * @param {Object|null|undefined} scope
   */
  goog.async.run.WorkItem_ = function(fn, scope) {
    /** @const */
    this.fn = fn;
    /** @const */
    this.scope = scope;
  };


  /**
   * Fires the provided callbacks as soon as possible after the current JS
   * execution context. setTimeout(…, 0) always takes at least 5ms for legacy
   * reasons.
   * @param {function(this:SCOPE)} callback Callback function to fire as soon as
   *     possible.
   * @param {SCOPE=} opt_context Object in whose scope to call the listener.
   * @template SCOPE
   */
  goog.async.nextTick = function(callback, opt_context) {
    var cb = callback;
    if (opt_context) {
      cb = goog.bind(callback, opt_context);
    }
    cb = goog.async.nextTick.wrapCallback_(cb);
    // Introduced and currently only supported by IE10.
    if (goog.isFunction(window.setImmediate)) {
      window.setImmediate(cb);
      return;
    }
    // Look for and cache the custom fallback version of setImmediate.
    if (!goog.async.nextTick.setImmediate_) {
      goog.async.nextTick.setImmediate_ = goog.async.nextTick.getSetImmediateEmulator_();
    }
    goog.async.nextTick.setImmediate_(cb);
  };


  /**
   * Cache for the setImmediate implementation.
   * @type {function(function())}
   * @private
   */
  goog.async.nextTick.setImmediate_ = null;


  /**
   * Determines the best possible implementation to run a function as soon as
   * the JS event loop is idle.
   * @return {function(function())} The "setImmediate" implementation.
   * @private
   */
  goog.async.nextTick.getSetImmediateEmulator_ = function() {
    // Create a private message channel and use it to postMessage empty messages
    // to ourselves.
    var Channel = window.MessageChannel;
    // If MessageChannel is not available and we are in a browser, implement
    // an iframe based polyfill in browsers that have postMessage and
    // document.addEventListener. The latter excludes IE8 because it has a
    // synchronous postMessage implementation.
    if (typeof Channel === 'undefined' && typeof window !== 'undefined' &&
      window.postMessage && window.addEventListener) {
      /** @constructor */
      Channel = function() {
        // Make an empty, invisible iframe.
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
        var onmessage = goog.bind(function(e) {
          // Validate origin and message to make sure that this message was
          // intended for us.
          if (e.origin !== origin && e.data !== message) {
            return;
          }
          this.port1.onmessage();
        }, this);
        win.addEventListener('message', onmessage, false);
        this.port1 = {};
        this.port2 = {
          postMessage: function() {
            win.postMessage(message, origin);
          }
        };
      };
    }
    if (typeof Channel !== 'undefined') {
      var channel = new Channel();
      // Use a fifo linked list to call callbacks in the right order.
      var head = {};
      var tail = head;
      channel.port1.onmessage = function() {
        head = head.next;
        var cb = head.cb;
        head.cb = null;
        cb();
      };
      return function(cb) {
        tail.next = {
          cb: cb
        };
        tail = tail.next;
        channel.port2.postMessage(0);
      };
    }
    // Implementation for IE6-8: Script elements fire an asynchronous
    // onreadystatechange event when inserted into the DOM.
    if (typeof document !== 'undefined' && 'onreadystatechange' in
        document.createElement('script')) {
      return function(cb) {
        var script = document.createElement('script');
        script.onreadystatechange = function() {
          // Clean up and call the callback.
          script.onreadystatechange = null;
          script.parentNode.removeChild(script);
          script = null;
          cb();
          cb = null;
        };
        document.documentElement.appendChild(script);
      };
    }
    // Fall back to setTimeout with 0. In browsers this creates a delay of 5ms
    // or more.
    return function(cb) {
      setTimeout(cb, 0);
    };
  };


  /**
   * Helper function that is overrided to protect callbacks with entry point
   * monitor if the application monitors entry points.
   * @param {function()} callback Callback function to fire as soon as possible.
   * @return {function()} The wrapped callback.
   * @private
   */
  goog.async.nextTick.wrapCallback_ = function(opt_returnValue) {
    return opt_returnValue;
  };


  /**
   * Promises provide a result that may be resolved asynchronously. A Promise may
   * be resolved by being fulfilled or rejected with a value, which will be known
   * as the fulfillment value or the rejection reason. Whether fulfilled or
   * rejected, the Promise result is immutable once it is set.
   *
   * Promises may represent results of any type, including undefined. Rejection
   * reasons are typically Errors, but may also be of any type. Closure Promises
   * allow for optional type annotations that enforce that fulfillment values are
   * of the appropriate types at compile time.
   *
   * The result of a Promise is accessible by calling {@code then} and registering
   * {@code onFulfilled} and {@code onRejected} callbacks. Once the Promise
   * resolves, the relevant callbacks are invoked with the fulfillment value or
   * rejection reason as argument. Callbacks are always invoked in the order they
   * were registered, even when additional {@code then} calls are made from inside
   * another callback. A callback is always run asynchronously sometime after the
   * scope containing the registering {@code then} invocation has returned.
   *
   * If a Promise is resolved with another Promise, the first Promise will block
   * until the second is resolved, and then assumes the same result as the second
   * Promise. This allows Promises to depend on the results of other Promises,
   * linking together multiple asynchronous operations.
   *
   * This implementation is compatible with the Promises/A+ specification and
   * passes that specification's conformance test suite. A Closure Promise may be
   * resolved with a Promise instance (or sufficiently compatible Promise-like
   * object) created by other Promise implementations. From the specification,
   * Promise-like objects are known as "Thenables".
   *
   * @see http://promisesaplus.com/
   *
   * @param {function(
   *             this:RESOLVER_CONTEXT,
   *             function((TYPE|IThenable.<TYPE>|Thenable)),
   *             function(*)): void} resolver
   *     Initialization function that is invoked immediately with {@code resolve}
   *     and {@code reject} functions as arguments. The Promise is resolved or
   *     rejected with the first argument passed to either function.
   * @param {RESOLVER_CONTEXT=} opt_context An optional context for executing the
   *     resolver function. If unspecified, the resolver function will be executed
   *     in the default scope.
   * @constructor
   * @struct
   * @final
   * @implements {goog.Thenable.<TYPE>}
   * @template TYPE,RESOLVER_CONTEXT
   */
  goog.Promise = function(resolver, opt_context) {
    /**
     * The internal state of this Promise. Either PENDING, FULFILLED, REJECTED, or
     * BLOCKED.
     * @private {goog.Promise.State_}
     */
    this.state_ = goog.Promise.State_.PENDING;

    /**
     * The resolved result of the Promise. Immutable once set with either a
     * fulfillment value or rejection reason.
     * @private {*}
     */
    this.result_ = undefined;

    /**
     * For Promises created by calling {@code then()}, the originating parent.
     * @private {goog.Promise}
     */
    this.parent_ = null;

    /**
     * The list of {@code onFulfilled} and {@code onRejected} callbacks added to
     * this Promise by calls to {@code then()}.
     * @private {Array.<goog.Promise.CallbackEntry_>}
     */
    this.callbackEntries_ = null;

    /**
     * Whether the Promise is in the queue of Promises to execute.
     * @private {boolean}
     */
    this.executing_ = false;

    if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
      /**
       * A timeout ID used when the {@code UNHANDLED_REJECTION_DELAY} is greater
       * than 0 milliseconds. The ID is set when the Promise is rejected, and
       * cleared only if an {@code onRejected} callback is invoked for the
       * Promise (or one of its descendants) before the delay is exceeded.
       *
       * If the rejection is not handled before the timeout completes, the
       * rejection reason is passed to the unhandled rejection handler.
       * @private {number}
       */
      this.unhandledRejectionId_ = 0;
    } else if (goog.Promise.UNHANDLED_REJECTION_DELAY === 0) {
      /**
       * When the {@code UNHANDLED_REJECTION_DELAY} is set to 0 milliseconds, a
       * boolean that is set if the Promise is rejected, and reset to false if an
       * {@code onRejected} callback is invoked for the Promise (or one of its
       * descendants). If the rejection is not handled before the next timestep,
       * the rejection reason is passed to the unhandled rejection handler.
       * @private {boolean}
       */
      this.hadUnhandledRejection_ = false;
    }

    try {
      var self = this;
      resolver.call(
        opt_context, function(value) {
          self.resolve_(goog.Promise.State_.FULFILLED, value);
        }, function(reason) {
          self.resolve_(goog.Promise.State_.REJECTED, reason);
        });
    } catch (e) {
      this.resolve_(goog.Promise.State_.REJECTED, e);
    }
  };

  /**
   * @define {number} The delay in milliseconds before a rejected Promise's reason
   * is passed to the rejection handler. By default, the rejection handler
   * rethrows the rejection reason so that it appears in the developer console or
   * {@code window.onerror} handler.
   *
   * Rejections are rethrown as quickly as possible by default. A negative value
   * disables rejection handling entirely.
   */
  goog.Promise.UNHANDLED_REJECTION_DELAY = 0;


  /**
   * The possible internal states for a Promise. These states are not directly
   * observable to external callers.
   * @enum {number}
   * @private
   */
  goog.Promise.State_ = {
    /** The Promise is waiting for resolution. */
    PENDING: 0,

    /** The Promise is blocked waiting for the result of another Thenable. */
    BLOCKED: 1,

    /** The Promise has been resolved with a fulfillment value. */
    FULFILLED: 2,

    /** The Promise has been resolved with a rejection reason. */
    REJECTED: 3
  };


  /**
   * Typedef for entries in the callback chain. Each call to {@code then},
   * {@code thenCatch}, or {@code thenAlways} creates an entry containing the
   * functions that may be invoked once the Promise is resolved.
   *
   * @typedef {{
   *   child: goog.Promise,
   *   onFulfilled: function(*),
   *   onRejected: function(*)
   * }}
   * @private
   */
  goog.Promise.CallbackEntry_ = null;


  /**
   * @param {(TYPE|goog.Thenable.<TYPE>|Thenable)=} opt_value
   * @return {!goog.Promise.<TYPE>} A new Promise that is immediately resolved
   *     with the given value.
   * @template TYPE
   */
  goog.Promise.resolve = function(opt_value) {
    return new goog.Promise(function(resolve) {
        resolve(opt_value);
      });
  };


  /**
   * @param {*=} opt_reason
   * @return {!goog.Promise} A new Promise that is immediately rejected with the
   *     given reason.
   */
  goog.Promise.reject = function(opt_reason) {
    return new goog.Promise(function(resolve, reject) {
        reject(opt_reason);
      });
  };


  /**
   * @param {!Array.<!(goog.Thenable.<TYPE>|Thenable)>} promises
   * @return {!goog.Promise.<TYPE>} A Promise that receives the result of the
   *     first Promise (or Promise-like) input to complete.
   * @template TYPE
   */
  goog.Promise.race = function(promises) {
    return new goog.Promise(function(resolve, reject) {
        if (!promises.length) {
          resolve(undefined);
        }
        for (var i = 0, promise; (promise = promises[i]); i++) {
          promise.then(resolve, reject);
        }
      });
  };


  /**
   * @param {!Array.<!(goog.Thenable.<TYPE>|Thenable)>} promises
   * @return {!goog.Promise.<!Array.<TYPE>>} A Promise that receives a list of
   *     every fulfilled value once every input Promise (or Promise-like) is
   *     successfully fulfilled, or is rejected by the first rejection result.
   * @template TYPE
   */
  goog.Promise.all = function(promises) {
    return new goog.Promise(function(resolve, reject) {
        var toFulfill = promises.length;
        var values = [];

        if (!toFulfill) {
          resolve(values);
          return;
        }

        var onFulfill = function(index, value) {
          toFulfill--;
          values[index] = value;
          if (toFulfill === 0) {
            resolve(values);
          }
        };

        var onReject = function(reason) {
          reject(reason);
        };

        for (var i = 0, promise; (promise = promises[i]); i++) {
          promise.then(goog.partial(onFulfill, i), onReject);
        }
      });
  };


  /**
   * @param {!Array.<!(goog.Thenable.<TYPE>|Thenable)>} promises
   * @return {!goog.Promise.<TYPE>} A Promise that receives the value of the first
   *     input to be fulfilled, or is rejected with a list of every rejection
   *     reason if all inputs are rejected.
   * @template TYPE
   */
  goog.Promise.firstFulfilled = function(promises) {
    return new goog.Promise(function(resolve, reject) {
        var toReject = promises.length;
        var reasons = [];

        if (!toReject) {
          resolve(undefined);
          return;
        }

        var onFulfill = function(value) {
          resolve(value);
        };

        var onReject = function(index, reason) {
          toReject--;
          reasons[index] = reason;
          if (toReject === 0) {
            reject(reasons);
          }
        };

        for (var i = 0, promise; (promise = promises[i]); i++) {
          promise.then(onFulfill, goog.partial(onReject, i));
        }
      });
  };


  /**
   * Adds callbacks that will operate on the result of the Promise, returning a
   * new child Promise.
   *
   * If the Promise is fulfilled, the {@code onFulfilled} callback will be invoked
   * with the fulfillment value as argument, and the child Promise will be
   * fulfilled with the return value of the callback. If the callback throws an
   * exception, the child Promise will be rejected with the thrown value instead.
   *
   * If the Promise is rejected, the {@code onRejected} callback will be invoked
   * with the rejection reason as argument, and the child Promise will be rejected
   * with the return value (or thrown value) of the callback.
   *
   * @override
   */
  goog.Promise.prototype.then = function(
  opt_onFulfilled, opt_onRejected, opt_context) {

    return this.addChildPromise_(
      goog.isFunction(opt_onFulfilled) ? opt_onFulfilled : null,
      goog.isFunction(opt_onRejected) ? opt_onRejected : null,
      opt_context);
  };
  goog.Thenable.addImplementation(goog.Promise);


  /**
   * Adds a callback that will be invoked whether the Promise is fulfilled or
   * rejected. The callback receives no argument, and no new child Promise is
   * created. This is useful for ensuring that cleanup takes place after certain
   * asynchronous operations. Callbacks added with {@code thenAlways} will be
   * executed in the same order with other calls to {@code then},
   * {@code thenAlways}, or {@code thenCatch}.
   *
   * Since it does not produce a new child Promise, cancellation propagation is
   * not prevented by adding callbacks with {@code thenAlways}. A Promise that has
   * a cleanup handler added with {@code thenAlways} will be canceled if all of
   * its children created by {@code then} (or {@code thenCatch}) are canceled.
   *
   * @param {function(this:THIS): void} onResolved A function that will be invoked
   *     when the Promise is resolved.
   * @param {THIS=} opt_context An optional context object that will be the
   *     execution context for the callbacks. By default, functions are executed
   *     in the global scope.
   * @return {!goog.Promise.<TYPE>} This Promise, for chaining additional calls.
   * @template THIS
   */
  goog.Promise.prototype.thenAlways = function(onResolved, opt_context) {
    var callback = function() {
      try {
        // Ensure that no arguments are passed to onResolved.
        onResolved.call(opt_context);
      } catch (err) {
        goog.Promise.handleRejection_.call(null, err);
      }
    };

    this.addCallbackEntry_({
      child: null,
      onRejected: callback,
      onFulfilled: callback
    });
    return this;
  };


  /**
   * Adds a callback that will be invoked only if the Promise is rejected. This
   * is equivalent to {@code then(null, onRejected)}.
   *
   * @param {!function(this:THIS, *): *} onRejected A function that will be
   *     invoked with the rejection reason if the Promise is rejected.
   * @param {THIS=} opt_context An optional context object that will be the
   *     execution context for the callbacks. By default, functions are executed
   *     in the global scope.
   * @return {!goog.Promise} A new Promise that will receive the result of the
   *     callback.
   * @template THIS
   */
  goog.Promise.prototype.thenCatch = function(onRejected, opt_context) {
    return this.addChildPromise_(null, onRejected, opt_context);
  };


  /**
   * Cancels the Promise if it is still pending by rejecting it with a cancel
   * Error. No action is performed if the Promise is already resolved.
   *
   * All child Promises of the canceled Promise will be rejected with the same
   * cancel error, as with normal Promise rejection. If the Promise to be canceled
   * is the only child of a pending Promise, the parent Promise will also be
   * canceled. Cancellation may propagate upward through multiple generations.
   *
   * @param {string=} opt_message An optional debugging message for describing the
   *     cancellation reason.
   */
  goog.Promise.prototype.cancel = function(opt_message) {
    if (this.state_ === goog.Promise.State_.PENDING) {
      goog.async.run(function() {
        var err = new goog.Promise.CancellationError(opt_message);
        this.cancelInternal_(err);
      }, this);
    }
  };


  /**
   * Cancels this Promise with the given error.
   *
   * @param {!Error} err The cancellation error.
   * @private
   */
  goog.Promise.prototype.cancelInternal_ = function(err) {
    if (this.state_ === goog.Promise.State_.PENDING) {
      if (this.parent_) {
        // Cancel the Promise and remove it from the parent's child list.
        this.parent_.cancelChild_(this, err);
      } else {
        this.resolve_(goog.Promise.State_.REJECTED, err);
      }
    }
  };


  /**
   * Cancels a child Promise from the list of callback entries. If the Promise has
   * not already been resolved, reject it with a cancel error. If there are no
   * other children in the list of callback entries, propagate the cancellation
   * by canceling this Promise as well.
   *
   * @param {!goog.Promise} childPromise The Promise to cancel.
   * @param {!Error} err The cancel error to use for rejecting the Promise.
   * @private
   */
  goog.Promise.prototype.cancelChild_ = function(childPromise, err) {
    if (!this.callbackEntries_) {
      return;
    }
    var childCount = 0;
    var childIndex = -1;

    // Find the callback entry for the childPromise, and count whether there are
    // additional child Promises.
    for (var i = 0, entry; (entry = this.callbackEntries_[i]); i++) {
      var child = entry.child;
      if (child) {
        childCount++;
        if (child === childPromise) {
          childIndex = i;
        }
        if (childIndex >= 0 && childCount > 1) {
          break;
        }
      }
    }

    // If the child Promise was the only child, cancel this Promise as well.
    // Otherwise, reject only the child Promise with the cancel error.
    if (childIndex >= 0) {
      if (this.state_ === goog.Promise.State_.PENDING && childCount === 1) {
        this.cancelInternal_(err);
      } else {
        var callbackEntry = this.callbackEntries_.splice(childIndex, 1)[0];
        this.executeCallback_(
          callbackEntry, goog.Promise.State_.REJECTED, err);
      }
    }
  };


  /**
   * Adds a callback entry to the current Promise, and schedules callback
   * execution if the Promise has already been resolved.
   *
   * @param {goog.Promise.CallbackEntry_} callbackEntry Record containing
   *     {@code onFulfilled} and {@code onRejected} callbacks to execute after
   *     the Promise is resolved.
   * @private
   */
  goog.Promise.prototype.addCallbackEntry_ = function(callbackEntry) {
    if ((!this.callbackEntries_ || !this.callbackEntries_.length) &&
      (this.state_ === goog.Promise.State_.FULFILLED ||
      this.state_ === goog.Promise.State_.REJECTED)) {
      this.scheduleCallbacks_();
    }
    if (!this.callbackEntries_) {
      this.callbackEntries_ = [];
    }
    this.callbackEntries_.push(callbackEntry);
  };


  /**
   * Creates a child Promise and adds it to the callback entry list. The result of
   * the child Promise is determined by the state of the parent Promise and the
   * result of the {@code onFulfilled} or {@code onRejected} callbacks as
   * specified in the Promise resolution procedure.
   *
   * @see http://promisesaplus.com/#the__method
   *
   * @param {?function(this:THIS, TYPE):
   *          (RESULT|goog.Promise.<RESULT>|Thenable)} onFulfilled A callback that
   *     will be invoked if the Promise is fullfilled, or null.
   * @param {?function(this:THIS, *): *} onRejected A callback that will be
   *     invoked if the Promise is rejected, or null.
   * @param {THIS=} opt_context An optional execution context for the callbacks.
   *     in the default calling context.
   * @return {!goog.Promise} The child Promise.
   * @template RESULT,THIS
   * @private
   */
  goog.Promise.prototype.addChildPromise_ = function(
  onFulfilled, onRejected, opt_context) {

    var callbackEntry = {
      child: null,
      onFulfilled: null,
      onRejected: null
    };

    callbackEntry.child = new goog.Promise(function(resolve, reject) {
      // Invoke onFulfilled, or resolve with the parent's value if absent.
      callbackEntry.onFulfilled = onFulfilled ? function(value) {
        try {
          var result = onFulfilled.call(opt_context, value);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      } : resolve;

      // Invoke onRejected, or reject with the parent's reason if absent.
      callbackEntry.onRejected = onRejected ? function(reason) {
        try {
          var result = onRejected.call(opt_context, reason);
          if (!goog.isDef(result) &&
            reason instanceof goog.Promise.CancellationError) {
            // Propagate cancellation to children if no other result is returned.
            reject(reason);
          } else {
            resolve(result);
          }
        } catch (err) {
          reject(err);
        }
      } : reject;
    });

    callbackEntry.child.parent_ = this;
    this.addCallbackEntry_(
      /** @type {goog.Promise.CallbackEntry_} */ (callbackEntry));
    return callbackEntry.child;
  };


  /**
   * Unblocks the Promise and fulfills it with the given value.
   *
   * @param {TYPE} value
   * @private
   */
  goog.Promise.prototype.unblockAndFulfill_ = function(value) {
    if (this.state_ !== goog.Promise.State_.BLOCKED) {
      throw new Error('Promise is not blocked.');
    }
    this.state_ = goog.Promise.State_.PENDING;
    this.resolve_(goog.Promise.State_.FULFILLED, value);
  };


  /**
   * Unblocks the Promise and rejects it with the given rejection reason.
   *
   * @param {*} reason
   * @private
   */
  goog.Promise.prototype.unblockAndReject_ = function(reason) {
    if (this.state_ !== goog.Promise.State_.BLOCKED) {
      throw new Error('Promise is not blocked.');
    }
    this.state_ = goog.Promise.State_.PENDING;
    this.resolve_(goog.Promise.State_.REJECTED, reason);
  };


  /**
   * Attempts to resolve a Promise with a given resolution state and value. This
   * is a no-op if the given Promise has already been resolved.
   *
   * If the given result is a Thenable (such as another Promise), the Promise will
   * be resolved with the same state and result as the Thenable once it is itself
   * resolved.
   *
   * If the given result is not a Thenable, the Promise will be fulfilled or
   * rejected with that result based on the given state.
   *
   * @see http://promisesaplus.com/#the_promise_resolution_procedure
   *
   * @param {goog.Promise.State_} state
   * @param {*} x The result to apply to the Promise.
   * @private
   */
  goog.Promise.prototype.resolve_ = function(state, x) {
    if (this.state_ !== goog.Promise.State_.PENDING) {
      return;
    }

    if (this === x) {
      state = goog.Promise.State_.REJECTED;
      x = new TypeError('Promise cannot resolve to itself');

    } else if (goog.Thenable.isImplementedBy(x)) {
      x = /** @type {!goog.Thenable} */ (x);
      this.state_ = goog.Promise.State_.BLOCKED;
      x.then(this.unblockAndFulfill_, this.unblockAndReject_, this);
      return;

    } else if (goog.isObject(x)) {
      try {
        var then = x.then;
        if (goog.isFunction(then)) {
          this.tryThen_(x, then);
          return;
        }
      } catch (e) {
        state = goog.Promise.State_.REJECTED;
        x = e;
      }
    }

    this.result_ = x;
    this.state_ = state;
    this.scheduleCallbacks_();

    if (state === goog.Promise.State_.REJECTED &&
      !(x instanceof goog.Promise.CancellationError)) {
      goog.Promise.addUnhandledRejection_(this, x);
    }
  };


  /**
   * Attempts to call the {@code then} method on an object in the hopes that it is
   * a Promise-compatible instance. This allows interoperation between different
   * Promise implementations, however a non-compliant object may cause a Promise
   * to hang indefinitely. If the {@code then} method throws an exception, the
   * dependent Promise will be rejected with the thrown value.
   *
   * @see http://promisesaplus.com/#point-70
   *
   * @param {Thenable} thenable An object with a {@code then} method that may be
   *     compatible with the Promise/A+ specification.
   * @param {!Function} then The {@code then} method of the Thenable object.
   * @private
   */
  goog.Promise.prototype.tryThen_ = function(thenable, then) {
    this.state_ = goog.Promise.State_.BLOCKED;
    var promise = this;
    var called = false;

    var resolve = function(value) {
      if (!called) {
        called = true;
        promise.unblockAndFulfill_(value);
      }
    };

    var reject = function(reason) {
      if (!called) {
        called = true;
        promise.unblockAndReject_(reason);
      }
    };

    try {
      then.call(thenable, resolve, reject);
    } catch (e) {
      reject(e);
    }
  };


  /**
   * Executes the pending callbacks of a resolved Promise after a timeout.
   *
   * Section 2.2.4 of the Promises/A+ specification requires that Promise
   * callbacks must only be invoked from a call stack that only contains Promise
   * implementation code, which we accomplish by invoking callback execution after
   * a timeout. If {@code startExecution_} is called multiple times for the same
   * Promise, the callback chain will be evaluated only once. Additional callbacks
   * may be added during the evaluation phase, and will be executed in the same
   * event loop.
   *
   * All Promises added to the waiting list during the same browser event loop
   * will be executed in one batch to avoid using a separate timeout per Promise.
   *
   * @private
   */
  goog.Promise.prototype.scheduleCallbacks_ = function() {
    if (!this.executing_) {
      this.executing_ = true;
      goog.async.run(this.executeCallbacks_, this);
    }
  };


  /**
   * Executes all pending callbacks for this Promise.
   *
   * @private
   */
  goog.Promise.prototype.executeCallbacks_ = function() {
    while (this.callbackEntries_ && this.callbackEntries_.length) {
      var entries = this.callbackEntries_;
      this.callbackEntries_ = [];

      for (var i = 0; i < entries.length; i++) {
        this.executeCallback_(entries[i], this.state_, this.result_);
      }
    }
    this.executing_ = false;
  };


  /**
   * Executes a pending callback for this Promise. Invokes an {@code onFulfilled}
   * or {@code onRejected} callback based on the resolved state of the Promise.
   *
   * @param {!goog.Promise.CallbackEntry_} callbackEntry An entry containing the
   *     onFulfilled and/or onRejected callbacks for this step.
   * @param {goog.Promise.State_} state The resolution status of the Promise,
   *     either FULFILLED or REJECTED.
   * @param {*} result The resolved result of the Promise.
   * @private
   */
  goog.Promise.prototype.executeCallback_ = function(
  callbackEntry, state, result) {
    if (state === goog.Promise.State_.FULFILLED) {
      callbackEntry.onFulfilled(result);
    } else {
      this.removeUnhandledRejection_();
      callbackEntry.onRejected(result);
    }
  };


  /**
   * Marks this rejected Promise as having being handled. Also marks any parent
   * Promises in the rejected state as handled. The rejection handler will no
   * longer be invoked for this Promise (if it has not been called already).
   *
   * @private
   */
  goog.Promise.prototype.removeUnhandledRejection_ = function() {
    var p;
    if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
      for (p = this; p && p.unhandledRejectionId_; p = p.parent_) {
        clearTimeout(p.unhandledRejectionId_);
        p.unhandledRejectionId_ = 0;
      }
    } else if (goog.Promise.UNHANDLED_REJECTION_DELAY === 0) {
      for (p = this; p && p.hadUnhandledRejection_; p = p.parent_) {
        p.hadUnhandledRejection_ = false;
      }
    }
  };


  /**
   * Marks this rejected Promise as unhandled. If no {@code onRejected} callback
   * is called for this Promise before the {@code UNHANDLED_REJECTION_DELAY}
   * expires, the reason will be passed to the unhandled rejection handler. The
   * handler typically rethrows the rejection reason so that it becomes visible in
   * the developer console.
   *
   * @param {!goog.Promise} promise The rejected Promise.
   * @param {*} reason The Promise rejection reason.
   * @private
   */
  goog.Promise.addUnhandledRejection_ = function(promise, reason) {
    if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
      promise.unhandledRejectionId_ = setTimeout(function() {
        goog.Promise.handleRejection_.call(null, reason);
      }, goog.Promise.UNHANDLED_REJECTION_DELAY);

    } else if (goog.Promise.UNHANDLED_REJECTION_DELAY === 0) {
      promise.hadUnhandledRejection_ = true;
      goog.async.run(function() {
        if (promise.hadUnhandledRejection_) {
          goog.Promise.handleRejection_.call(null, reason);
        }
      });
    }
  };


  /**
   * A method that is invoked with the rejection reasons for Promises that are
   * rejected but have no {@code onRejected} callbacks registered yet.
   * @type {function(*)}
   * @private
   */
  goog.Promise.handleRejection_ = goog.async.throwException;


  /**
   * Sets a handler that will be called with reasons from unhandled rejected
   * Promises. If the rejected Promise (or one of its descendants) has an
   * {@code onRejected} callback registered, the rejection will be considered
   * handled, and the rejection handler will not be called.
   *
   * By default, unhandled rejections are rethrown so that the error may be
   * captured by the developer console or a {@code window.onerror} handler.
   *
   * @param {function(*)} handler A function that will be called with reasons from
   *     rejected Promises. Defaults to {@code goog.async.throwException}.
   */
  goog.Promise.setUnhandledRejectionHandler = function(handler) {
    goog.Promise.handleRejection_ = handler;
  };



  /**
   * Error used as a rejection reason for canceled Promises.
   *
   * @param {string=} opt_message
   * @constructor
   * @extends {goog.debug.Error}
   * @final
   */
  goog.Promise.CancellationError = function(opt_message) {
    goog.Promise.CancellationError.base(this, 'constructor', opt_message);

    if (opt_message) {
      this.message = opt_message;
    }
  };
  goog.inherits(goog.Promise.CancellationError, Error);


  /** @override */
  goog.Promise.CancellationError.prototype.name = 'cancel';

  window.senna.Promise = goog.Promise;
}(window));
