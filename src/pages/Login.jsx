import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import { Hexagon, Mail, Lock, Wallet, ArrowRight } from 'lucide-react';

export const Login = () => {
  const { connectWallet, showToast, loginUser } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showToast("Missing Fields", "Please enter your credentials.", "warning");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginUser(formData.email);
      showToast("Welcome Back!", "Successfully logged in to CopyrightFlow.", "success");
      navigate('/dashboard');
    }, 1200);
  };

  const handleWalletLogin = (provider) => {
    connectWallet(provider);
    // Redirect to dashboard after connection
    setTimeout(() => {
      navigate('/dashboard');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 relative overflow-hidden bg-grid-pattern">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary-purple/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-navy-900 border border-navy-850 rounded-2xl p-8 shadow-2xl relative z-10 flex flex-col items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8 group">
          <div className="p-1.5 bg-primary-purple/10 border border-primary-purple/20 text-primary-purple rounded-lg group-hover:scale-105 transition-all">
            <Hexagon className="w-6 h-6 fill-primary-purple/10" />
          </div>
          <span className="font-display font-bold text-xl text-slate-100 tracking-wide">
            Copyright<span className="text-primary-purple">Flow</span>
          </span>
        </Link>

        <h2 className="text-xl font-bold font-display text-slate-100 mb-1 text-center">Welcome Back</h2>
        <p className="text-xs text-slate-400 text-center mb-6">Access your assets and licensing royalty ledger</p>

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="pratik.swain@copyrightflow.io"
            icon={Mail}
            required
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••••••"
            icon={Lock}
            required
          />

          <div className="flex justify-end mt-0.5">
            <a href="#" className="text-xs text-primary-purple hover:underline font-medium">Forgot password?</a>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            loading={loading}
          >
            Login
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center w-full my-6">
          <div className="flex-1 h-px bg-navy-800" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-3">or connect web3</span>
          <div className="flex-1 h-px bg-navy-800" />
        </div>

        {/* Wallet Options */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={() => handleWalletLogin('MetaMask')}
            className="w-full py-2.5 bg-navy-850 hover:bg-navy-800 border border-navy-750 hover:border-primary-purple/40 text-slate-200 text-xs rounded-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>🦊</span>
            <span>Connect MetaMask</span>
          </button>

          <button
            onClick={() => handleWalletLogin('WalletConnect')}
            className="w-full py-2.5 bg-navy-850 hover:bg-navy-800 border border-navy-750 hover:border-primary-purple/40 text-slate-200 text-xs rounded-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>🌐</span>
            <span>Connect WalletConnect</span>
          </button>
        </div>

        {/* Redirection Link */}
        <div className="text-xs text-slate-500 text-center mt-8 font-medium">
          New to CopyrightFlow?{' '}
          <Link to="/register" className="text-primary-purple hover:underline font-semibold flex items-center justify-center gap-1 mt-1">
            Create an Account <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
