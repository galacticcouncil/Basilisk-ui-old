import blockHeightToDate, { blockTimeKusama } from './blockHeightToDate';
import {formatBalance} from './formatBalance';

describe('Balance Formatter', () => {
    describe('Precision 12', () => {

        it.each([
            [0, "0"],
            [1, "0.000000000001"],
            [10, "0.00000000001"],
            [100, "0.0000000001"],
            [1000, "0.000000001"],
            [15123000000123456789012, "15,12B"],
            [15123000000123456789012, "15,12B"],
            [340282366920938463463374607431768211450, "340282366920938T"],
            [50123456789012, "50"]
            ]
            )
        ("should convert balance to correct form", (value,expected) => {
            let precision = 12;
            let decimals = 2;
            expect(formatBalance(value, precision, decimals)).toBe(expected)
        });
    });
});

export {}
