import styled from '@emotion/styled/macro';
import { Button, ButtonKind } from '../Button/Button';
import { Text, TextKind } from '../Text/Text';
import { Input } from '../Input/Input';
import { SlippageSlider } from '../SlippageSlider/SlippageSlider';
import { Toggle } from '../Toggle/Toggle';
import { Tooltip } from '../Tooltip/Tooltip';
import { createNumberMask } from 'text-mask-addons';
import { useFormContext } from 'react-hook-form';

export interface SettingsProps {
  onBack: () => void;
  onSave: () => void;
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

const InputWrapper = styled.div`
  width: 100%;
  padding: 10px 30px;
`;

export const Settings = ({ onBack, onSave, error, unit }: SettingsProps) => {
  // Defaults are set in parent component
  const methods = useFormContext();

  return (
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
            {...methods.register('slippage.auto')}
            toggled={Boolean(methods.getValues('slippage.auto'))}
            onClick={() =>
              methods.setValue(
                'slippage.auto',
                !Boolean(methods.getValues('slippage.auto'))
              )
            }
          />
        </ToggleWrapper>
        {!Boolean(methods.getValues('slippage.auto')) && (
          <SlippageWrapper>
            <SlippageSlider />
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
            name={'tipForBlockAuthor'}
            label={{
              id: 'tipForBlockAuthor',
              defaultMessage: 'Tip for block author',
            }}
            tooltip={{
              id: 'tipForBlockAuthorTooltip',
              defaultMessage: 'Tip for block author',
            }}
            onChange={(e) => {
              methods.setValue('tipForBlockAuthor.value', e.target.value);
            }}
            unit={unit}
            placeholder={'00.00'}
            value={methods.getValues('tipForBlockAuthor.value')}
          ></Input>
        </InputWrapper>
        <InputWrapper>
          <Input
            name={'nonce'}
            label={{
              id: 'nonce',
              defaultMessage: 'Nonce',
            }}
            tooltip={{
              id: 'nonceTooltip',
              defaultMessage: 'Nonce',
            }}
            onChange={(e) => {
              methods.setValue('nonce.value', e.target.value);
            }}
            placeholder={'00.00'}
            value={methods.getValues('nonce.value')}
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
            {...methods.register('lifetime.infinite')}
            toggled={Boolean(methods.getValues('lifetime.infinite'))}
            onClick={() =>
              methods.setValue(
                'lifetime.infinite',
                !Boolean(methods.getValues('lifetime.infinite'))
              )
            }
          />
        </ToggleWrapper>
        {!Boolean(methods.getValues('lifetime.infinite')) && (
          <InputWrapper>
            <Input
              name={'lifetime'}
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
              onChange={(e) => {
                methods.setValue('lifetime.blockNumber', e.target.value);
                // TODO: calculate time estimate
                methods.setValue('lifetime.value', '12/10/2022, 10:00:00');
              }}
              value={methods.getValues('lifetime.blockNumber')}
              mask={createNumberMask({
                prefix: '',
                suffix: '',
                includeThousandsSeparator: true,
                thousandsSeparatorSymbol: ' ',
                integerLimit: 12,
                allowNegative: false,
                allowLeadingZeroes: false,
              })}
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
  );
};
