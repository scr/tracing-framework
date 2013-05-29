/**
 * Copyright 2013 Google, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Event data buffer chunk part.
 *
 * @author benvanik@google.com (Ben Vanik)
 */

goog.provide('wtf.io.cff.parts.EventBufferPart');

goog.require('goog.asserts');
goog.require('wtf.io');
goog.require('wtf.io.Buffer');
goog.require('wtf.io.cff.Part');
goog.require('wtf.io.cff.PartType');



/**
 * A part containing event data.
 *
 * @param {wtf.io.Buffer=} opt_value Initial string table data.
 * @constructor
 * @extends {wtf.io.cff.Part}
 */
wtf.io.cff.parts.EventBufferPart = function(opt_value) {
  goog.base(this, wtf.io.cff.PartType.EVENT_BUFFER);

  /**
   * Event buffer.
   * @type {wtf.io.Buffer}
   * @private
   */
  this.value_ = opt_value || null;
};
goog.inherits(wtf.io.cff.parts.EventBufferPart, wtf.io.cff.Part);


/**
 * Gets the event buffer data.
 * @return {wtf.io.Buffer} Event buffer, if any.
 */
wtf.io.cff.parts.EventBufferPart.prototype.getValue = function() {
  return this.value_;
};


/**
 * Sets the event buffer data.
 * @param {wtf.io.Buffer} value Event buffer data.
 */
wtf.io.cff.parts.EventBufferPart.prototype.setValue = function(value) {
  this.value_ = value;
};


/**
 * Initializes the part from the given JSON object.
 * Throws errors on invalid JSON.
 * @param {!Object} value JSON value.
 */
wtf.io.cff.parts.EventBufferPart.prototype.initFromJsonObject = function(
    value) {
  switch (value['mode']) {
    case 'base64':
      var byteLength = value['byteLength'] || 0;
      var bytes = wtf.io.createByteArray(byteLength);
      wtf.io.stringToByteArray(value['value'], bytes);
      this.buffer_ = new wtf.io.Buffer(byteLength, undefined, bytes);
      break;
    default:
      throw 'JSON mode event data is not supported yet.';
  }
};


/**
 * @override
 */
wtf.io.cff.parts.EventBufferPart.prototype.toJsonObject = function() {
  goog.asserts.assert(this.value_);

  // Grab only the interesting region.
  // TODO(benvanik): subregion base64 encoding to prevent this.
  var bytes = wtf.io.sliceByteArray(this.value_.data, 0, this.value_.offset);

  // Base64 encode.
  var base64bytes = wtf.io.byteArrayToString(bytes);

  return {
    'type': this.getType(),
    'mode': 'base64',
    'byteLength': bytes.length,
    'value': base64bytes
  };
};
