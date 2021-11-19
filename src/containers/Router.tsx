import { Routes, Route } from 'react-router-dom';
import { TradePage } from '../pages/TradePage';
import { WalletPage } from '../pages/WalletPage';

export const Router = () => {
    return (
        <Routes>
            <Route path='/' element={<TradePage />} />
            <Route path='wallet' element={<WalletPage />} />
        </Routes>
    )
}