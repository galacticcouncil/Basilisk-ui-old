import { Navigate, Route, Routes } from 'react-router-dom'
import { PoolsPage } from '../pages/PoolsPage/PoolsPage'
import { LBPPage } from '../pages/TradePage/LBPPage'
import { TradePage } from '../pages/TradePage/TradePage'
import { WalletPage } from '../pages/WalletPage/WalletPage'

export const Router = () => {
  return (
    <Routes>
      <Route path="lbp" element={<LBPPage />} />
      <Route path="trade" element={<TradePage />} />
      <Route path="wallet" element={<WalletPage />} />
      <Route path="pools" element={<PoolsPage />} />
      <Route path="*" element={<Navigate to="/trade" />} />
    </Routes>
  )
}
