import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Hexagon, Menu, X, Wallet, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { wallet, setWalletModalOpen, disconnectWallet, user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Auction House', path: '/auctions' },
    { name: 'Creator Portal', path: '/creator-portal' },
    { name: 'Help', path: '/help' }
  ];

  const handleConnectClick = () => {
    if (wallet.connected) {
      setDropdownOpen(!dropdownOpen);
    } else {
      setWalletModalOpen(true);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setDropdownOpen(false);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    setDropdownOpen(false);
  };


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/70 backdrop-blur-md border-b border-navy-900/60 h-16 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-1 bg-primary-purple/10 border border-primary-purple/20 text-primary-purple rounded-lg group-hover:scale-105 transition-all">
            <Hexagon className="w-6 h-6 fill-primary-purple/10" />
          </div>
          <span className="font-display font-bold text-lg text-slate-100 tracking-wide">
            Copyright<span className="text-primary-purple">Flow</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-slate-100 ${
                  isActive ? 'text-primary-purple-hover' : 'text-slate-400'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4 relative">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 p-1 pr-3 rounded-full bg-navy-900 border border-navy-800 hover:border-primary-purple/40 hover:bg-navy-850 transition-all cursor-pointer"
              title="Go to Dashboard"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-primary-purple/30"
              />
              <span className="text-xs font-semibold text-slate-200">{user.name}</span>
            </button>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="small">
                Login
              </Button>
            </Link>
          )}
          
          <Button
            variant={wallet.connected ? 'secondary' : 'primary'}
            size="small"
            onClick={handleConnectClick}
            className="flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            <span>
              {wallet.connected
                ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
                : 'Connect Wallet'}
            </span>
          </Button>

          {/* Connected Wallet Dropdown */}
          {wallet.connected && dropdownOpen && (
            <div className="absolute right-0 top-12 w-48 bg-navy-900 border border-navy-800 rounded-xl py-1 shadow-2xl z-50 overflow-hidden">
              <button
                onClick={handleDashboard}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-300 hover:bg-navy-800 hover:text-slate-100 transition-colors text-left"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                <span>My Dashboard</span>
              </button>
              <hr className="border-navy-800 my-1" />
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-soft-red hover:bg-soft-red/10 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-400 hover:text-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-navy-950 border-b border-navy-900 py-4 px-6 flex flex-col gap-4 shadow-2xl z-50">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-base font-semibold py-2 transition-colors ${
                  isActive ? 'text-primary-purple-hover' : 'text-slate-400'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <hr className="border-navy-900 my-1" />
          <div className="flex flex-col gap-3">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-navy-900 border border-navy-800 text-slate-200 text-sm font-semibold hover:bg-navy-850 transition-all cursor-pointer w-full"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover border border-primary-purple/30"
                />
                <span>{user.name} (Dashboard)</span>
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="medium" className="w-full">
                  Login
                </Button>
              </Link>
            )}
            
            <Button
              variant={wallet.connected ? 'secondary' : 'primary'}
              size="medium"
              onClick={() => {
                setMobileMenuOpen(false);
                handleConnectClick();
              }}
              className="w-full flex items-center justify-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>
                {wallet.connected
                  ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
                  : 'Connect Wallet'}
              </span>
            </Button>

            {user && (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="medium" className="w-full text-slate-300">
                    My Dashboard
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="medium"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleDisconnect();
                  }}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
