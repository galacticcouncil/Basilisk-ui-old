import { Routes, Route, Navigate } from 'react-router-dom';
import { TradePage } from '../pages/TradePage/TradePage';
import { WalletPage } from '../pages/WalletPage';
import { ActionLogPage } from '../pages/ActionLogPage';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<TradePage />} />
      <Route path="wallet" element={<WalletPage />} />
      <Route path="log" element={<ActionLogPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
