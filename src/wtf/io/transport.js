/**
 * Copyright 2013 Google, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Transport abstract base types.
 *
 * @author benvanik@google.com (Ben Vanik)
 */

goog.provide('wtf.io.BlobData');
goog.provide('wtf.io.ReadTransport');
goog.provide('wtf.io.ReadTransportTarget');
goog.provide('wtf.io.WriteTransport');
goog.provide('wtf.io.WriteTransportTarget');

goog.require('goog.Disposable');
goog.require('goog.asserts');


/**
 * @typedef {Blob|ArrayBufferView|string}
 */
wtf.io.BlobData;



/**
 * Read-only transport base type.
 * A transport is the lowest-level primitive for IO. It provides a normalized
 * reading/writing API for a resource such as a URL endpoint or file.
 *
 * For performance reasons transports use a targetted event dispatch model.
 * Implement the {@see wtf.io.ReadTransportTarget} interface to handle incoming
 * events.
 *
 * @constructor
 * @extends {goog.Disposable}
 */
wtf.io.ReadTransport = function() {
  goog.base(this);

  /**
   * Event target instance.
   * Must be initialized by a call to {@see #setEventTarget}.
   * @type {wtf.io.ReadTransportTarget}
   * @protected
   */
  this.target = null;
};
goog.inherits(wtf.io.ReadTransport, goog.Disposable);


/**
 * Sets the event target instance.
 * This may only be called once.
 * @param {!wtf.io.ReadTransportTarget} target Event target.
 */
wtf.io.ReadTransport.prototype.setEventTarget = function(target) {
  goog.asserts.assert(!this.target);
  this.target = target;
};



/**
 * Event target interface for {@see wtf.io.ReadTransport}.
 * @interface
 */
wtf.io.ReadTransportTarget = function() {};


/**
 * Handles incoming data from the transport.
 * @param {!wtf.io.BlobData} data Incoming data.
 */
wtf.io.ReadTransportTarget.prototype.dataReceived = goog.nullFunction;



/**
 * Write-only transport base type.
 * A transport is the lowest-level primitive for IO. It provides a normalized
 * reading/writing API for a resource such as a URL endpoint or file.
 *
 * For performance reasons transports use a targetted event dispatch model.
 * Implement the {@see wtf.io.WriteTransportTarget} interface to handle incoming
 * events.
 *
 * @constructor
 * @extends {goog.Disposable}
 */
wtf.io.WriteTransport = function() {
  goog.base(this);

  /**
   * Event target instance.
   * Must be initialized by a call to {@see #setEventTarget}.
   * @type {wtf.io.WriteTransportTarget}
   * @protected
   */
  this.target = null;

  /**
   * Whether the transport was created by the library and should be disposed
   * when done with.
   * @type {boolean}
   */
  this.needsLibraryDispose = false;
};
goog.inherits(wtf.io.WriteTransport, goog.Disposable);


/**
 * Sets the event target instance.
 * This may only be called once.
 * @param {!wtf.io.WriteTransportTarget} target Event target.
 */
wtf.io.WriteTransport.prototype.setEventTarget = function(target) {
  goog.asserts.assert(!this.target);
  this.target = target;
};


/**
 * Writes data to the transport.
 * @param {!wtf.io.BlobData} data Data to write.
 */
wtf.io.WriteTransport.prototype.write = goog.abstractMethod;


/**
 * Flushes any pending buffers to the target.
 */
wtf.io.WriteTransport.prototype.flush = goog.abstractMethod;



/**
 * Event target interface for {@see wtf.io.WriteTransport}.
 * @interface
 */
wtf.io.WriteTransportTarget = function() {};
