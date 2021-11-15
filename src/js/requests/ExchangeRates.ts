export interface ExchangeRate {
  country: string;
  currencyName: string;
  currencyCode: string;
  baseAmount: number;
  rate: number;
}

export interface ExchangeRatesResponse {
  exchangeRates: ExchangeRate[];
  valid_on: Date;
}

export const parse = (serializedRates : string) : [ ExchangeRate[], string[] ] => {
  const lines = serializedRates.split('\n');

  let rates: ExchangeRate[] = [];
  let droppedLines: string[] = [];

  lines.forEach(line => {
    const columns = line.split('|');
    if(columns.length === 5) {
      const baseAmount = parseInt(columns[2]),
        rate = parseFloat(columns[4].replace(',', '.'));

      if(isNaN(baseAmount) || isNaN(rate)) {
        droppedLines.push(line);
      } else {
        rates.push({
          country: columns[0],
          currencyName: columns[1],
          currencyCode: columns[3],
          baseAmount: baseAmount,
          rate: rate,
        })
      }
    } else {
      droppedLines.push(line);
    }
  });

  return [ rates, droppedLines ];
}

export const parseAndValidate = (response : Response) : Promise<ExchangeRate[]> => {
  return new Promise<ExchangeRate[]>((resolve, reject) => {
    response.text()
      .then(serializedRates => {
        const [ rates, droppedLines ] = parse(serializedRates);

        // One line for the date header, one for the column names and the last one for trailing newline
        // These are expected to be dropped but non other
        if(droppedLines.length > 3) {
          reject('Failed to parse body');
        } else {
          resolve(rates);
        }

      })
      .catch(_ => {
        reject('Failed to read body');
      })
  })
}
