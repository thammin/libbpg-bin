'use strict';
const test = require('ava');
const path = require('path');
const tempy = require('tempy');
const isBpg = require('is-bpg');
const isPng = require('is-png');
const readChunk = require('read-chunk');
const { exec } = require('child_process');
const { bpgenc, bpgdec } = require('..');

test.cb('return path to binary and verify that `bpgenc` is working', t => {
  const temp = tempy.file({ extension: 'bpg' });

  exec(`${bpgenc} -o ${temp} ${path.resolve(__dirname, 'fixture.jpg')}`, (err, stdout) => {
    t.ifError(err);
    let buffer = readChunk.sync(temp, 0, 4);
    t.true(isBpg(buffer));
    t.end();
  });
});

test.cb('return path to binary and verify that `bpgdec` is working', t => {
  const temp = tempy.file({ extension: 'png' });

  exec(`${bpgdec} -o ${temp} ${path.resolve(__dirname, 'fixture.bpg')}`, (err, stdout) => {
    t.ifError(err);
    let buffer = readChunk.sync(temp, 0, 8);
    t.true(isPng(buffer));
    t.end();
  });
});