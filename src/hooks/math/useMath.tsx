import constate from 'constate';
import { useEffect, useState } from 'react'

// TODO: figure out how to extract types from the wasm type definitions
export interface HydraDxMath {
    get_spot_price: (a: string, b: string, c: string) => string | undefined,
    calculate_in_given_out: (a: string, b: string, c: string) => string | undefined
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
                instance: await import('hydra-dx-wasm/build/xyk/bundler') as HydraDxMath,
                loading: false,
            });
        })();
    }, [setWasm])

    // TODO if we need additional math functions outside of wasm,
    // inject them here
    return { math: wasm?.instance, loading: wasm?.loading };
}

export const [MathProvider, useMathContext] = constate(useMath);