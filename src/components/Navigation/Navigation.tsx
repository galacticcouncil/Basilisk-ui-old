import React, { useState } from 'react';
import { Account } from '../../generated/graphql';
import './Navigation.scss';

export const Modal = ({ children }: { children: React.ReactNode }) => {
    return <div>
        <h1>modal</h1>
        {children}
        <button>click me</button>
    </div>
}

export const ConfigModal = () => <h1>Config</h1>

export const useModal = (content: React.ReactNode) => {
    const [show, setShow] = useState<boolean>(false);

    return {
        modal: show ? (
            <Modal>
                {content}
            </Modal>
        ) : <></>,
        toggleModal: () => setShow(show => !show)
    }
}

export interface NavigationProps {
    extensionIsAvailable: boolean,
    activeAccount: any,
    onOpenConfig: () => void
}

export const Navigation = ({
    extensionIsAvailable,
    activeAccount,
    onOpenConfig
}: NavigationProps) => {
    // const { modal, toggleModal } = useModal(<ConfigModal/>);

    return extensionIsAvailable
        ? (
            <div>
                <h1>Available</h1>
                <button onClick={_ => onOpenConfig()}>config</button>
                {/* {modal} */}
            </div>
        )
        : <h1>Unavailable</h1>
}

export const NavigationContainer = () => {
    return <Navigation
        extensionIsAvailable={true}
        activeAccount={{}}
        onOpenConfig={() => console.log('opening config yaaay')}
    />
}