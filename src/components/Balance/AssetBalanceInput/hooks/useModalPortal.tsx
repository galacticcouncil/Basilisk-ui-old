import { MutableRefObject, ReactNode, ReactPortal, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from 'use-hooks';
import { v4 as uuidv4 } from 'uuid';
export interface ModalPortalElementFactoryArgs<T> {
    openModal: () => void,
    closeModal: () => void,
    toggleModal: () => void,
    elementRef: MutableRefObject<HTMLDivElement | null>,
    isModalOpen: boolean,
    state: T
}

export type ModalPortalElementFactory = <T>(args: ModalPortalElementFactoryArgs<T>) => ReactNode;

export const useModalPortal = (
    elementFactory: ModalPortalElementFactory,
    container: MutableRefObject<HTMLDivElement | null>,
    closeOnClickOutside: boolean = true,
) => {
    const [modalPortal, setModalPortal] = useState<ReactPortal | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [state, setState] = useState();

    const openModal = useCallback((state?: any) => {
        state && setState(state);
        setIsModalOpen(true)
    }, [setIsModalOpen, setState]);
    const closeModal = useCallback(() => setIsModalOpen(false), [setIsModalOpen]);
    const toggleModal = useCallback(() => isModalOpen ? closeModal() : openModal(), [isModalOpen, closeModal, openModal]);

    const elementRef = useRef<HTMLDivElement | null>(null);

    const toggleId = useMemo(() => uuidv4(), []);

    const element = useMemo(() => {
        return elementFactory({ toggleModal, openModal, closeModal, elementRef, isModalOpen, state })
    }, [elementFactory, toggleModal, openModal, closeModal, isModalOpen, elementRef, state]);

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
        modalPortal: modalPortal
    };
}