import classNames from 'classnames';
import './Button.scss';

export enum ButtonKind {
  Primary = 'Primary',
  Default = 'Default',
}

export const Button = ({
  kind = ButtonKind.Default,
  children,
}: {
  kind: ButtonKind;
  // TODO: just use text instead?
  children: string;
}) => {
  return (
    <button
      className={
        'button ' +
        classNames({
          'button--primary': kind === ButtonKind.Primary,
        })
      }
    >
      {children}
    </button>
  );
};
