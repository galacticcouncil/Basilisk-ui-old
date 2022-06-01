import styled from '@emotion/styled/macro';
import { ReactNode } from 'react';
import Modal from 'react-modal';

export interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
}

const ModalContainer = styled.div`
  background: radial-gradient(
      70.22% 56.77% at 51.87% 101.05%,
      rgba(79, 255, 176, 0.24) 0%,
      rgba(79, 255, 176, 0) 100%
    ),
    rgba(7, 8, 14, 0.7);
`;

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
`;

Modal.setAppElement('#root');

export const ModalComponent = ({ children, isOpen }: ModalProps) => {
  return (
    <ModalContainer>
      <Modal
        isOpen={isOpen}
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(70.22% 56.77% at 51.87% 101.05%, rgba(79, 255, 176, 0.24) 0%, rgba(79, 255, 176, 0) 100%), rgba(7, 8, 14, 0.7)',
          },
          content: {
            width: '460px',
            maxHeight: '880px',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: '#211F24',
            boxShadow: '0px 38px 46px rgba(0, 0, 0, 0.03)',
            borderRadius: '16px',
            border: 'none',
            padding: '10px',
          },
        }}
        contentLabel="Example Modal"
      >
        <ModalWrapper>{children}</ModalWrapper>
      </Modal>
    </ModalContainer>
  );
};
