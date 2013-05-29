/**
 * Copyright 2013 Google, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview String table storage type.
 *
 * @author benvanik@google.com (Ben Vanik)
 */

goog.provide('wtf.io.StringTable');

goog.require('goog.async.Deferred');



/**
 * Simple read-only or write-only string table.
 * Strings are stored by ordinal in the order they are added.
 * @constructor
 */
wtf.io.StringTable = function() {
  // TODO(benvanik): add de-duplication, if possible to do efficiently. Perhaps
  //     only for large strings where the cost is worth it?

  /**
   * All currently added string values.
   * If the table is in write mode this also contains null terminators.
   * @type {!Array.<string>}
   * @private
   */
  this.values_ = [];
};


/**
 * Resets all string table data.
 */
wtf.io.StringTable.prototype.reset = function() {
  if (this.values_.length) {
    this.values_ = [];
  }
};


/**
 * Clones the string table contents.
 * @return {!wtf.io.StringTable} New string table.
 */
wtf.io.StringTable.prototype.clone = function() {
  var other = new wtf.io.StringTable();
  other.values_ = this.values_.slice();
  return other;
};


/**
 * Adds a string to the table.
 * @param {string} value String value.
 * @return {number} Ordinal value.
 */
wtf.io.StringTable.prototype.addString = function(value) {
  var ordinal = this.values_.length / 2;
  this.values_.push(value);
  this.values_.push('\0');
  return ordinal;
};


/**
 * Gets a string from the table.
 * @param {number} ordinal Ordinal.
 * @return {string?} String value, if present.
 */
wtf.io.StringTable.prototype.getString = function(ordinal) {
  return this.values_[ordinal * 2] || null;
};


/**
 * Deserializes the string table from the given JSON object.
 * @param {!(Array|Object)} value JSON object.
 */
wtf.io.StringTable.prototype.initFromJsonObject = function(value) {
  // Need to expand from delimiterless version.
  this.values_ = new Array(value.length * 2);
  for (var n = 0; n < this.values_.length; n += 2) {
    this.values_[n] = value[n / 2];
    this.values_[n + 1] = '\0';
  }
};


/**
 * Serializes the string table to a JSON object.
 * @return {!(Array|Object)} String table object.
 */
wtf.io.StringTable.prototype.toJsonObject = function() {
  // Unfortuantely have to do this to add the \0 delimiters.
  // Since JSON isn't the optimized format, this is ok.
  var values = new Array(this.values_.length / 2);
  for (var n = 0; n < values.length; n++) {
    values[n] = this.values_[n * 2];
  }
  return values;
};


/**
 * Deserializes the string table from the given data blob.
 * The blob is espected to have the frame header omitted.
 * @param {!Blob} blob Blob, sliced to only be string data.
 * @return {!goog.async.Deferred} A deferred fulfilled when the table is
 *     deserialized.
 */
wtf.io.StringTable.prototype.deserialize = function(blob) {
  // NOTE: we avoid using goog.fs as it is very bad for performance.

  var deferred = new goog.async.Deferred();

  var self = this;
  var fileReader = new FileReader();
  fileReader.onload = function() {
    self.values_ = fileReader.result.split('\0');
    deferred.callback(this);
  };
  fileReader.readAsText(blob);

  return deferred;
};


/**
 * Serializes the string table to a blob.
 * The resulting blob does not have a frame header.
 * @return {!Blob} Blob containing the string data.
 */
wtf.io.StringTable.prototype.serialize = function() {
  var blob = new Blob(this.values_);
  return blob;
};
