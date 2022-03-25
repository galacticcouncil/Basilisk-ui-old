import { MutableRefObject, ReactNode, ReactPortal, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from 'use-hooks';
import { v4 as uuidv4 } from 'uuid';
export interface ModalPortalElementFactoryArgs {
    openModal: () => void,
    closeModal: () => void,
    toggleModal: () => void,
    resolve: (value?: any) => void,
    reject: (value?: any) => void,
    cancel: (value?: any) => void,
    elementRef: MutableRefObject<HTMLDivElement | null>,
    isModalOpen: boolean,
}

export type ModalPortalElementFactory = (args: ModalPortalElementFactoryArgs) => ReactNode;

export const useModalPortal = (
    elementFactory: ModalPortalElementFactory,
    container: MutableRefObject<HTMLDivElement | null>,
    closeOnClickOutside: boolean = true,
) => {
    const [modalPortal, setModalPortal] = useState<ReactPortal | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [status, setStatus] = useState<'pending' | 'success' | 'failure' | 'cancelled'>('pending');
    const resolve = useCallback(() => {
        setStatus('success');
        setIsModalOpen(false);
    }, []);
    const reject = useCallback(() => {
        setStatus('failure');
        setIsModalOpen(false);
    }, []);
    const cancel = useCallback(() => {
        setStatus('cancelled');
        setIsModalOpen(false);
    }, []);

    // old components might still use toggle/open/close API
    const toggleModal = useCallback(() => setIsModalOpen(isModalOpen => !isModalOpen), [setIsModalOpen]);
    const openModal = useCallback(() => {
        setIsModalOpen(true);
        setStatus('pending');
    }, []);
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setStatus('cancelled');
    }, []);

    const elementRef = useRef<HTMLDivElement | null>(null);

    const toggleId = useMemo(() => uuidv4(), []);

    const element = useMemo(() => {
        return elementFactory({ 
            toggleModal, 
            openModal, 
            closeModal, 
            elementRef, 
            isModalOpen,
            resolve,
            reject,
            cancel
        })
    }, [elementFactory, toggleModal, openModal, closeModal, isModalOpen, elementRef, resolve, reject, cancel]);

    useEffect(() => {
        if (!container.current || !element) return;
        setModalPortal(
            createPortal(element, container.current)
        );
    }, [container.current, element]);
    
    useOnClickOutside(elementRef as MutableRefObject<Node>, (event) => {
        const didClickOutsideToggle = !(event.target as HTMLElement).closest(`[data-modal-portal-toggle="${toggleId}"]`);
        closeOnClickOutside && didClickOutsideToggle && closeModal()
    });

    return { 
        toggleModal,
        openModal,
        closeModal,
        isModalOpen,
        toggleId,
        status,
        modalPortal: modalPortal
    };
}