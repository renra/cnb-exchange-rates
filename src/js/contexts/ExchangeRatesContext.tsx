import React, { Dispatch, useReducer, createContext } from 'react';
import { RequestState } from '../utils/requestState';
import { ExchangeRatesResponse } from '../requests/ExchangeRates';
import { useSafeContext } from '../utils/SafeContext';

type State = {
  exchangeRatesRequestState: RequestState<ExchangeRatesResponse>,
};

const defaultState: State = {
  exchangeRatesRequestState: {
    state: 'not_asked'
  },
};

type Action =
  | {
      type: 'EXCHANGE_RATES_LOADING_STARTED'
    }
  | {
      type: 'EXCHANGE_RATES_LOADING_SUCCEEDED',
      response: ExchangeRatesResponse
    }
  | {
      type: 'EXCHANGE_RATES_LOADING_FAILED',
      error: string
    }
  | {
      type: 'EXCHANGE_RATES_PARSING_FAILED',
    }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'EXCHANGE_RATES_LOADING_STARTED': {
      return {
        ...state,
        exchangeRatesRequestState: {
          state: 'loading',
        }
      };
    }

    case 'EXCHANGE_RATES_LOADING_SUCCEEDED': {
      return {
        ...state,
        exchangeRatesRequestState: {
          state: 'success',
          response: action.response,
        },
      };
    }

    case 'EXCHANGE_RATES_LOADING_FAILED': {
      return {
        ...state,
        exchangeRatesRequestState: {
          state: 'failure',
          error: action.error
        }
      };
    }

    case 'EXCHANGE_RATES_PARSING_FAILED': {
      return {
        ...state,
        exchangeRatesRequestState: {
          state: 'failure',
          error: 'Exchange rates failed to parse'
        }
      };
    }
  }
}

type ContextValue = [State, Dispatch<Action>];
export const ExchangeRatesContext = createContext<ContextValue | undefined>(undefined);
export const useExchangeRatesContext = useSafeContext<ContextValue>(ExchangeRatesContext);

type ProviderProps = { children: React.ReactNode };
export const ExchangeRatesProvider = (props: ProviderProps) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <ExchangeRatesContext.Provider value={[state, dispatch]}>
      {props.children}
    </ExchangeRatesContext.Provider>
  );
};
