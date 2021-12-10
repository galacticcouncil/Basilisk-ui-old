import { MutableRefObject, ReactNode, ReactPortal, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from 'use-hooks';
import { v4 as uuidv4 } from 'uuid';
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

    const toggleId = useMemo(() => uuidv4(), []);

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