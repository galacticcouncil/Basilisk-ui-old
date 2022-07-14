import constate from 'constate';
import { useEffect, useState } from 'react'

// TODO: figure out how to extract types from the wasm type definitions
export interface HydraDxMathXyk {
    get_spot_price: (a: string, b: string, c: string) => string | undefined,
    calculate_in_given_out: (a: string, b: string, c: string) => string | undefined,
    calculate_out_given_in: (a: string, b: string, c: string) => string | undefined
    calculate_liquidity_in: (a: string, b: string, c: string) => string | undefined,
    calculate_liquidity_out_asset_a: (a: string, b: string, c: string, d: string) => string | undefined,
    calculate_liquidity_out_asset_b: (a: string, b: string, c: string, d: string) => string | undefined
}

export interface HydraDxMathLbp {
    calculate_linear_weights: (start_x: string, end_x: string, start_y: string, end_y: string, at: string) => string,
    calculate_in_given_out: (s: string, b: string, s_w: string, b_w: string, a: string) => string,
    calculate_out_given_in: (s: string, b: string, s_w: string, b_w: string, a: string) => string,
    get_spot_price: (s: string, b: string, s_w: string, b_w: string, a: string) => string,
}

export interface HydraDxMath {
    xyk: HydraDxMathXyk,
    lbp: HydraDxMathLbp
}

export const loadMath = async (): Promise<HydraDxMath> => {
    return {
        xyk: await import('hydra-dx-wasm/build/xyk/bundler'),
        lbp: await import('hydra-dx-wasm/build/lbp/bundler') as unknown as HydraDxMathLbp
    }
}

/**
 * Load the wasm math module
 * @returns 
 */
export const useMath = () => {
    const [wasm, setWasm] = useState<{
        instance: HydraDxMath | undefined,
        loading: boolean
    } | undefined>({
        instance: undefined,
        loading: true,
    });

    useEffect(() => {
        (async () => {
            setWasm({
                // TODO: if the module path is a variable, the module can't be found for some reason
                instance: await loadMath(),
                loading: false,
            });
        })();
    }, [setWasm])

    // TODO if we need additional math functions outside of wasm,
    // inject them here
    return { math: wasm?.instance, loading: wasm?.loading };
}

export const [MathProvider, useMathContext] = constate(useMath);