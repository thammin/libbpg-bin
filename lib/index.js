'use strict';
const path = require('path');
const BinWrapper = require('bin-wrapper');
const pkg = require('../package.json');

const url = `https://github.com/thammin/libbpg-bin/raw/v${pkg.version}/vendor`;

function exportWrapper(binName) {
  // binary check is disable currently because binary return non-zero exit code when checking
  return new BinWrapper({ skipCheck: true })
    .src(`${url}/darwin/${binName}`, 'darwin')
    .dest(path.resolve(__dirname, '../vendor', process.platform))
    .use(binName);
}

module.exports = {
  bpgenc: exportWrapper('bpgenc'),
  bpgdec: exportWrapper('bpgdec')
};