/**
 * Copyright 2013 Google, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Memory transport types.
 *
 * @author benvanik@google.com (Ben Vanik)
 */

goog.provide('wtf.io.transports.MemoryReadTransport');
goog.provide('wtf.io.transports.MemoryWriteTransport');

goog.require('wtf.io.ReadTransport');
goog.require('wtf.io.WriteTransport');
goog.require('wtf.timing');



/**
 * Read-only memory transport base type.
 * Uses enforced waits on dispatch to mimic a real async transport.
 *
 * @param {wtf.io.BlobData=} opt_data Initial data, if any.
 * @constructor
 * @extends {wtf.io.ReadTransport}
 */
wtf.io.transports.MemoryReadTransport = function(opt_data) {
  goog.base(this);

  /**
   * Whether a dispatch is pending.
   * Used to prevent duplicate timeouts.
   * @type {boolean}
   * @private
   */
  this.dispatchPending_ = false;

  /**
   * Data waiting to be dispatched.
   * @type {!Array.<!wtf.io.BlobData>}
   * @private
   */
  this.pendingData_ = [];

  // Add any initial data.
  if (opt_data) {
    this.pendingData_.push(opt_data);
  }

  // Schedule a dispatch if needed.
  if (this.pendingData_.length) {
    this.scheduleDispatch_();
  }
};
goog.inherits(wtf.io.transports.MemoryReadTransport, wtf.io.ReadTransport);


/**
 * @override
 */
wtf.io.transports.MemoryReadTransport.prototype.setEventTarget = function(
    target) {
  goog.base(this, 'setEventTarget', target);
  this.scheduleDispatch_();
};


/**
 * Adds more data to the transport.
 * The event dispatch are scheduled asynchronously.
 * @param {!wtf.io.BlobData} data Blob data.
 */
wtf.io.transports.MemoryReadTransport.prototype.addData = function(data) {
  this.pendingData_.push(data);
  this.scheduleDispatch_();
};


/**
 * Schedules an async data dispatch.
 * @private
 */
wtf.io.transports.MemoryReadTransport.prototype.scheduleDispatch_ = function() {
  if (!this.target) {
    return;
  }
  if (this.dispatchPending_) {
    return;
  }
  this.dispatchPending_ = true;
  wtf.timing.setImmediate(this.dispatch_, this);
};


/**
 * Dispatches any pending data to the target.
 * @private
 */
wtf.io.transports.MemoryReadTransport.prototype.dispatch_ = function() {
  this.dispatchPending_ = false;
  if (!this.target) {
    return;
  }

  // If whoever is handling the data is also queuing up data, this will loop
  // forever...
  while (this.pendingData_.length) {
    var data = this.pendingData_.pop();
    this.target.dataReceived(data);
  }
};



/**
 * Write-only memory transport base type.
 *
 * @constructor
 * @extends {wtf.io.WriteTransport}
 */
wtf.io.transports.MemoryWriteTransport = function() {
  goog.base(this);

  // TODO(benvanik): use the Blob create/append loop to allow very large sizes?

  /**
   * All data elements that have been written.
   * This is used to create a single blob on demand.
   * @type {!Array.<!wtf.io.BlobData>}
   * @private
   */
  this.data_ = [];

  /**
   * If specified the given array will be populated with the result blob on
   * dispose.
   * @type {Array}
   * @private
   */
  this.targetArray_ = null;
};
goog.inherits(wtf.io.transports.MemoryWriteTransport, wtf.io.WriteTransport);


/**
 * @override
 */
wtf.io.transports.MemoryWriteTransport.prototype.disposeInternal = function() {
  if (this.targetArray_) {
    this.targetArray_.push(this.getBlob());
  }
  goog.base(this, 'disposeInternal');
};


/**
 * Sets an array target that will be automatically populated with the blob data
 * when the transport is disposed.
 * The blob will be pushed on.
 * @param {!Array} value Target array.
 */
wtf.io.transports.MemoryWriteTransport.prototype.setTargetArray =
    function(value) {
  this.targetArray_ = value;
};


/**
 * @override
 */
wtf.io.transports.MemoryWriteTransport.prototype.write = function(data) {
  this.data_.push(data);
};


/**
 * @override
 */
wtf.io.transports.MemoryWriteTransport.prototype.flush = function() {
  // No-op.
};


/**
 * Gets a blob containing all data that has been written to the transport.
 * @return {!Blob} Data blob.
 */
wtf.io.transports.MemoryWriteTransport.prototype.getBlob = function() {
  return new Blob(this.data_);
};
