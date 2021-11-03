import classNames from 'classnames'
import './Button.scss'

export enum ButtonKind {
    Primary = 'Primary'
}

export const Button = ({
    // TODO: default should not be primary
    kind = ButtonKind.Primary,
    children
}: {
    kind: ButtonKind,
    // TODO: just use text instead?
    children: string
}) => {
    return <button 
        className={"button " + classNames({
            "button--primary": kind == ButtonKind.Primary
        })}
    >
        {children}
    </button>
}