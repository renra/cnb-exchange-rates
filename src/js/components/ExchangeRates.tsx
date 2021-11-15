import React from 'react';
import * as ExchangeRatesResponse from '../requests/ExchangeRates';
import { useExchangeRatesContext } from '../contexts/ExchangeRatesContext';

const ExchangeRates = (): JSX.Element => {
  const [ state, dispatch ] = useExchangeRatesContext();

  React.useEffect(() => {
    dispatch({
      type: 'EXCHANGE_RATES_LOADING_STARTED'
    });

    fetch('/kurzy')
      .then(response => {
        ExchangeRatesResponse.parseAndValidate(response)
          .then(exchangeRates => {
            dispatch({
              type: 'EXCHANGE_RATES_LOADING_SUCCEEDED',
              response: {
                exchangeRates: exchangeRates,
                valid_on: new Date()
              }
            });
          })
          .catch(_ => {
            dispatch({
              type: 'EXCHANGE_RATES_PARSING_FAILED',
            });
          })
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
      const response = state.exchangeRatesRequestState.response;

      return (
        <div>
          <h1>Data fetched</h1>

          {
            response.exchangeRates.map((exchangeRate, i) => {
              return(
                <div key={i}>
                  { exchangeRate.currencyCode } | { exchangeRate.country } | { exchangeRate.baseAmount } | { exchangeRate.rate }
                </div>
              );
            })
          }
        </div>
      );

    case 'failure':
      return (
        <h1>Failed to fetch data</h1>
      );
  }
}

export default ExchangeRates;
