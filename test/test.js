'use strict';
const test = require('ava');
const { exec } = require('child_process');
const { bpgenc, bpgdec } = require('..');

test.cb('return path to binary and verify that `bpgenc` is working', t => {
  exec(`${bpgenc} -h | head -1`, (err, stdout) => {
    t.ifError(err);
    t.true(/BPG Image Encoder/i.test(stdout));
    t.end();
  });
});

test.cb('return path to binary and verify that `bpgdec` is working', t => {
  exec(`${bpgdec} -h | head -1`, (err, stdout) => {
    t.ifError(err);
    t.true(/BPG Image Decoder/i.test(stdout));
    t.end();
  });
});