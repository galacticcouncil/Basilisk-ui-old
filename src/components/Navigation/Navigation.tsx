import React, { useState } from 'react';
import './Navigation.scss';
import { Link} from 'react-router-dom';

export const Modal = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <h1>modal</h1>
      {children}
      <button>click me</button>
    </div>
  );
};

export const ConfigModal = () => <h1>Config</h1>;

export const useModal = (content: React.ReactNode) => {
  const [show, setShow] = useState<boolean>(false);

  return {
    modal: show ? <Modal>{content}</Modal> : <></>,
    toggleModal: () => setShow((show) => !show),
  };
};

export const Navigation = () => (
  <div>
    <Link className= 'basilisk-logo' to="https://bsx.fi">()</Link>
    <Link to="/">Trade</Link>
    {' | '}
    <Link to="/wallet">Pools</Link>
    {' | '}
    <Link to="/config">Wallet</Link>
  </div>
);

export const NavigationContainer = () => {
  return <Navigation />;
};
