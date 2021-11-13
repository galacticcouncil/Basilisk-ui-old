export enum ChartGranularity {
    // ALL = 'ALL',
    D30 = 'D30',
    D7 = 'D7',
    H24 = 'H24',
    H1 = 'H1'
}

export enum ChartType {
    PRICE = 'PRICE',
    VOLUME = 'VOLUME',
    WEIGHTS = 'WEIGHTS'
}


export interface Asset {
    symbol: string | undefined,
    fullName: string | undefined
    icon?: string | undefined
}

export interface AssetPair {
    assetA: Asset,
    assetB: Asset | undefined
}

export enum PoolType {
    LBP = 'LBP',
    XYK = 'XYK'
}

// Display data is not in the {x,y} format, since it solely represents
// an amount in a given asset
export interface DisplayData {
    balance: string | undefined,
    usdBalance: string | undefined,
    asset: Asset
}