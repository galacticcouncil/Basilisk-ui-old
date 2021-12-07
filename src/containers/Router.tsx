import { Routes, Route, Navigate } from 'react-router-dom';
import { TradePage } from '../pages/TradePage/TradePage';
import { WalletPage } from '../pages/WalletPage';

export const Router = () => {
    return (
        <Routes>
            <Route path='/' element={<TradePage />} />
            <Route path='wallet' element={<WalletPage />} />
            <Route path="*" element={<Navigate to='/'/>}/>
        </Routes>
    )
}