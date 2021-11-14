import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ExchangeRates from './components/ExchangeRates';
import { ExchangeRatesProvider } from './contexts/ExchangeRatesContext';

const init = (outletId : string) : void => {
  ReactDOM.render(
    <ExchangeRatesProvider>
      <ExchangeRates />
    </ExchangeRatesProvider>,
    document.getElementById(outletId)
  );
}

declare global {
    interface Window { CNBExchangeRates: (outletId: string) => void; }
}

window.CNBExchangeRates = init;
