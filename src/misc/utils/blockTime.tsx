import BigNumber from 'bignumber.js'

export const blockTimeKusama = 6000 // 6s
export const blockTimeParachain = 12000 // 12s
export const genesisKusama = new Date('2019-11-28 17:27:48 UTC')

/**
 * Estimate the date at a given block height
 *
 * @param blockHeight
 */

export const blockToTime = (
  blockHeight: number,
  knownBlock?: { height: number; date: number },
  blockTime?: number
) => {
  if (knownBlock) {
    const milisecondsSinceKnownBlock = new BigNumber(
      Math.abs(blockHeight - knownBlock.height)
    )
      .multipliedBy(blockTime || blockTimeKusama)
      .toNumber()
    return new Date(
      blockHeight > knownBlock.height
        ? knownBlock.date + milisecondsSinceKnownBlock
        : knownBlock.date - milisecondsSinceKnownBlock
    ).getTime()
  } else {
    const milisecondsSinceGenesis = new BigNumber(blockHeight)
      .multipliedBy(blockTime || blockTimeKusama)
      .toNumber()
    return new Date(genesisKusama.getTime() + milisecondsSinceGenesis).getTime()
  }
}

export const timeToBlock = (
  time: number,
  knownBlock?: { height: number; date: number },
  blockTime?: number
) => {
  if (knownBlock) {
    const milisecondsSinceKnownBlock = Math.abs(time - knownBlock.date)
    return new BigNumber(milisecondsSinceKnownBlock)
      .dividedBy(blockTime || blockTimeKusama)
      .plus(knownBlock.height)
      .toNumber()
  } else {
    const milisecondsSinceGenesis = Math.abs(time - genesisKusama.getTime())
    return new BigNumber(milisecondsSinceGenesis)
      .dividedBy(blockTime || blockTimeKusama)
      .toNumber()
  }
}
