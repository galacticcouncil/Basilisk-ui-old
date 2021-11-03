import { StorybookWrapper } from '../../misc/StorybookWrapper';
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
                click here
            </Button>
        </div>
    </StorybookWrapper>
}

export const Default = Template.bind({})