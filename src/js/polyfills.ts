window.global = window.globalThis;
window.process = {
  browser: true,
  version: "0",
  env: {}
};

import buffer from 'buffer'
window.Buffer = buffer.Buffer
