/**
 * Copyright 2013 Google, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview File transport types.
 *
 * @author benvanik@google.com (Ben Vanik)
 */

goog.provide('wtf.io.transports.FileWriteTransport');

goog.require('wtf.io.WriteTransport');
goog.require('wtf.pal');



// /**
//  * Read-only file transport base type.
//  *
//  * @param {wtf.io.BlobData=} opt_data Initial data, if any.
//  * @constructor
//  * @extends {wtf.io.ReadTransport}
//  */
// wtf.io.transports.FileReadTransport = function(opt_data) {
//   goog.base(this);

//   /**
//    * Whether a dispatch is pending.
//    * Used to prevent duplicate timeouts.
//    * @type {boolean}
//    * @private
//    */
//   this.dispatchPending_ = false;

//   /**
//    * Data waiting to be dispatched.
//    * @type {!Array.<!wtf.io.BlobData>}
//    * @private
//    */
//   this.pendingData_ = [];

//   // Add any initial data.
//   if (opt_data) {
//     this.pendingData_.push(opt_data);
//   }

//   // Schedule a dispatch if needed.
//   if (this.pendingData_.length) {
//     this.scheduleDispatch_();
//   }
// };
// goog.inherits(wtf.io.transports.FileReadTransport, wtf.io.ReadTransport);


// /**
//  * @override
//  */
// wtf.io.transports.FileReadTransport.prototype.setEventTarget = function(
//     target) {
//   goog.base(this, 'setEventTarget', target);
//   this.scheduleDispatch_();
// };


// /**
//  * Adds more data to the transport.
//  * The event dispatch are scheduled asynchronously.
//  * @param {!wtf.io.BlobData} data Blob data.
//  */
// wtf.io.transports.FileReadTransport.prototype.addData = function(data) {
//   this.pendingData_.push(data);
//   this.scheduleDispatch_();
// };


// /**
//  * Schedules an async data dispatch.
//  * @private
//  */
// wtf.io.transports.FileReadTransport.prototype.scheduleDispatch_ = function() {
//   if (!this.target) {
//     return;
//   }
//   if (this.dispatchPending_) {
//     return;
//   }
//   this.dispatchPending_ = true;
//   wtf.timing.setImmediate(this.dispatch_, this);
// };


// /**
//  * Dispatches any pending data to the target.
//  * @private
//  */
// wtf.io.transports.FileReadTransport.prototype.dispatch_ = function() {
//   this.dispatchPending_ = false;
//   if (!this.target) {
//     return;
//   }

//   // If whoever is handling the data is also queuing up data, this will loop
//   // forever...
//   while (this.pendingData_.length) {
//     var data = this.pendingData_.pop();
//     this.target.dataReceived(data);
//   }
// };



/**
 * Write-only file transport base type.
 *
 * @param {string} filename Filename.
 * @constructor
 * @extends {wtf.io.WriteTransport}
 */
wtf.io.transports.FileWriteTransport = function(filename) {
  goog.base(this);

  /**
   * Filename used when saving.
   * @type {string}
   * @private
   */
  this.filename_ = filename;

  /**
   * Current blob containing all data that has been written.
   * @type {!Blob}
   * @private
   */
  this.blob_ = new Blob([]);
};
goog.inherits(wtf.io.transports.FileWriteTransport, wtf.io.WriteTransport);


/**
 * @override
 */
wtf.io.transports.FileWriteTransport.prototype.disposeInternal = function() {
  var platform = wtf.pal.getPlatform();
  platform.writeBinaryFile(this.filename_, this.blob_);

  // TODO(benvanik): find a way to close on all browsers?
  if (this.blob_['close']) {
    this.blob_['close']();
  }

  goog.base(this, 'disposeInternal');
};


/**
 * @override
 */
wtf.io.transports.FileWriteTransport.prototype.write = function(data) {
  var oldBlob = this.blob_;
  this.blob_ = new Blob([oldBlob, data]);

  // TODO(benvanik): find a way to close on all browsers?
  if (oldBlob['close']) {
    oldBlob['close']();
  }
};


/**
 * @override
 */
wtf.io.transports.FileWriteTransport.prototype.flush = function() {
  // No-op.
};


/**
 * Gets a blob containing all data that has been written to the transport.
 * @return {!Blob} Data blob.
 */
wtf.io.transports.FileWriteTransport.prototype.getBlob = function() {
  return this.blob_.slice();
};
