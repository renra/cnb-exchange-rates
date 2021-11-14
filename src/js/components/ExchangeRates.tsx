import React from 'react';
import { useExchangeRatesContext } from '../contexts/ExchangeRatesContext';

const ExchangeRates = (): JSX.Element => {
  const [ state, dispatch ] = useExchangeRatesContext();

  React.useEffect(() => {
    dispatch({
      type: 'EXCHANGE_RATES_LOADING_STARTED'
    });

    //fetch('http://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.txt')
    fetch('/kurzy')
      .then(_ => {
        dispatch({
          type: 'EXCHANGE_RATES_LOADING_SUCCEEDED',
          response: {
            rates: [], //TODO
            valid_on: new Date()
          }
        });
      })
      .catch(err => {
        dispatch({
          type: 'EXCHANGE_RATES_LOADING_FAILED',
          error: err
        });
      })
  }, []);

  // Hmm, TypeScript is not checking the exhaustiveness of this. Gasp.
  switch(state.exchangeRatesRequestState.state) {
    case 'not_asked':
      return (
        <h1>Waiting for request to start</h1>
      );

    case 'loading':
      return (
        <h1>Waiting for data</h1>
      );

    case 'success':
      return (
        <h1>Data fetched</h1>
      );

    case 'failure':
      return (
        <h1>Failed to fetch data</h1>
      );
  }

  return (
    <h1>Hello World from a component!</h1>
  );
}

export default ExchangeRates;
