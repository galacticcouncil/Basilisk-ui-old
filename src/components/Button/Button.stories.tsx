import { StorybookWrapper } from '../../shared/StorybookWrapper';
import { Button, ButtonKind } from './Button';


export default {
    title: 'components/Button/Button',
    component: Button
}

const Template = () => {
    return <StorybookWrapper>
        <div style={{
            width: '380px'
        }}>
            <Button kind={ButtonKind.Primary}>
                Text
            </Button>
        </div>
    </StorybookWrapper>
}

export const Default = Template.bind({})