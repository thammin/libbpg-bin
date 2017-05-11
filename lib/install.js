'use strict';
const BinBuild = require('bin-build');
const log = require('logalot');
const { bpgenc } = require('.');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const got = require('got');
const pkg = require('../package.json');

const isVersionLike = input => /^(\.?\d+){1,3}$/.test(input);
const configure = {
  darwin: [
    'sed -i -e "s/#CONFIG_APPLE=y/CONFIG_APPLE=y/g" Makefile'
  ]
};

if (argv.compile) {
  compileFromSrc(bpgenc.dest());

} else {
  bpgenc.run(err => {
    if (err) {
      log.warn(err.message);
      log.warn('pre-build test failed');

      compileFromSrc(bpgenc.dest());
      return;
    }

    log.success('pre-build test passed successfully');
  });
}

function getVersionHash() {
  return got('https://api.github.com/repos/mirrorer/libbpg/commits', { json: true })
    .then(res => res.body
      .map(block => {
        return {
          sha: block.sha,
          version: block.commit.message
        };
      })
      .filter(block => isVersionLike(block.version))
    );
}

function compileFromSrc(dest) {
  log.info('compiling from source');

  getVersionHash()
    .then(versions => {
      const sha = versions.find(v => v.version === pkg.version).sha;
      log.info(`downloading source(${pkg.version}).`)
      
      const binBuild = new BinBuild();
      binBuild.src(`https://github.com/mirrorer/libbpg/archive/${sha}.zip`);

      (configure[process.platform] || []).forEach(cmd => binBuild.cmd(cmd));
      
      binBuild
        .cmd('make install')
        .cmd(`cp bpgenc bpgdec ${dest}`)
        .run(err => {
          if (err) {
            log.error(err.stack);
            return;
          }

          log.success('built successfully');
        });
    });
}
