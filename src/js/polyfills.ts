window.global = window.globalThis;
window.process = {
  // @ts-ignore TS2353
  browser: true,
  version: "0",
  env: {}
};

import buffer from 'buffer'
// // @ts-ignore TS7016
// import cryptoBrowserify from 'crypto-browserify'

window.Buffer = buffer.Buffer
// crypto = cryptoBrowserify
