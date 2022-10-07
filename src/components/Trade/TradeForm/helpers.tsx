import BigNumber from 'bignumber.js'

export const getFeeAmount = (amount: string, tradeFee: string) => {
  console.log('TradeFee:', tradeFee)
  return new BigNumber(amount).multipliedBy(tradeFee).dividedBy(100)
}
