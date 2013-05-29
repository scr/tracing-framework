/**
 * Copyright 2013 Google, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview File header data chunk part.
 *
 * @author benvanik@google.com (Ben Vanik)
 */

goog.provide('wtf.io.cff.parts.FileHeaderPart');

goog.require('goog.asserts');
goog.require('wtf');
goog.require('wtf.data.ContextInfo');
goog.require('wtf.data.formats.FileFlags');
goog.require('wtf.io.cff.Part');
goog.require('wtf.io.cff.PartType');



/**
 * A part containing a the file header.
 *
 * @param {wtf.data.ContextInfo=} opt_contextInfo Initial context info.
 * @param {Object=} opt_metadata Metadata.
 * @constructor
 * @extends {wtf.io.cff.Part}
 */
wtf.io.cff.parts.FileHeaderPart = function(opt_contextInfo, opt_metadata) {
  goog.base(this, wtf.io.cff.PartType.FILE_HEADER);

  /**
   * Context info.
   * @type {wtf.data.ContextInfo}
   * @private
   */
  this.contextInfo_ = opt_contextInfo || null;

  /**
   * User metadata.
   * @type {!Object}
   * @private
   */
  this.metadata_ = opt_metadata || {};
};
goog.inherits(wtf.io.cff.parts.FileHeaderPart, wtf.io.cff.Part);


/**
 * Gets the context info in the file header.
 * @return {!wtf.data.ContextInfo}
 */
wtf.io.cff.parts.FileHeaderPart.prototype.getContextInfo = function() {
  goog.asserts.assert(this.contextInfo_);
  return this.contextInfo_;
};


/**
 * Sets the context info value.
 * @param {!wtf.data.ContextInfo} value New context info value.
 */
wtf.io.cff.parts.FileHeaderPart.prototype.setContextInfo = function(value) {
  this.contextInfo_ = value;
};


/**
 * Gets the metadata object in the file header.
 * This is not a clone and should not be modified.
 * @return {!Object} Metadata object.
 */
wtf.io.cff.parts.FileHeaderPart.prototype.getMetadata = function() {
  return this.metadata_;
};


/**
 * Sets the metadata object in the file header.
 * This will not be cloned and should not be modified after set.
 * @param {Object} value Metadata object.
 */
wtf.io.cff.parts.FileHeaderPart.prototype.setMetadata = function(value) {
  this.metadata_ = value || {};
};


/**
 * Initializes the part from the given JSON object.
 * Throws errors on invalid JSON.
 * @param {!Object} value JSON value.
 */
wtf.io.cff.parts.FileHeaderPart.prototype.initFromJsonObject = function(
    value) {
  // TODO(benvanik): parsing.
};


/**
 * @override
 */
wtf.io.cff.parts.FileHeaderPart.prototype.toJsonObject = function() {
  // Write time information.
  var flags = 0;
  if (wtf.hasHighResolutionTimes) {
    flags |= wtf.data.formats.FileFlags.HAS_HIGH_RESOLUTION_TIMES;
  }

  // Fetch context info, if required.
  var contextInfo = this.contextInfo_;
  if (!contextInfo) {
    contextInfo = wtf.data.ContextInfo.detect();
  }

  // Metadata can be overridden by the user-supplied value.
  var metadata = {
    // Run the now() benchmark and stash that in metadata.
    // This isn't in the format as it's just informational.
    'nowTimeNs': wtf.computeNowOverhead()
  };
  for (var key in this.metadata_) {
    metadata[key] = this.metadata_[key];
  }

  return {
    'type': this.getType(),
    'flags': wtf.data.formats.FileFlags.toStrings(flags),
    'timebase': wtf.timebase(),
    'contextInfo': contextInfo.serialize(),
    'metadata': metadata
  };
};
