export interface ExchangeRate {
  country: string;
  currencyName: string;
  currencyCode: string;
  baseAmount: number;
  rate: number;
}

export interface ExchangeRatesResponse {
  rates: ExchangeRate[];
  valid_on: Date;
}
