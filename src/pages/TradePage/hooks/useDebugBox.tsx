import constate from "constate";
import log from "loglevel";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom"

export const useDebugBox = () => {
    const [searchParams] = useSearchParams();
    const debugBoxEnabled = !!searchParams.get('debug');
    const [debugData, setDebugData] = useState<any>({});

    const debugComponent = useCallback((component: string, data: any) => {
        // setTimeout(() => {})
        setDebugData((debugData: any) => ({
            ...debugData,
            [component]: data
        }))
        
    }, [setDebugData]);

    useEffect(() => {
        if (debugBoxEnabled) log.setLevel('info');
    }, [debugBoxEnabled])

    const DebugBox = useCallback(() => {
        if (!debugBoxEnabled) return <></>;
        return <div className='debug-box'>
            {JSON.stringify(debugData)}
        </div>;
    }, [debugData, debugBoxEnabled])

    return { debugComponent, DebugBox, debugBoxEnabled };
}

export const [DebugBoxProvider, useDebugBoxContext] = constate(useDebugBox);