import { MutableRefObject, ReactNode, ReactPortal, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from 'use-hooks';
export interface ModalPortalElementFactoryArgs {
    openModal: () => void,
    closeModal: () => void,
    toggleModal: () => void,
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
    
    const toggleModal = useCallback(() => setIsModalOpen(isModalOpen => !isModalOpen), [setIsModalOpen]);
    const openModal = useCallback(() => setIsModalOpen(true), [setIsModalOpen]);
    const closeModal = useCallback(() => setIsModalOpen(false), [setIsModalOpen]);

    const elementRef = useRef<HTMLDivElement | null>(null);

    // TODO: use uuid to generate the toggleId
    const toggleId = useMemo(() => Math.random() * 10000, []);

    const element = useMemo(() => {
        return elementFactory({ toggleModal, openModal, closeModal, elementRef, isModalOpen })
    }, [elementFactory, toggleModal, openModal, closeModal, isModalOpen, elementRef]);

    useEffect(() => {
        if (!container.current || !element) return;
        setModalPortal(
            createPortal(element, container.current)
        );
    }, [container.current, element]);
    
    useOnClickOutside(elementRef as MutableRefObject<Node>, (event) => {
        // TODO: this is not entirely reliable, since it works on any data-modal-portal-toggle, not only on the relevant ones
        const didClickOutsideToggle = !(event.target as HTMLElement).closest(`[data-modal-portal-toggle="${toggleId}"]`);
        console.log('didClickOutsideToggle', didClickOutsideToggle, `[data-modal-portal-toggle="${toggleId}"]`);
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