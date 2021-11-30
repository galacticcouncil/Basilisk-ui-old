// TODO: revisit, this is very hacky, possibly a memory leak because the event handlers are not removed

import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TradeFormFields } from '../TradeForm';

/**
 * Trigger a state update each time the given input changes (via the `input` event)
 * @param form 
 * @param field 
 * @returns 
 */
 export const useListenForInput = (form: UseFormReturn<TradeFormFields>, field: string) => {
    const [state, setState] = useState<boolean>(false);
    
    const inputRef = (form.control._fields[field] as any)?._f?.ref;

    useEffect(() => {
        if (!inputRef) return;
        const listener = inputRef
            ?.addEventListener('input', () => setState(state => !state));
        
        return () => inputRef?.removeEventListener('input', listener);
    }, [inputRef])

    return state;
}