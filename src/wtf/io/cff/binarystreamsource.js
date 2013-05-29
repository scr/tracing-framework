/**
 * Copyright 2013 Google, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Binary stream source.
 *
 * @author benvanik@google.com (Ben Vanik)
 */

goog.provide('wtf.io.cff.BinaryStreamSource');

goog.require('wtf.io.cff.StreamSource');



/**
 * Binary stream source.
 * Reads chunks from a transport in the format that
 * {@see wtf.io.cff.BinaryStreamTarget} generates.
 *
 * @param {!wtf.io.ReadTransport} transport Read transport.
 * @constructor
 * @extends {wtf.io.cff.StreamSource}
 */
wtf.io.cff.BinaryStreamSource = function(transport) {
  goog.base(this, transport);
};
goog.inherits(wtf.io.cff.BinaryStreamSource, wtf.io.cff.StreamSource);
