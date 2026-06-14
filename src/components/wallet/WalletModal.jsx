import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { ArrowRight, Wallet, CheckCircle, ShieldAlert } from 'lucide-react';

export const WalletModal = () => {
  const { wallet, walletModalOpen, setWalletModalOpen, connectWallet, disconnectWallet } = useApp();
  const [selectedWallet, setSelectedWallet] = useState(null);

  const wallets = [
    {
      name: 'MetaMask',
      subtitle: 'Connect to your MetaMask browser extension',
      logo: '🦊'
    },
    {
      name: 'WalletConnect',
      subtitle: 'Scan a QR code to connect with your mobile wallet',
      logo: '🌐'
    },
    {
      name: 'Coinbase Wallet',
      subtitle: 'Connect using Coinbase Wallet on web or mobile',
      logo: '🛡️'
    }
  ];

  const handleConnect = (walletName) => {
    setSelectedWallet(walletName);
    connectWallet(walletName);
  };

  const handleClose = () => {
    setWalletModalOpen(false);
    // Reset state after transition finishes
    setTimeout(() => {
      setSelectedWallet(null);
    }, 300);
  };

  return (
    <Modal isOpen={walletModalOpen} onClose={handleClose} size="sm">
      {wallet.status === 'idle' && (
        <div className="flex flex-col items-center">
          <div className="p-3 bg-primary-purple/10 border border-primary-purple/20 text-primary-purple rounded-full mb-4">
            <Wallet className="w-6 h-6" />
          </div>
          
          <h2 className="text-xl font-bold font-display text-slate-100 text-center mb-1">Connect Your Wallet</h2>
          <p className="text-xs text-slate-400 text-center mb-6">Select a provider to connect your wallet and manage your licenses</p>

          <div className="flex flex-col gap-3 w-full">
            {wallets.map((w) => (
              <button
                key={w.name}
                onClick={() => handleConnect(w.name)}
                className="flex items-center justify-between p-4 bg-navy-850 hover:bg-navy-800 border border-navy-700 hover:border-primary-purple/50 rounded-xl transition-all duration-300 text-left group cursor-pointer hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-1 bg-navy-900 rounded-lg">{w.logo}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{w.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{w.subtitle}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-primary-purple group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}

      {wallet.status === 'connecting' && (
        <div className="flex flex-col items-center py-8">
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-16 h-16 border-4 border-primary-purple/20 border-t-primary-purple rounded-full animate-spin" />
            <span className="absolute text-xl">⚡</span>
          </div>

          <h2 className="text-lg font-bold font-display text-slate-100 mb-1">Connecting to {selectedWallet}...</h2>
          <p className="text-xs text-slate-400 text-center max-w-[240px]">
            Please approve the request in your wallet window to establish a secure connection.
          </p>
        </div>
      )}

      {wallet.status === 'verified' && (
        <div className="flex flex-col items-center text-center py-4">
          <div className="p-3 bg-teal-green/10 border border-teal-green/20 text-teal-green rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold font-display text-slate-100 mb-1">Wallet Verified</h2>
          <p className="text-xs text-slate-400 mb-6">Connection established and safety checks cleared</p>

          <div className="w-full bg-navy-950/60 border border-navy-800 rounded-xl p-3 mb-6 font-mono text-xs text-slate-400 flex justify-between items-center">
            <span>Address:</span>
            <span className="text-teal-green font-medium">
              {wallet.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : ""}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-2.5 bg-primary-purple hover:bg-primary-purple-hover text-white rounded-lg text-sm font-semibold transition-all hover-glow-purple cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
    </Modal>
  );
};
