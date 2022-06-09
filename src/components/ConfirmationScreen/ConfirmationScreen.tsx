import styled from '@emotion/styled/macro';
import { ReactNode } from 'react';
import { ModalComponent } from './ModalComponent/ModalComponent';
import { Stepper, StepperProps } from './Stepper/Stepper';

export interface ConfirmationScreenProps {
  isOpened?: boolean;
  steps?: StepperProps;
  children?: ReactNode;
  currentStep?: number;
}

const StepperSpacer = styled.div`
  height: 77px;
`;

const StepperContainer = styled.div`
  width: 460px;
  padding-bottom: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ConfirmationScreen = ({
  isOpened = true,
  steps,
  children,
  currentStep = 0,
}: ConfirmationScreenProps) => {
  return (
    <ModalComponent isOpen={isOpened}>
      {steps ? (
        <StepperContainer>
          <Stepper {...steps} currentStep={currentStep} />
        </StepperContainer>
      ) : (
        <StepperSpacer />
      )}
      {children}
    </ModalComponent>
  );
};
