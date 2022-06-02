import styled from '@emotion/styled/macro';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { variant } from 'styled-system';
import { Icon } from '../Icon/Icon';

export enum TextKind {
  Button = 'button',
  ButtonLoading = 'buttonLoading',
  TableButton = 'tableButton',
  Text = 'text',
  TextUrl = 'textUrl',
  TextError = 'textError',
  Title = 'title',
  TitleError = 'titleError',
  RowLabel = 'rowLabel',
  RowValue = 'rowValue',
  RowSecondValue = 'rowSecondValue',
  Timer = 'timer',
  AssetInputTitle = 'assetInputTitle',
  AssetInputSymbol = 'assetInputSymbol',
  AssetInputAsset = 'assetInputAsset',
  AssetInputAmount = 'assetInputAmount',
  MethodCallTitle = 'methodCallTitle',
  Tooltip = 'tooltip',
  StepperText = 'stepperText',
  StepperCurrentText = 'stepperCurrentText',
  InputLabel = 'inputLabel',
  InputError = 'inputError',
  InputSymbol = 'inputSymbol',
  RadioButton = 'radioButton',
  MetadataUpdateLabel = 'metadataUpdateLabel',
  MetadataUpdateValue = 'metadataUpdateValue',
}

export interface TextProps {
  id: string;
  kind?: TextKind;
  defaultMessage?: string;
  description?: string;
  values?: Record<string, ReactNode>;
}

const TextContainer = styled.div`
  width: fit-content;
`;

const TextComponent = styled('div')(
  {
    fontFamily: 'Satoshi',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  variant({
    variants: {
      button: {
        textAlign: 'center',
        fontStyle: 'bold',
        fontWeight: '700',
        fontSize: '14px',
        lineHeight: '18px',
        textTransform: 'uppercase',
      },
      tableButton: {
        textAlign: 'center',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '18px',

        color: '#8AFFCB',
      },
      buttonLoading: {
        textAlign: 'center',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '22px',

        color: '#F7BF06',
      },
      text: {
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '16px',
        lineHeight: '22px',

        color: '#daffee',
        opacity: '0.6',
      },
      textUrl: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '22px',

        color: '#4CF3A8',
        borderBottom: '1px solid #4CF3A8',
      },
      textError: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '20px',

        color: '#FFFFFF',
      },
      title: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '24px',
        lineHeight: '32px',
        letterSpacing: '0.01em',

        background:
          'linear-gradient(90deg,#ffce4f 1.27%, rgba(79, 255, 176, 0) 104.14%),#4fffb0',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
        'background-clip': 'text',
        'text-fill-color': 'transparent',
      },
      titleError: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '24px',
        lineHeight: '32px',
        letterSpacing: '0.01em',

        color: '#FF6868',
      },
      rowLabel: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '15px',
        lineHeight: '20px',

        color: '#BDCCD4',
        opacity: '0.8',
      },
      rowValue: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '15px',
        lineHeight: '20px',

        color: '#FFFFFF',
      },
      rowSecondValue: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '16px',

        color: '#4FFFB0',
      },
      timer: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '13px',
        lineHeight: '18px',

        color: '#FFFFFF',
        opacity: '0.5',
      },
      assetInputTitle: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '16px',
        lineHeight: '22px',

        color: '#FFFFFF',
        opacity: '0.7',
      },
      assetInputAmount: {
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '20px',
        lineHeight: '26px',

        color: '#FFFFFF',
      },
      assetInputSymbol: {
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '18px',
        lineHeight: '24px',

        color: '#FFFFFF',
        textTransform: 'uppercase',
      },
      assetInputAsset: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '14px',

        color: '#D1DEE8',
      },
      methodCallTitle: {
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '12px',
        lineHeight: '16px',

        color: '#f0da73',
      },
      tooltip: {
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '12px',
        lineHeight: '16px',

        color: '#ffffff',
      },
      stepperText: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '13px',

        color: '#ffffff',
        opacity: '0.5',
      },
      stepperCurrentText: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '13px',

        color: '#4CF3A8',
      },
      inputLabel: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '16px',
        lineHeight: '22px',

        color: '#ffffff',
        opacity: '0.7',
      },
      inputError: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '16px',

        color: '#FF8A8A',
      },
      inputSymbol: {
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '16px',
        lineHeight: '26px',

        color: '#ffffff',
        textAlign: 'right',
        textTransform: 'uppercase',
      },
      radioButton: {
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '17px',
        lineHeight: '26px',

        textAlign: 'center',
      },
      metadataUpdateLabel: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '16px',
        lineHeight: '22px',
      },
      metadataUpdateValue: {
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '20px',
        lineHeight: '26px',
      },
    },
  })
);

export const Text = ({
  id,
  kind = TextKind.Text,
  defaultMessage,
  description,
  values,
}: TextProps) => (
  <TextContainer>
    <TextComponent variant={kind}>
      <FormattedMessage
        id={id}
        defaultMessage={defaultMessage || id}
        description={description}
        values={values}
      />
      {kind === TextKind.TextUrl && <Icon name={'Url'} size={12} />}
    </TextComponent>
  </TextContainer>
);