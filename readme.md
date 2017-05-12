# libbpg-bin

> binary wrapper for [libbpg](http://bellard.org/bpg/)

This wrapper gonna use prebuilt binary if possible and fallback to compile from latest source code from [here](https://github.com/mirrorer/libbpg).

## Install

```
$ npm install --save libbpg-bin
```


## Usage

```js
const { exec } = require('child_process');
const { bpgenc, bpgdec } = require('libbpg-bin');

exec(`${bpgenc} -o output.bpg input.png`, () => {
  // Yay! BIG input.png had been converted to SMALL output.bpg.
});

exec(`${bpgdec} -o input.png output.bpg`, () => {
  // Owh! BIG input.png come back again.
});
```

## Available prebuilt binary version

|OS|libbpg version|
|---|---|
|MacOS|0.94|
|Linux|need help|
|Windows|need help|

compile and PR is welcome!
```sh
# create binary for the latest version
$ npm run binary -- --compile 

# or create a specific version
$ npm run binary -- --compile="0.9.4"
```

## License

MIT