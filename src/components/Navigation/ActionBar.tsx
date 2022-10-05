import './ActionBar.scss'
import { Link } from 'react-router-dom'

export interface ActionBarProps {
  isExtensionAvailable: boolean
  extensionLoading: boolean
  activeAccountLoading: boolean
  accountData?: {
    name?: string
    address?: string
    nativeAssetBalance?: string
  }
}

export const ActionBar = ({
  extensionLoading,
  activeAccountLoading,
  accountData,
  isExtensionAvailable
}: ActionBarProps) => {
  return (
    <div className="action-bar">
      <div className="action-bar-icons action-bar-item">
        <div className="action-bar-help action-bar-icon ">?</div>
        <div className="action-bar-notifications action-bar-icon ">!</div>
      </div>
      <div>
        {extensionLoading || activeAccountLoading ? (
          <div className="action-bar-error action-bar-item">loading...</div>
        ) : isExtensionAvailable ? (
          <>
            {accountData?.name ? (
              <div className="action-bar-account-info action-bar-item">
                <div className="action-bar-account-balance action-bar-account-item">
                  {accountData?.nativeAssetBalance} BSX
                </div>
                {/* TODO! Acc name / address + Icon component*/}
                <div className="action-bar-account-name action-bar-account-item">
                  {accountData?.name}
                </div>
              </div>
            ) : (
              <Link
                className="action-bar-select-account action-bar-item"
                to="/wallet"
              >
                select account
              </Link>
            )}
          </>
        ) : (
          <div className="action-bar-error action-bar-item">
            Extension unavailable
          </div>
        )}
      </div>
      <div className="action-bar-settings action-bar-item">v</div>
    </div>
  )
}
