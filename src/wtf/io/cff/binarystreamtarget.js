/**
 * Copyright 2013 Google, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Binary stream target.
 *
 * @author benvanik@google.com (Ben Vanik)
 */

goog.provide('wtf.io.cff.BinaryStreamTarget');

goog.require('wtf.io.cff.StreamTarget');



/**
 * Binary stream target.
 * Writes chunks in an efficient binary format to the given write transport.
 *
 * @param {!wtf.io.WriteTransport} transport Write transport.
 * @constructor
 * @extends {wtf.io.cff.StreamTarget}
 */
wtf.io.cff.BinaryStreamTarget = function(transport) {
  goog.base(this, transport);
};
goog.inherits(wtf.io.cff.BinaryStreamTarget, wtf.io.cff.StreamTarget);


/**
 * @override
 */
wtf.io.cff.BinaryStreamTarget.prototype.writeChunk = function(chunk) {
  // TODO(benvanik): write.
};


/**
 * @override
 */
wtf.io.cff.BinaryStreamTarget.prototype.end = function() {
  // TODO(benvanik): end.
};
