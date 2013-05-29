/**
 * Copyright 2013 Google, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Stream source base type.
 *
 * @author benvanik@google.com (Ben Vanik)
 */

goog.provide('wtf.io.cff.StreamSource');

goog.require('goog.events');
goog.require('wtf.io.ReadTransportTarget');
goog.require('wtf.io.cff.StreamBase');



/**
 * Stream source abstract base type.
 * @param {!wtf.io.ReadTransport} transport Source read transport.
 * @constructor
 * @extends {wtf.io.cff.StreamBase}
 * @implements {wtf.io.ReadTransportTarget}
 */
wtf.io.cff.StreamSource = function(transport) {
  goog.base(this);

  /**
   * Read transport where data is sourced from.
   * @type {!wtf.io.ReadTransport}
   * @private
   */
  this.transport_ = transport;

  // Bind transport events.
  this.transport_.setEventTarget(this);
};
goog.inherits(wtf.io.cff.StreamSource, wtf.io.cff.StreamBase);


/**
 * @override
 */
wtf.io.cff.StreamSource.prototype.disposeInternal = function() {
  this.emitEvent(wtf.io.cff.StreamSource.EventType.END, this);
  goog.dispose(this.transport_);
  goog.base(this, 'disposeInternal');
};


/**
 * Gets the transport this stream is reading from.
 * @return {!wtf.io.ReadTransport} Transport.
 * @protected
 */
wtf.io.cff.StreamSource.prototype.getTransport = function() {
  return this.transport_;
};


/**
 * @override
 */
wtf.io.cff.StreamSource.prototype.dataReceived = goog.abstractMethod;


/**
 * Emits a chunk receive event.
 * @param {!wtf.io.cff.Chunk} chunk New chunk.
 * @protected
 */
wtf.io.cff.StreamSource.prototype.emitChunkReceived = function(chunk) {
  this.emitEvent(wtf.io.cff.StreamSource.EventType.CHUNK_RECEIVED, this, chunk);
};


/**
 * Event types for {@see wtf.io.cff.StreamSource}.
 * @enum {string}
 */
wtf.io.cff.StreamSource.EventType = {
  /**
   * A new chunk was received from the source.
   * Args: [this, wtf.io.cff.Chunk]
   */
  CHUNK_RECEIVED: goog.events.getUniqueId('chunk_received'),

  /**
   * Stream ended and no more chunks will be received.
   * Args: [this]
   */
  END: goog.events.getUniqueId('end')
};
