import * as React from 'react';
import * as ReactDOM from 'react-dom';

const init = (outletId : string) : void => {
  ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById(outletId)
  );
}

declare global {
    interface Window { CNBExchangeRates: (outletId: string) => void; }
}

window.CNBExchangeRates = init;
