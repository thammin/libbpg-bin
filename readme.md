# libbpg-bin

> binary wrapper for [libbpg](http://bellard.org/bpg/)

This wrapper gonna use prebuilt binary if possible and fallback to compile from source.

## Install

```
$ npm install --save libbpg-bin
```


## Usage

```js
const { exec } = require('child_process');
const { bpgenc, bpgdec } = require('libbpg-bin');

exec(`${bpgenc} input.png -o output.bpg`, () => {
  // Yay! BIG input.png had been converted to SMALL output.bpg.
});

exec(`${bpgdec} output.bpg -o input.png`, () => {
  // Owh! BIG input.png come back again.
});
```

## License

MIT