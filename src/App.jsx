import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import { AssetDetail } from './pages/AssetDetail';
import { AuctionHouse } from './pages/AuctionHouse';
import { Dashboard } from './pages/Dashboard';
import { CreatorPortal } from './pages/CreatorPortal';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Help } from './pages/Help';
import { WalletModal } from './components/wallet/WalletModal';
import { Toast } from './components/ui/Toast';

const AppContent = () => {
  const { toast, hideToast } = useApp();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/assets/:id" element={<AssetDetail />} />
        <Route path="/auctions" element={<AuctionHouse />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/creator-portal" element={<CreatorPortal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/help" element={<Help />} />
      </Routes>

      {/* Global Wallet Connect Overlay Modal */}
      <WalletModal />

      {/* Global floating Toast Notification */}
      <Toast
        title={toast.title}
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
