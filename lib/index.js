'use strict';
const path = require('path');
const BinWrapper = require('bin-wrapper');
const pkg = require('../package.json');

const url = `https://github.com/thammin/libbpg-bin/raw/v${pkg.version}/vendor`;

function exportWrapper(binName) {
  return new BinWrapper()
    .src(`${url}/darwin/${binName}`, 'darwin')
    .dest(path.resolve(__dirname, '../vendor', process.platform))
    .use(binName);
}

module.exports = {
  bpgenc: exportWrapper('bpgenc'),
  bpgdec: exportWrapper('bpgdec')
};