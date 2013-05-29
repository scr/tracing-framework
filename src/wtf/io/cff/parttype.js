/**
 * Copyright 2013 Google, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Chunk part type IDs.
 *
 * @author benvanik@google.com (Ben Vanik)
 */

goog.provide('wtf.io.cff.PartType');

goog.require('goog.asserts');


/**
 * Chunk part type ID.
 * Must be kept in sync with {@see wtf.io.cff.IntegerPartType_}.
 * @enum {string}
 */
wtf.io.cff.PartType = {
  /** {@see wtf.io.cff.parts.FileHeaderPart} */
  FILE_HEADER: 'file_header',
  /** {@see wtf.io.cff.parts.EventBufferPart} */
  EVENT_BUFFER: 'event_buffer',
  /** {@see wtf.io.cff.parts.StringTablePart} */
  STRING_TABLE: 'string_table',
  /** {@see wtf.io.cff.parts.BinaryResourcePart} */
  BINARY_RESOURCE: 'binary_resource',
  /** {@see wtf.io.cff.parts.StringResourcePart} */
  STRING_RESOURCE: 'string_resource',

  UNKNOWN: 'unknown_type'
};


/**
 * Chunk part type ID values in numeric form.
 * Must be kept in sync with {@see wtf.io.cff.PartType}.
 * @enum {number}
 * @private
 */
wtf.io.cff.IntegerPartType_ = {
  FILE_HEADER: 0x10000,
  EVENT_BUFFER: 0x20000,
  STRING_TABLE: 0x30000,
  BINARY_RESOURCE: 0x40000,
  STRING_RESOURCE: 0x40001,

  UNKNOWN: -1
};


/**
 * Converts a chunk type enum value to an integer value.
 * @param {wtf.io.cff.PartType} value Part type enum value.
 * @return {number} Integer value.
 */
wtf.io.cff.PartType.toInteger = function(value) {
  switch (value) {
    case wtf.io.cff.PartType.FILE_HEADER:
      return wtf.io.cff.IntegerPartType_.FILE_HEADER;
    case wtf.io.cff.PartType.EVENT_BUFFER:
      return wtf.io.cff.IntegerPartType_.EVENT_BUFFER;
    case wtf.io.cff.PartType.STRING_TABLE:
      return wtf.io.cff.IntegerPartType_.STRING_TABLE;
    case wtf.io.cff.PartType.BINARY_RESOURCE:
      return wtf.io.cff.IntegerPartType_.BINARY_RESOURCE;
    case wtf.io.cff.PartType.STRING_RESOURCE:
      return wtf.io.cff.IntegerPartType_.STRING_RESOURCE;
    default:
      goog.asserts.fail('Unknown part type: ' + value);
      return wtf.io.cff.IntegerPartType_.UNKNOWN;
  }
};


/**
 * Converts a part type integer to an enum value.
 * @param {number} value Part type integer value.
 * @return {wtf.io.cff.PartType} Enum value.
 */
wtf.io.cff.PartType.fromInteger = function(value) {
  switch (value) {
    case wtf.io.cff.IntegerPartType_.FILE_HEADER:
      return wtf.io.cff.PartType.FILE_HEADER;
    case wtf.io.cff.IntegerPartType_.EVENT_BUFFER:
      return wtf.io.cff.PartType.EVENT_BUFFER;
    case wtf.io.cff.IntegerPartType_.STRING_TABLE:
      return wtf.io.cff.PartType.STRING_TABLE;
    case wtf.io.cff.IntegerPartType_.BINARY_RESOURCE:
      return wtf.io.cff.PartType.BINARY_RESOURCE;
    case wtf.io.cff.IntegerPartType_.STRING_RESOURCE:
      return wtf.io.cff.PartType.STRING_RESOURCE;
    default:
      goog.asserts.fail('Unknown part type: ' + value);
      return wtf.io.cff.PartType.UNKNOWN;
  }
};
