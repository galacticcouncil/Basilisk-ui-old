import { ReactNode, useState } from 'react';

export const useTogglable = (element: ReactNode) => {
    const [show, setShow] = useState(false);

    return {
        togglable: show ? element : undefined,
        toggle: () => setShow(show => !show)
    }
}