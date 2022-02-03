import classNames from 'classnames';
import './Button.scss';

export enum ButtonKind {
  Primary = 'Primary',
  Secondary = 'Secondary',
}

export interface ButtonProps {
  children: string;
  kind?: ButtonKind;
  onClick?: () => void;
}

export const Button = ({
  // TODO: default should not be primary
  kind = ButtonKind.Primary,
  children,
  onClick,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        'button',
        {
          'button--primary': kind === ButtonKind.Primary,
        },
        { 'button--secondary': kind === ButtonKind.Secondary }
      )}
    >
      {children}
    </button>
  );
};
