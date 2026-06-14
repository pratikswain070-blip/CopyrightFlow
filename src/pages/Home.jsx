import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

import {
  Upload,
  Shield,
  Coins,
  Cpu,
  Zap,
  RotateCcw,
  Wallet,
  BarChart3,
  Users,
  Check,
  Hexagon,
  ArrowRight,
  TrendingUp,
  FileText,
  Workflow
} from 'lucide-react';

export const Home = () => {

  // Stats bar data
  const stats = [
    { value: '1,240+', label: 'Total Assets Listed' },
    { value: '₹142.5K', label: 'Total Royalties Paid' },
    { value: '480+', label: 'Active Creators' },
    { value: '8,920+', label: 'Trades Completed' }
  ];

  // How it works steps
  const steps = [
    {
      num: '01',
      title: 'Upload Your Asset',
      desc: 'Publish your music, illustration, code, or design. Set your starting price and custom secondary sale royalty split percentage.',
      icon: Upload
    },
    {
      num: '02',
      title: 'Buyer Gets Verified',
      desc: 'Licenses are validated dynamically. Buyers purchase ownership rights securely with instant validation matching smart contracts.',
      icon: Shield
    },
    {
      num: '03',
      title: 'Royalties Flow Automatically',
      desc: 'Every future resale automatically splits payments in real-time, routing defined shares directly into the creator wallet.',
      icon: Coins
    }
  ];

  // 8 Case study features
  const features = [
    { title: 'Automated Licensing', desc: 'Instant minting of intellectual properties as cryptographically secure files.', icon: Cpu, color: 'text-primary-purple' },
    { title: 'Instant Splits', desc: 'Secondary payments route directly to creators without platform delays.', icon: Zap, color: 'text-primary-purple' },
    { title: 'Safety Checker', desc: 'Real-time double-verification of ownership, prevents copyright fraud.', icon: Shield, color: 'text-primary-purple' },
    { title: 'Multi-Format Support', desc: 'Easily register music loops, gaming sprite-sheets, typography, and artworks.', icon: FileText, color: 'text-primary-purple' },
    { title: 'Rollback Recovery', desc: 'Built-in safety protocol reverses assets if transaction failures occur.', icon: RotateCcw, color: 'text-primary-purple' },
    { title: 'Universal Wallets', desc: 'Compatible with MetaMask, Coinbase Wallet, and WalletConnect.', icon: Wallet, color: 'text-primary-purple' },
    { title: 'Royalty Analytics', desc: 'Track sales, volume, pricing trends, and payouts with clear dashboard reports.', icon: BarChart3, color: 'text-primary-purple' },
    { title: 'Custom Splits', desc: 'Define precise royalty splits among co-producers, platforms, and buyers.', icon: Users, color: 'text-primary-purple' }
  ];

  // Who it is for
  const audiences = [
    {
      role: 'Creators',
      desc: 'Independent musicians, game developers, designers, and visual artists looking to secure secondary sale earnings.',
      benefits: [
        'Guaranteed royalties up to 30%',
        'No middleman fee distributions',
        'Direct connection to buyers'
      ]
    },
    {
      role: 'Buyers & Traders',
      desc: 'Producers, project leads, and collectors looking for verified digital materials to embed in their products.',
      benefits: [
        'Fully audited, verifiable licenses',
        'Direct transfers in seconds',
        'Secondary market trading'
      ]
    },
    {
      role: 'Enterprise Platforms',
      desc: 'Asset libraries, game distributors, and music platforms looking to integrate royalty distribution APIs.',
      benefits: [
        'Robust developer webhooks',
        'SLA-backed transfer support',
        'Custom licensing agreements'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-300 flex flex-col overflow-hidden bg-grid-pattern">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="max-w-4xl flex flex-col items-center gap-6">
          <div className="animate-slide-up">
            <Badge type="purple">Web3 IP Royalty Protocol</Badge>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-50 font-display leading-[1.1] animate-slide-up delay-100">
            Own, Trade and Earn from <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-slate-400">
              Digital Assets Automatically
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed font-sans animate-slide-up delay-200">
            CopyrightFlow is a decentralized licensing and royalty infrastructure. List artwork, music licenses, and game models. Royalties route directly to creator wallets on every resale.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-2 animate-slide-up delay-300">
            <Link to="/marketplace">
              <Button variant="primary" size="large">
                Explore Marketplace
              </Button>
            </Link>
            <Link to="/creator-portal">
              <Button variant="ghost" size="large" className="border border-navy-800 text-slate-300 hover:bg-navy-900">
                List Your Asset
              </Button>
            </Link>
          </div>
        </div>

        {/* Animated Flow Diagram */}
        <div
          className="mt-16 w-full max-w-3xl bg-navy-900/60 border border-navy-900 backdrop-blur-md rounded-2xl p-8 relative flex flex-col items-center justify-center overflow-hidden animate-scale-up delay-500"
        >
          <div className="absolute top-2 left-4 text-[10px] font-mono font-semibold tracking-wider text-slate-600 uppercase flex items-center gap-1.5">
            <Workflow className="w-3.5 h-3.5 text-primary-purple" />
            Live IP Distribution Flow
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-8 relative z-10 py-6">
            {/* Creator Node */}
            <div className="flex flex-col items-center gap-2 w-32">
              <div className="w-16 h-16 rounded-2xl bg-primary-purple/10 border border-primary-purple/30 flex items-center justify-center text-primary-purple shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Users className="w-8 h-8" />
              </div>
              <span className="font-display font-semibold text-slate-200 text-sm">Creator</span>
              <span className="text-[10px] font-mono text-slate-500">0x7F3a...C4D1</span>
            </div>

            {/* Connecting lines - SVG */}
            <div className="hidden sm:block flex-1 relative h-16 w-full">
              <svg className="w-full h-full" viewBox="0 0 200 40">
                <path
                  d="M 10 20 L 190 20"
                  fill="none"
                  stroke="var(--color-primary-purple)"
                  strokeOpacity="0.2"
                  strokeWidth="2"
                />
                <path
                  d="M 10 20 L 190 20"
                  fill="none"
                  stroke="var(--color-primary-purple)"
                  strokeWidth="2"
                  className="animate-dash"
                />
              </svg>
              {/* Floating Royalty Label */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-royalty-flow bg-primary-purple/10 border border-primary-purple/30 text-primary-purple px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                15% Royalty
              </div>
            </div>

            {/* CopyrightFlow Node */}
            <div className="flex flex-col items-center gap-2 w-36">
              <div className="w-20 h-20 rounded-full bg-navy-950 border border-navy-800 flex items-center justify-center text-primary-purple relative shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <Hexagon className="w-10 h-10 fill-primary-purple/5 animate-pulse" />
                <div className="absolute text-[10px] font-display font-bold tracking-tight text-white mt-0.5">CF Protocol</div>
              </div>
              <span className="font-display font-bold text-slate-100 text-sm">CopyrightFlow</span>
              <span className="text-[9px] font-mono text-primary-purple uppercase tracking-wider">Verification Node</span>
            </div>

            {/* Connecting lines - SVG */}
            <div className="hidden sm:block flex-1 relative h-16 w-full">
              <svg className="w-full h-full" viewBox="0 0 200 40">
                <path
                  d="M 10 20 L 190 20"
                  fill="none"
                  stroke="var(--color-primary-purple)"
                  strokeOpacity="0.2"
                  strokeWidth="2"
                />
                <path
                  d="M 10 20 L 190 20"
                  fill="none"
                  stroke="var(--color-primary-purple)"
                  strokeWidth="2"
                  className="animate-dash"
                />
              </svg>
              {/* License flow indicator */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-primary-purple/10 border border-primary-purple/30 text-primary-purple px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                IP License
              </div>
            </div>

            {/* Buyer Node */}
            <div className="flex flex-col items-center gap-2 w-32">
              <div className="w-16 h-16 rounded-2xl bg-primary-purple/10 border border-primary-purple/30 flex items-center justify-center text-primary-purple shadow-[0_0_15px_rgba(235,16,0,0.05)]">
                <Shield className="w-8 h-8" />
              </div>
              <span className="font-display font-semibold text-slate-200 text-sm">Buyer</span>
              <span className="text-[10px] font-mono text-slate-500">0xE82d...9A3b</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-navy-900 border-y border-navy-850 py-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-navy-800">
            {stats.map((stat, i) => (
              <div key={i} className={`flex flex-col gap-1.5 ${i > 1 ? 'pt-6 lg:pt-0' : i > 0 ? 'pt-0 lg:pt-0' : ''}`}>
                <span className="text-3xl font-extrabold text-primary-purple font-display tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 flex flex-col items-center gap-3">
          <Badge type="purple">Workflow</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-150">How CopyrightFlow Works</h2>
          <p className="text-sm text-slate-400 max-w-xl">
            A three-step cryptographic flow ensuring creators get paid instantly and transparently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-navy-900 border border-navy-850 hover:border-navy-750 transition-all duration-300 rounded-xl p-8 flex flex-col relative overflow-hidden group"
              >
                {/* Large Faded Step Number */}
                <div className="absolute right-4 top-2 text-7xl font-display font-black text-navy-800/40 select-none group-hover:scale-105 transition-transform duration-300">
                  {step.num}
                </div>

                <div className="p-3 bg-primary-purple/10 border border-primary-purple/20 text-primary-purple rounded-xl w-fit mb-6">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold font-display text-slate-100 mb-3">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-24 bg-navy-900/40 border-y border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 flex flex-col items-center gap-3">
            <Badge type="amber">Capabilities</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-100">Engineered for Web3 Fintech</h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Complete support for automated licensing parameters, escrow splits, and instant safety clearing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-navy-900 border border-navy-850 hover:border-navy-750 hover:translate-y-[-2px] transition-all duration-300 rounded-xl p-6 flex flex-col"
                >
                  <div className={`p-2 bg-navy-950 border border-navy-800 rounded-lg w-fit mb-4 ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold font-display text-slate-100 mb-2">{feat.title}</h4>
                  <p className="text-xs text-slate-400 leading-normal">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who It Is For */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 flex flex-col items-center gap-3">
          <Badge type="purple">Target Audience</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-100">Designed for the Creative Economy</h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Whether you list original art or build marketplaces, we coordinate royalty transfers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audiences.map((aud, idx) => (
            <div
              key={idx}
              className="bg-navy-900 border border-navy-850 rounded-xl p-8 flex flex-col justify-between group hover:border-navy-750 transition-all duration-300"
            >
              <div>
                <h3 className="text-lg font-bold font-display text-slate-100 mb-3 group-hover:text-primary-purple-hover transition-colors">
                  For {aud.role}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 font-sans">{aud.desc}</p>
              </div>

              <ul className="flex flex-col gap-2.5">
                {aud.benefits.map((ben, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <div className="p-0.5 rounded-full bg-primary-purple/10 text-primary-purple">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>



      <Footer />
    </div>
  );
};
