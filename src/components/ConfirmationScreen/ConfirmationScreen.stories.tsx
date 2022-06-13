import { ConfirmationScreen } from './ConfirmationScreen';
import {
  UpdateMetadata,
  UpdateMetadataProps,
} from './UpdateMetadata/UpdateMetadata';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../misc/StorybookWrapper';
import { FormProvider, useForm } from 'react-hook-form';
import { useState } from 'react';
import {
  CancelConfirmation,
  CancelConfirmationProps,
} from './CancelConfirmation/CancelConfirmation';
import { ConfirmSwap, ConfirmSwapProps } from './ConfirmSwap/ConfirmSwap';
import {
  Default as TableDefault,
  NoEdit as TableNoEdit,
} from './Table/Table.stories';
import BSX from './AssetIcon/assets/BSX.svg';
import BSXChain from './AssetIcon/assets/BSXChain.svg';
import KSM from './AssetIcon/assets/KSM.svg';
import { AssetInputType } from './AssetInput/AssetInput';
import { maskValue } from './helpers/mask';
import {
  ReviewTransaction,
  ReviewTransactionProps,
} from './ReviewTransaction/ReviewTransaction';
import {
  SentTransaction,
  SentTransactionProps,
} from './SentTransaction/SentTransaction';
import { MethodTextProps } from './MethodText/MethodText';
import { Default as MethodTextStory } from './MethodText/MethodText.stories';
import { TableProps } from './Table/Table';
import { Settings, SettingsProps } from './Settings/Settings';
import { last, dropRight } from 'lodash';
import { useEffect } from 'react';

export default {
  title: 'components/ConfirmationScreen/ConfirmationScreen',
  component: ConfirmationScreen,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof ConfirmationScreen>;

type Stage =
  | 'CancelConfirmation'
  | 'UpdateMetadata'
  | 'ReviewTransaction'
  | 'SentTransactionEmit'
  | 'SentTransactionDone'
  | 'ConfirmSwap'
  | 'Settings';

const Template: ComponentStory<typeof ConfirmationScreen> = (args) => {
  const [history, setHistory] = useState<Stage[]>(['UpdateMetadata']);
  const lastHistory = last(history);
  const [currentStep, setCurrentStep] = useState(0);
  const defaults = {
    minimalAmountReceived: { value: maskValue('32456.46') },
    slippage: { custom: '5', value: '5' },
    transactionCost: { value: '12', secondValue: '2' },
    lifetime: {
      blockNumber: '0',
      infinite: true,
      value: '12/10/2022, 10:00:00',
    },
    nonce: { value: '0' },
    tipForBlockAuthor: { value: maskValue('0.0066') },
  };

  const methods = useForm({ defaultValues: defaults });
  console.log('watch(): ', methods.watch());

  const UpdateMetadataProps: UpdateMetadataProps = {
    oldVersion: '0.23a',
    newVersion: '0.73d',
    onCancel: () => handleCancel(),
    onUpdateMetadata: () => handleUpdateMetadata(),
  };

  const CancelConfirmationProps: CancelConfirmationProps = {
    onBack: () => handleBack(),
    onCancel: () => handleReset(),
  };

  const assetIn = {
    name: 'Basilisk',
    icon: BSX,
    symbol: 'BSX',
    chain: {
      name: 'Karura',
      icon: BSXChain,
    },
    amount: '10 000 000.000000000',
    type: AssetInputType.Buy,
  };

  const assetOut = {
    name: 'Kusama',
    icon: KSM,
    symbol: 'KSM',
    chain: {
      name: 'Karura',
      icon: BSXChain,
    },
    amount: '10 000.000000000',
    type: AssetInputType.Receive,
  };

  const ConfirmSwapProps: ConfirmSwapProps = {
    assetIn: assetIn,
    assetOut: assetOut,
    onReview: () => handleReview(),
    onCancel: () => handleBack(),
    table: {
      handleEdit: () => handleEdit(),
      settings: TableDefault.args?.settings || [],
      advancedSettings: TableDefault.args?.advancedSettings || [],
    },
  };

  const ReviewTransactionProps: ReviewTransactionProps = {
    methodCall: MethodTextStory.args as MethodTextProps,
    table: TableNoEdit.args as TableProps,
    onSign: () => handleSign(),
    onCancel: () => handleBack(),
    nextBlockTime: 10,
  };

  const SettingsProps: SettingsProps = {
    onBack: () => handleBack(),
    onSave: () => handleSettings(),
    unit: 'BSX',
  };

  const SentTransactionPropsEmit: SentTransactionProps = {
    onAction: () => handleEmit(),
    status: 'sent'
  };

  const SentTransactionPropsSubmitted: SentTransactionProps = {
    onAction: () => handleReset(),
    status: 'submitted',
  };

  useEffect(() => {
    switch (lastHistory) {
      case 'UpdateMetadata': {
        setCurrentStep(0);
        break;
      }
      case 'ConfirmSwap': {
        setCurrentStep(1);
        break;
      }
      case 'ReviewTransaction': {
        setCurrentStep(2);
        break;
      }
      case 'SentTransactionEmit': {
        setCurrentStep(2);
        break;
      }
      default: {
        break;
      }
    }
  }, [lastHistory]);

  const handleBack = () => {
    setHistory(history.length > 1 ? dropRight(history) : history);
  };

  const handleReset = () => {
    setHistory([...history, 'UpdateMetadata']);
  };

  const handleCancel = () => {
    setHistory([...history, 'CancelConfirmation']);
  };

  const handleUpdateMetadata = () => {
    setHistory([...history, 'ConfirmSwap']);
  };

  const handleReview = () => {
    setHistory([...history, 'ReviewTransaction']);
  };

  const handleEdit = () => {
    setHistory([...history, 'Settings']);
  };

  const handleSign = () => {
    setHistory([...history, 'SentTransactionEmit']);
  };

  const handleEmit = () => {
    setHistory([...history, 'SentTransactionDone']);
  };

  const handleSettings = () => {
    setHistory([...history, 'ConfirmSwap']);
  };

  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <FormProvider {...methods}>
          <ConfirmationScreen {...args} currentStep={currentStep}>
            {lastHistory === 'CancelConfirmation' && (
              <CancelConfirmation {...CancelConfirmationProps} />
            )}
            {lastHistory === 'UpdateMetadata' && (
              <UpdateMetadata {...UpdateMetadataProps} />
            )}
            {lastHistory === 'ConfirmSwap' && (
              <ConfirmSwap {...ConfirmSwapProps} nextBlockTime={10} />
            )}
            {lastHistory === 'ReviewTransaction' && (
              <ReviewTransaction {...ReviewTransactionProps} />
            )}
            {lastHistory === 'SentTransactionEmit' && (
              <SentTransaction {...SentTransactionPropsEmit}/>
            )}
            {lastHistory === 'SentTransactionDone' && (
              <SentTransaction {...SentTransactionPropsSubmitted} />
            )}
            {lastHistory === 'Settings' && <Settings {...SettingsProps} />}
          </ConfirmationScreen>
        </FormProvider>
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  steps: {
    steps: [
      {
        id: 'metadata',
        defaultMessage: 'Metadata',
      },
      {
        id: 'confirmation',
        defaultMessage: 'Confirmation',
      },
      {
        id: 'reviewAndSign ',
        defaultMessage: 'Review & Sign',
      },
    ],
  },
};
