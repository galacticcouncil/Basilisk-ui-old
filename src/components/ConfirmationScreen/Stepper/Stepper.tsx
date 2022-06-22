import styled from '@emotion/styled/macro';
import { Text, TextProps } from '../Text/Text';
import { TextKind } from '../Text/TextTheme';
import { Icon } from '../Icon/Icon';

export interface StepperProps {
  steps: TextProps[];
  currentStep?: number;
}

// TODO: Refactor to useRef or props
const stepperWidth = 460;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${stepperWidth}px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: ${stepperWidth}px;
`;

const TextWrapper = styled.div<{ parentWidth: number }>`
  width: ${(props) => props.parentWidth}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StepContainer = styled.div<{ margin: number }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin: 0px ${(props) => props.margin}px;
  width: ${stepperWidth}px;
`;

const WrapperContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Step = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CircleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
`;

const OuterCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  border-radius: 100%;
  box-shadow: 0 0 0 1px #787e82;

  &:hover {
    outline: 2px solid rgba(79, 255, 176, 0.6);
  }
`;

const Circle = styled.div<{ active: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 100%;

  background-color: ${(props) => (props.active ? '#49E49F' : 'transparent')};
`;

const Separator = styled.div<{ parentWidth: number }>`
  width: ${(props) => props.parentWidth}px;
  border-top: 1px solid #787e82;
  padding: 0px 2px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 100%;
  background: rgba(76, 243, 168, 0.12);
`;

const calculateSeparatorWidth = (stepsCount: number): number => {
  return (stepperWidth - stepsCount * 32) / stepsCount;
};

export const Stepper = ({ steps, currentStep = 0 }: StepperProps) => {
  return (
    <Container>
      <StepContainer margin={calculateSeparatorWidth(steps.length) / 2}>
        {steps.map((_, index) => {
          return (
            <WrapperContainer key={index}>
              <Step>
                <CircleContainer>
                  <OuterCircle>
                    <Circle active={index === currentStep}>
                      {index < currentStep && (
                        <IconContainer>
                          <Icon name={'StepperDone'} size={18} />
                        </IconContainer>
                      )}
                    </Circle>
                  </OuterCircle>
                </CircleContainer>
                {steps.length - 1 !== index && (
                  <Separator
                    parentWidth={calculateSeparatorWidth(steps.length)}
                  />
                )}
              </Step>
            </WrapperContainer>
          );
        })}
      </StepContainer>
      <TextContainer>
        {steps.map((step, index) => (
          <TextWrapper
            key={index}
            parentWidth={calculateSeparatorWidth(steps.length) + 32}
          >
            <Text
              {...step}
              kind={
                index === currentStep
                  ? TextKind.StepperCurrentText
                  : TextKind.StepperText
              }
            />
          </TextWrapper>
        ))}
      </TextContainer>
    </Container>
  );
};
