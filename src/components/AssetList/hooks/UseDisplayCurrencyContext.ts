import { Currency } from '../FormattedDisplayBalance/FormattedDisplayBalance';

export const useDisplayCurrencyContext = (): Currency => {
  // TODO: Get from Graphql endpoint
  const currency: Currency = {
    prefix: '$',
  };

  return currency;
};
