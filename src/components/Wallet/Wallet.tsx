import {MutableRefObject} from "react";
import {FormattedBalance} from '../Balance/FormattedBalance/FormattedBalance';
import {Account} from "../../generated/graphql";
import {UnitStyle} from "../Balance/metricUnit";
import Identicon from '@polkadot/react-identicon';
import './Wallet.scss';

const horizontalBar = '―';

export interface WalletProps {
    modalContainerRef: MutableRefObject<HTMLDivElement | null>,
    account: Account,
}

export const Wallet = ({
    modalContainerRef,
    account
    }: WalletProps) => {
    return <div className='wallet flex-container flex-align-space'>
        <div className='wallet__icons-wrapper'>
            <span className='wallet__icon'>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 0.4375C6.51016 0.4375 0.4375 6.51235 0.4375 14C0.4375 21.492 6.51016 27.5625 14 27.5625C21.4898 27.5625 27.5625 21.492 27.5625 14C27.5625 6.51235 21.4898 0.4375 14 0.4375ZM14 24.9375C7.95528 24.9375 3.0625 20.0467 3.0625 14C3.0625 7.9573 7.9555 3.0625 14 3.0625C20.0425 3.0625 24.9375 7.95545 24.9375 14C24.9375 20.0446 20.0467 24.9375 14 24.9375ZM19.8649 10.9812C19.8649 14.6482 15.9044 14.7046 15.9044 16.0597V16.4062C15.9044 16.7687 15.6105 17.0625 15.2481 17.0625H12.7518C12.3894 17.0625 12.0956 16.7687 12.0956 16.4062V15.9327C12.0956 13.9779 13.5776 13.1965 14.6975 12.5686C15.6579 12.0302 16.2465 11.664 16.2465 10.951C16.2465 10.0078 15.0434 9.3818 14.0708 9.3818C12.8027 9.3818 12.2172 9.98211 11.3943 11.0207C11.1724 11.3007 10.7676 11.3527 10.4829 11.1369L8.96126 9.98309C8.68197 9.77134 8.61941 9.37792 8.81666 9.08824C10.1088 7.19091 11.7545 6.125 14.3169 6.125C17.0004 6.125 19.8649 8.21975 19.8649 10.9812ZM16.2969 20.125C16.2969 21.3915 15.2665 22.4219 14 22.4219C12.7335 22.4219 11.7031 21.3915 11.7031 20.125C11.7031 18.8585 12.7335 17.8281 14 17.8281C15.2665 17.8281 16.2969 18.8585 16.2969 20.125Z" fill="#BDCCD4"/>
                </svg>
            </span>
            <span className='wallet__icon'>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.427 26C20.427 27.8937 18.8922 29.4286 17 29.4286C15.1079 29.4286 13.5731 27.8937 13.5731 26H20.427ZM28.3362 21.1939C28.4067 21.2681 28.4745 21.3393 28.5388 21.4084C28.8602 21.7534 29.0027 22.167 29 22.5714C28.9947 23.45 28.3047 24.2857 27.2804 24.2857H6.71968C5.69539 24.2857 5.00593 23.45 5.00004 22.5714C4.99736 22.167 5.13986 21.7539 5.46129 21.4084C5.52557 21.3393 5.59334 21.2681 5.6639 21.1939C6.72939 20.0737 8.43289 18.2828 8.43289 13.1429C8.43289 8.98036 11.3515 5.64821 15.2868 4.83071V3.71429C15.2868 2.76768 16.054 2 17 2C17.9461 2 18.7133 2.76768 18.7133 3.71429V4.83071C19.9854 5.09499 21.1513 5.62204 22.1468 6.35498C20.3032 7.09144 19.0007 8.89361 19.0007 11C19.0007 13.7614 21.2393 16 24.0007 16C24.6088 16 25.1915 15.8914 25.7306 15.6927C26.182 18.9292 27.4699 20.2832 28.3362 21.1939Z" fill="#BDCCD4"/>
                    <circle cx="24" cy="11" r="3" fill="#4FFFB0"/>
                </svg>
            </span>
        </div>
        <div className="flex-container wallet__info-wrapper">
            <div className="flex-container column text-end">
                <FormattedBalance balance={account.balances[0]} unitStyle={UnitStyle.SHORT} precision={1}/>
                <div className="wallet__fiat-balance">~$ {horizontalBar}</div>
            </div>
            <div>
                <Identicon value={'E7ncQKp4xayUoUdpraxBjT7NzLoayLJA4TuPcKKboBkJ5GH'}
                    size={32}/>
            </div>
            <div className="wallet__account-name">{account.name}</div>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M4.46879 7.00939L0.218787 2.75938C-0.0749634 2.46563 -0.0749634 1.99063 0.218787 1.7L0.925036 0.99375C1.21879 0.7 1.69379 0.7 1.98441 0.99375L4.99691 4.00626L8.00941 0.99375C8.30316 0.7 8.77816 0.7 9.06879 0.99375L9.77503 1.7C10.0688 1.99375 10.0688 2.46875 9.77503 2.75938L5.52504 7.00939C5.23754 7.30314 4.76254 7.30314 4.46879 7.00939Z" fill="#BDCCD4"/>
                </svg>
            </div>
        </div>
    </div>
}