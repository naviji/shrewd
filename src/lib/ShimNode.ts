// // 'use strict';

import FsDriverNode from './FsDriverNode'

const fs = require('fs-extra')
const shim = require('./shim').default

export function shimInit (electronBridge) {
  shim.electronBridge_ = electronBridge

  shim.fsDriver = () => {
    if (!shim.fsDriver_) shim.fsDriver_ = new FsDriverNode()
    return shim.fsDriver_
  }
}
module.exports = { shimInit }
