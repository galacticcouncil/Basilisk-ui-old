import { MutableRefObject, ReactNode, ReactPortal, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from 'use-hooks';
export interface ModalPortalElementFactoryArgs {
    openModal: () => void,
    closeModal: () => void,
    toggleModal: () => void,
    elementRef: MutableRefObject<HTMLDivElement | null>
}

export type ModalPortalElementFactory = (args: ModalPortalElementFactoryArgs) => ReactNode;

export const useModalPortal = (
    elementFactory: ModalPortalElementFactory,
    container: MutableRefObject<HTMLDivElement | null>,
    closeOnClickOutside: boolean = true
) => {
    const [modalPortal, setModalPortal] = useState<ReactPortal | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const toggleModal = useCallback(() => setIsModalOpen(isModalOpen => !isModalOpen), [setIsModalOpen]);
    const openModal = useCallback(() => setIsModalOpen(true), [setIsModalOpen]);
    const closeModal = useCallback(() => setIsModalOpen(false), [setIsModalOpen]);

    const elementRef = useRef<HTMLDivElement | null>(null);

    const element = useMemo(() => (
        elementFactory({ toggleModal, openModal, closeModal, elementRef })
    ), [elementFactory, toggleModal, openModal, closeModal]);

    useEffect(() => {
        if (!container.current) return;
        setModalPortal(
            createPortal(
                element,
                container.current
            )
        );
    }, [container.current]);
    
    useOnClickOutside(elementRef as MutableRefObject<Node>, () => {
        closeOnClickOutside && closeModal()
    });

    return { 
        toggleModal,
        openModal,
        closeModal,
        modalPortal: isModalOpen ? modalPortal : undefined
    };
}