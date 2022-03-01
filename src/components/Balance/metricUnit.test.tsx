import { formatToSIWithPrecision12, MetricUnit } from "./metricUnit"

describe('formatToSIWithPrecision12', () => {
    it.only('can format non-decimal value', () => {
        const formattedValue = formatToSIWithPrecision12('1000000000000', MetricUnit.NONE)
        expect(formattedValue).toBe('1.000000000000')
    })

    it.only('can format decimal value', () => {
        const formattedValue = formatToSIWithPrecision12('1100000000000', MetricUnit.NONE)
        expect(formattedValue).toBe('1.100000000000')
    })
})