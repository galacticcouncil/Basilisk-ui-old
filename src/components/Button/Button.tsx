import classNames from 'classnames'
import './Button.scss'

export enum ButtonKind {
    Primary = 'Primary'
}

export interface ButtonProps {
    children: string
    kind?: ButtonKind
    onClick?: () => void
}

export const Button = ({
    // TODO: default should not be primary
    kind = ButtonKind.Primary,
    children
}: ButtonProps) => {
    return <button 
        className={"button " + classNames({
            "button--primary": kind === ButtonKind.Primary
        })}
    >
        {children}
    </button>
}