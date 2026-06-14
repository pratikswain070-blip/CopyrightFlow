import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hexagon, Mail, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useApp();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast("Subscription Successful", "Thank you for subscribing to CopyrightFlow updates!", "success");
    setEmail('');
  };

  return (
    <footer className="bg-navy-950 border-t border-navy-900 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-1 bg-primary-purple/10 border border-primary-purple/20 text-primary-purple rounded-lg">
                <Hexagon className="w-6 h-6 fill-primary-purple/10" />
              </div>
              <span className="font-display font-bold text-lg text-slate-100">
                Copyright<span className="text-primary-purple">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Automated digital asset licensing and dynamic royalty distribution platform. Secure your intellectual property and earn seamlessly.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 font-display">Product</h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link to="/marketplace" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/auctions" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  Auction House
                </Link>
              </li>
              <li>
                <Link to="/creator-portal" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  Creator Portal
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  Asset Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 font-display">Company</h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link to="/help" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-display">Newsletter</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Stay updated with the latest licensing updates, auctions, and feature releases.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full bg-navy-900 border border-navy-850 focus:border-primary-purple text-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none transition-colors"
                />
              </div>
              <Button type="submit" size="small" className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                Join
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-navy-900/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} CopyrightFlow. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
