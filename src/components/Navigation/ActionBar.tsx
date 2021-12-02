import './ActionBar.scss';
import { Link } from 'react-router-dom';

export interface ActionBarProps {
    isExtensionAvailable: boolean;
  extensionLoading: boolean;
  activeAccountLoading: boolean;
  accountData?: {
          name: string;
          address: string;
          nativeAssetBalance: string | undefined;
  };
}

export const ActionBar = ({
  extensionLoading,
  activeAccountLoading,
  accountData,
  isExtensionAvailable,
}: ActionBarProps) => {
  return (
    <div className="app-bar">
      <div className="app-bar-help">?</div>
      <div className="app-bar-notifications">!</div>
      <div>
        <b>Active account: </b>
        {extensionLoading || activeAccountLoading ? (
          'loading...'
        ) : isExtensionAvailable ? (
          <>
            {accountData?.name ? (
              <>
                <div>
                  {accountData?.name}
                  {' | '}
                  {accountData?.nativeAssetBalance} BSX
                </div>
              </>
            ) : (
              <Link to="/wallet">select an account</Link>
            )}
          </>
        ) : (
          <div>Extension unavailable</div>
        )}
      </div>
      <div className="app-bar-settings">v</div>
    </div>
  );
};
