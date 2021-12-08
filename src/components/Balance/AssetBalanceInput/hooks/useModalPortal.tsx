import { MutableRefObject, ReactNode, ReactPortal, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface ModalPortalElementFactoryArgs {
    openModal: () => void,
    closeModal: () => void,
    toggleModal: () => void,
}

export type ModalPortalElementFactory = (args: ModalPortalElementFactoryArgs) => ReactNode;

export const useModalPortal = (
    elementFactory: ModalPortalElementFactory,
    container: MutableRefObject<HTMLDivElement | null>
) => {
    const [modalPortal, setModalPortal] = useState<ReactPortal | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const toggleModal = useCallback(() => setIsModalOpen(isModalOpen => !isModalOpen), [setIsModalOpen]);
    const openModal = useCallback(() => setIsModalOpen(true), [setIsModalOpen]);
    const closeModal = useCallback(() => setIsModalOpen(false), [setIsModalOpen]);

    useEffect(() => {
        if (!container.current) return;
        setModalPortal(
            createPortal(
                elementFactory({ toggleModal, openModal, closeModal }), 
                container.current
            )
        );
    }, [container.current]);

    return { 
        toggleModal,
        openModal,
        closeModal,
        modalPortal: isModalOpen ? modalPortal : undefined
    };
}