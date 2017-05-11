'use strict';
const { bpgenc, bpgdec } = require('./lib');

module.exports = {
  bpgenc: bpgenc.path(),
  bpgdec: bpgdec.path()
};