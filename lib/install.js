'use strict';
const BinBuild = require('bin-build');
const log = require('logalot');
const { bpgenc, bpgdec } = require('.');
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
  compileFromSrc(bpgenc.dest(), argv.compile);

} else {
  checkPrebuilt()
    .then(() => log.success('pre-build test passed successfully'))
    .catch(err => {
      log.warn(err.message);
      log.warn('pre-build test failed');

      compileFromSrc(bpgenc.dest());
    });
}

function checkPrebuilt() {
  return Promise.all([bpgenc, bpgdec].map(bin => {
    return new Promise((resolve, reject) => {
      bin.run(err => err ? reject() : resolve());
    });
  }));
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

function compileFromSrc(dest, version) {
  log.info('compiling from source');

  getVersionHash()
    .then(versions => {
      let target;
      
      if (version) {
        target = versions.find(v => v.version === version);
      } else {
        target = versions.shift();
      }
      
      log.info(`downloading source(${target.version}).`)

      const binBuild = new BinBuild();
      binBuild.src(`https://github.com/mirrorer/libbpg/archive/${target.sha}.zip`);

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
