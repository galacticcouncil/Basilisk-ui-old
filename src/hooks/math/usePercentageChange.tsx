import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

export const percentageChange = (
  a?: string | BigNumber,
  b?: string | BigNumber
) => {
  if (!a || !b) return

  const aBN = new BigNumber(a)
  const bBN = new BigNumber(b)

  return bBN.minus(aBN).dividedBy(aBN)
}
export const usePercentageChange = (a?: string, b?: string) =>
  useMemo(() => percentageChange(a, b), [{ a, b }])
