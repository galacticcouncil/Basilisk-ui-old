import './shared.scss'
import ScssColors from './colors.module.scss';

const Color = ({ color }: { color: string }) => {
    return <div className='row justify-content-center text-center'>
        <div
            style={{
                width: '150px',
                height: '150px',
                marginTop: '24px',
                marginBottom: '8px'
            }}
            className={`bg-${color}`}
        ></div>
        <p>{color}</p>
    </div>
}

const ColorGrid = () => {
    const colors: string[] = ScssColors.colors
        .replace('[', '')
        .replace(']', '')
        .split(' ');

    return <div className="container">
        <div className="row">
            {colors.map((color, i) => (
                <div
                    key={i} 
                    className="col-2 justify-content-center align-content-center"
                >
                    <Color color={color} />
                </div>
            ))}
        </div>
    </div>
}

export default {
    component: ColorGrid,
    title: 'Shared/Colors'
}

export const Colors = () => <ColorGrid/>