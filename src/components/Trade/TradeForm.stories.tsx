import { StorybookWrapper } from '../../misc/StorybookWrapper';
import { TradeForm, TradeFormProps } from './TradeForm';

export default {
  title: 'Trade/TradeForm',
  component: TradeForm,
  args: {
    assetPair: {
      assetA: {
        symbol: 'ETH',
        fullName: 'Ethereum',
      },
      assetB: {
        symbol: 'BTC',
        fullName: 'Bitcoin',
      },
    },
  } as TradeFormProps,
};

const Template = (args: TradeFormProps) => {
  return (
    <StorybookWrapper>
      <TradeForm {...args} />
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
