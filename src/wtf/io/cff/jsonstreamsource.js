/**
 * Copyright 2013 Google, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview JSON stream source.
 *
 * @author benvanik@google.com (Ben Vanik)
 */

goog.provide('wtf.io.cff.JsonStreamSource');

goog.require('wtf.io.cff.StreamSource');



/**
 * JSON stream source.
 * @param {!wtf.io.ReadTransport} transport Read transport.
 * @constructor
 * @extends {wtf.io.cff.StreamSource}
 */
wtf.io.cff.JsonStreamSource = function(transport) {
  goog.base(this, transport);
};
goog.inherits(wtf.io.cff.JsonStreamSource, wtf.io.cff.StreamSource);
