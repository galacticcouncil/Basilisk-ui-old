import styled from '@emotion/styled/macro';
import { useState } from 'react';
import { Button, ButtonKind } from '../Button/Button';
import { ModalComponent } from '../ModalComponent/ModalComponent';
import { Stepper, StepperProps } from '../Stepper/Stepper';
import { Text, TextKind } from '../Text/Text';
import { Input } from '../Input/Input';
import { Slippage, SlippageSlider } from '../SlippageSlider/SlippageSlider';
import { Toggle } from '../Toggle/Toggle';
import { Tooltip } from '../Tooltip/Tooltip';

export interface SettingsProps {
  onBack: () => void;
  onSave: () => void;
  slippage: 'autoSlippage' | Slippage;
  tipForAuthor?: number;
  nonce?: number;
  lifetime?: 'infinite' | number;
  steps?: StepperProps;
  error?: string;
  unit?: string;
}

const ModalContainer = styled.div<{ closeIn?: number }>`
  width: 460px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #211f24;
  box-shadow: 0px 38px 46px rgba(0, 0, 0, 0.03);
  border-radius: 16px;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-height: 600px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StepperContainer = styled.div`
  width: 460px;
  padding-bottom: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
`;

const ToggleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
`;

const SlippageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px 30px 10px 30px;
`;

const ToggleLabel = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const TextWrapper = styled.div`
  padding: 24px 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SubtitleWrapper = styled.div`
  padding: 9px 30px;
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background: rgba(0, 0, 0, 0.2);
`;

const Spacer = styled.div`
  height: 77px;
`;

const InputWrapper = styled.div`
  width: 100%;
  padding: 10px 30px;
`;

export const Settings = ({
  onBack,
  onSave,
  steps,
  slippage,
  tipForAuthor,
  nonce,
  lifetime,
  error,
  unit,
}: SettingsProps) => {
  const [showLifetime, setShowLifetime] = useState(lifetime !== 'infinite');
  const [showSlippage, setShowSlippage] = useState(slippage !== 'autoSlippage');

  return (
    <ModalComponent isOpen={true}>
      {steps ? (
        <StepperContainer>
          <Stepper {...steps} />
        </StepperContainer>
      ) : (
        <Spacer />
      )}
      <ModalContainer>
        <TextWrapper>
          <Text
            id={'settings'}
            defaultMessage={'Edit All Settings'}
            kind={TextKind.SettingsTitle}
          />
        </TextWrapper>
        <ContentContainer>
          <SubtitleWrapper>
            <Text
              id={'slippage'}
              defaultMessage={'Slippage'}
              kind={TextKind.SettingsSubtitle}
            />
          </SubtitleWrapper>
          <ToggleWrapper>
            <ToggleLabel>
              <Text
                id={'alllowAutoSlippage'}
                defaultMessage={'Alllow auto slippage'}
                kind={TextKind.ToggleLabel}
              />
            </ToggleLabel>
            <Toggle
              toggled={!showSlippage}
              onClick={() => setShowSlippage(!showSlippage)}
            />
          </ToggleWrapper>
          {showSlippage && (
            <SlippageWrapper>
              <SlippageSlider
                slippage={slippage !== 'autoSlippage' ? slippage : undefined}
              />
            </SlippageWrapper>
          )}
          <SubtitleWrapper>
            <Text
              id={'advancedOptions'}
              defaultMessage={'Advanced options'}
              kind={TextKind.SettingsSubtitle}
            />
          </SubtitleWrapper>
          <InputWrapper>
            <Input
              label={{
                id: 'tipForBlockAuthor',
                defaultMessage: 'Tip for block author',
              }}
              tooltip={{
                id: 'tipForBlockAuthorTooltip',
                defaultMessage: 'Tip for block author',
              }}
              unit={unit}
              placeholder={'00.00'}
              value={tipForAuthor?.toString()}
            ></Input>
          </InputWrapper>
          <InputWrapper>
            <Input
              label={{
                id: 'nonce',
                defaultMessage: 'Nonce',
              }}
              tooltip={{
                id: 'nonceTooltip',
                defaultMessage: 'Nonce',
              }}
              unit={unit}
              placeholder={'00.00'}
              value={nonce?.toString()}
            ></Input>
          </InputWrapper>
          <ToggleWrapper>
            <ToggleLabel>
              <Text
                id={'infiniteTransactionTime'}
                defaultMessage={'Infinite transaction time'}
                kind={TextKind.ToggleLabel}
              />
              <Tooltip
                id={'infiniteTransactionTime'}
                defaultMessage={'Infinite transaction time'}
              />
            </ToggleLabel>
            <Toggle
              toggled={!showLifetime}
              onClick={() => setShowLifetime(!showLifetime)}
            />
          </ToggleWrapper>
          {showLifetime && (
            <InputWrapper>
              <Input
                label={{
                  id: 'lifetime',
                  defaultMessage: 'Set block time',
                }}
                tooltip={{
                  id: 'lifetimeTooltip',
                  defaultMessage: 'Set block time',
                }}
                unit={'BLOCK NUMBER'}
                placeholder={'00.00'}
                value={lifetime?.toString()}
              ></Input>
            </InputWrapper>
          )}
        </ContentContainer>
        <ButtonGroup>
          <Button
            text={{
              id: 'back',
              defaultMessage: 'Back',
            }}
            onClick={() => onBack()}
            kind={ButtonKind.Secondary}
          />
          <Button
            text={{
              id: 'saveAndClose',
              defaultMessage: 'Save & Close',
            }}
            onClick={() => onSave()}
            kind={ButtonKind.Primary}
            disabled={error ? true : false}
            big={true}
          />
        </ButtonGroup>
      </ModalContainer>
    </ModalComponent>
  );
};
