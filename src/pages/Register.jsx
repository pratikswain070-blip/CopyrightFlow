import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Hexagon, Mail, Lock, User, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export const Register = () => {
  const { connectWallet, wallet, showToast, loginUser } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Creator', // Creator, Buyer
    region: 'United States',
    termsAccepted: false
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleWalletSelect = (wName) => {
    connectWallet(wName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      showToast("Missing Fields", "Please complete all registration fields.", "warning");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords Mismatch", "Passwords do not match.", "error");
      return;
    }
    if (!formData.termsAccepted) {
      showToast("Terms Required", "Please accept the Terms of Service.", "warning");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginUser(formData.email);
      showToast("Account Created!", "Registration successful. Welcome to copyrightFlow!", "success");
      navigate('/dashboard');
    }, 1500);
  };

  const regions = ['United States', 'United Kingdom', 'Canada', 'Germany', 'Australia', 'Japan', 'India', 'Singapore'];

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 py-16 relative overflow-hidden bg-grid-pattern">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary-purple/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg bg-navy-900 border border-navy-850 rounded-2xl p-8 shadow-2xl relative z-10 flex flex-col items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8 group">
          <div className="p-1.5 bg-primary-purple/10 border border-primary-purple/20 text-primary-purple rounded-lg group-hover:scale-105 transition-all">
            <Hexagon className="w-6 h-6 fill-primary-purple/10" />
          </div>
          <span className="font-display font-bold text-xl text-slate-100 tracking-wide">
            Copyright<span className="text-primary-purple">Flow</span>
          </span>
        </Link>

        <h2 className="text-xl font-bold font-display text-slate-100 mb-1 text-center">Create Your Account</h2>
        <p className="text-xs text-slate-400 text-center mb-6">Join the next-gen digital rights marketplace</p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          
          {/* Form Row: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Pratik Swain"
              icon={User}
              required
            />
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="pratik@copyrightflow.io"
              icon={Mail}
              required
            />
          </div>

          {/* Form Row: Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••••••"
              icon={Lock}
              required
            />
          </div>

          {/* Role selector cards */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role Profile</label>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => handleRoleSelect('Creator')}
                className={`border rounded-xl p-3 cursor-pointer transition-all flex items-center justify-between ${
                  formData.role === 'Creator'
                    ? 'border-primary-purple bg-primary-purple/5 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                    : 'border-navy-800 hover:border-navy-750 bg-navy-950/20'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-100">Creator</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">I publish and license IP</span>
                </div>
                {formData.role === 'Creator' && <Check className="w-4 h-4 text-primary-purple" />}
              </div>

              <div
                onClick={() => handleRoleSelect('Buyer')}
                className={`border rounded-xl p-3 cursor-pointer transition-all flex items-center justify-between ${
                  formData.role === 'Buyer'
                    ? 'border-primary-purple bg-primary-purple/5 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                    : 'border-navy-800 hover:border-navy-750 bg-navy-950/20'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-100">Buyer</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">I purchase license rights</span>
                </div>
                {formData.role === 'Buyer' && <Check className="w-4 h-4 text-primary-purple" />}
              </div>
            </div>
          </div>

          {/* Region selector dropdown */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Geographic Region</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full bg-navy-950 border border-navy-800 focus:border-primary-purple text-slate-200 text-sm rounded-lg p-2.5 outline-none transition-colors cursor-pointer"
            >
              {regions.map(reg => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
          </div>

          {/* Wallet connection step */}
          <div className="flex flex-col gap-2 border-t border-navy-850 pt-4">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step 2: Connect Web3 Wallet</label>
            
            {wallet.connected ? (
              <div className="bg-teal-green/10 border border-teal-green/30 text-teal-green p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Wallet Verified: {wallet.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : ""}</span>
                </div>
                <Badge type="success">Ready</Badge>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                {['MetaMask', 'WalletConnect', 'Coinbase'].map(w => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => handleWalletSelect(w === 'Coinbase' ? 'Coinbase Wallet' : w)}
                    className="py-2.5 bg-navy-950 hover:bg-navy-850 border border-navy-800 hover:border-primary-purple/40 text-[10px] font-semibold text-slate-300 rounded-lg transition-all cursor-pointer"
                  >
                    {w}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-2.5 text-xs text-slate-400 mt-2 cursor-pointer">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="rounded border-navy-700 bg-navy-950 text-primary-purple focus:ring-primary-purple/40 w-4 h-4 cursor-pointer mt-0.5 accent-primary-purple"
            />
            <span className="leading-normal">
              I agree to the{' '}
              <a href="#" className="text-primary-purple hover:underline font-semibold">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary-purple hover:underline font-semibold">Royalty Distribution Protocols</a>.
            </span>
          </label>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            loading={loading}
          >
            Create Account
          </Button>
        </form>

        <div className="text-xs text-slate-500 text-center mt-8 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-purple hover:underline font-semibold flex items-center justify-center gap-1 mt-1">
            Login to Account <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
