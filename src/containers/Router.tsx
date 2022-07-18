import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PoolsPage } from '../pages/PoolsPage/PoolsPage';
import { DebugBoxProvider } from '../pages/TradePage/hooks/useDebugBox';
import { TradePage } from '../pages/TradePage/TradePage';
import { WalletPage } from '../pages/WalletPage/WalletPage';

export const Router = () => {
  return (
    <Routes>
      <Route path="trade" element={<TradePage />} />
      <Route path="wallet" element={<WalletPage />} />
      <Route path="pools" element={<PoolsPage />} />
      <Route path="*" element={<Navigate to="/trade" />} />
    </Routes>
  );
};
