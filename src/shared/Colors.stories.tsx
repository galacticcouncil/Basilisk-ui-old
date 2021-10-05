import './shared.scss'
import Colors from './colors.module.scss';

const Color = ({ color }: { color: string }) => {
    return <div className='row justify-content-center text-center'>
        <div
            style={{
                width: '100px',
                height: '100px',
                marginTop: '24px'
            }}
            className={`bg-${color}`}
        ></div>
        <p>{color}</p>
    </div>
}

export const ColorGrid = () => {
    const colors: string[] = Colors.colors
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