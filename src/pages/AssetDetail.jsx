import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Tabs } from '../components/ui/Tabs';
import {
  ChevronRight,
  Music,
  Gamepad,
  Palette,
  Volume2,
  Type,
  User,
  ShieldCheck,
  Calendar,
  Layers,
  FileText,
  Clock
} from 'lucide-react';

export const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { assets, buyAsset, wallet } = useApp();

  const [activeTab, setActiveTab] = useState('overview');

  const asset = useMemo(() => {
    return assets.find(a => a.id === parseInt(id));
  }, [assets, id]);

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Map category to icon
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Music License': return Music;
      case 'Game Asset': return Gamepad;
      case 'Artwork': return Palette;
      case 'Sound Effect': return Volume2;
      case 'Font License': return Type;
      default: return Gamepad;
    }
  };

  // Similar assets (same category or general fallback, excluding current asset)
  const similarAssets = useMemo(() => {
    if (!asset) return [];
    let list = assets.filter(a => a.id !== asset.id);
    let matched = list.filter(a => a.category === asset.category);
    if (matched.length < 3) {
      // fill up with others
      const others = list.filter(a => a.category !== asset.category);
      matched = [...matched, ...others];
    }
    return matched.slice(0, 3);
  }, [assets, asset]);

  if (!asset) {
    return (
      <div className="min-h-screen bg-navy-950 text-slate-300 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-32">
          <h2 className="text-xl font-bold font-display text-slate-100">Asset Not Found</h2>
          <p className="text-xs text-slate-400">The digital asset you are looking for does not exist or has been removed.</p>
          <Link to="/marketplace">
            <Button variant="primary" size="medium">Back to Marketplace</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBuy = () => {
    buyAsset(asset.id);
  };

  const tabsConfig = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'license', label: 'License Details', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-300 flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex-1 flex flex-col gap-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link to="/marketplace" className="hover:text-slate-300 transition-colors">
            Marketplace
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-400">{asset.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary-purple font-semibold truncate max-w-[200px]">{asset.name}</span>
        </div>

        {/* 2-Column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Preview & Tabs */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Asset Preview */}
            <div className="aspect-video sm:aspect-[4/3] bg-navy-900 border border-navy-850 rounded-2xl flex items-center justify-center relative overflow-hidden group shadow-lg">
              {/* Animated backdrop glow */}
              <div className="absolute inset-0 bg-radial-gradient from-primary-purple/10 to-transparent pointer-events-none opacity-50" />
              
              {React.createElement(asset ? getCategoryIcon(asset.category) : Gamepad, { className: "w-48 h-48 text-navy-950 absolute opacity-30 pointer-events-none group-hover:scale-105 transition-transform duration-500" })}
              
              <div className="p-6 rounded-2xl bg-navy-950/80 border border-navy-800 flex flex-col items-center justify-center gap-4 text-center z-10 shadow-2xl">
                <div className="p-4 rounded-full bg-primary-purple/10 border border-primary-purple/20 text-primary-purple group-hover:scale-105 transition-all">
                  {React.createElement(asset ? getCategoryIcon(asset.category) : Gamepad, { className: "w-10 h-10" })}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 font-display">{asset.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">SECURE LICENSE WATERMARK APPLIED</p>
                </div>
              </div>
            </div>

            {/* Tabs details */}
            <div className="bg-navy-900 border border-navy-850 rounded-2xl p-6">
              <Tabs tabs={tabsConfig} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

              {activeTab === 'overview' ? (
                <div className="flex flex-col gap-4 text-sm leading-relaxed text-slate-400">
                  <p>{asset.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 border-t border-navy-850/60 pt-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Asset File</span>
                      <span className="text-xs font-semibold text-slate-350 truncate" title={asset.fileName || "Default Archive Pack"}>
                        {asset.fileName || "default_mock_package.zip"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Asset Format</span>
                      <span className="text-xs font-semibold text-slate-350">
                        {asset.fileName ? (asset.fileName.split('.').pop().toUpperCase() + ' File') : "ZIP Pack (wav, png, vector assets)"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Trade Volume</span>
                      <span className="text-xs font-semibold text-slate-350 font-mono">₹{asset.tradeVolume * 15} INR</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Listing Status</span>
                      <span className="text-xs font-semibold text-slate-350 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${asset.status === 'Available' ? 'bg-teal-green' : 'bg-primary-purple'}`} />
                        {asset.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Verification Date</span>
                      <span className="text-xs font-semibold text-slate-350 font-mono">June 2026</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 text-sm leading-relaxed text-slate-400">
                  <h4 className="font-bold text-sm text-slate-100 font-display uppercase tracking-wider">
                    {asset.licenseType} Agreement
                  </h4>
                  
                  {asset.licenseType === 'Commercial' && (
                    <p>Allows the buyer to use, modify, and distribute the digital item across public marketing materials, apps, and video game distributions. Sub-licensing or resale of the raw assets is strictly prohibited.</p>
                  )}
                  {asset.licenseType === 'Exclusive' && (
                    <p>Grants unique ownership of the asset files to a single buyer. Once purchased, the original creator loses resale rights, and the secondary market retains 100% compliance locks. Only one valid license exists.</p>
                  )}
                  {asset.licenseType === 'Non-Exclusive' && (
                    <p>Grants a perpetual, worldwide license to use the assets for personal and media integrations. The creator reserves the right to continue listing this license to multiple buyers.</p>
                  )}
                  {asset.licenseType === 'Personal Use' && (
                    <p>Allows personal, non-commercial applications. Perfect for students, hobbyists, or prototyping before commercial releases. Commercial distributions require upgrading licenses.</p>
                  )}

                  <div className="bg-navy-950 border border-navy-800 rounded-xl p-4 flex gap-3 items-start mt-4">
                    <ShieldCheck className="w-5 h-5 text-teal-green shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs text-slate-200">Cryptographically Enforced Rights</h5>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">This license is bound directly to your wallet address upon purchase confirmation. The digital asset contains an embedded tag verifying compliance checks.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Asset Details & Purchase */}
          <div className="lg:col-span-5 flex flex-col gap-6 sticky top-20">
            
            {/* Primary Details Panel */}
            <div className="bg-navy-900 border border-navy-850 rounded-2xl p-6 flex flex-col gap-6">
              
              {/* Title, Badges */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  <Badge type="teal">{asset.category}</Badge>
                  <Badge type="purple">{asset.licenseType} License</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 font-display leading-tight">
                  {asset.name}
                </h2>
              </div>

              {/* Creator row */}
              <div className="flex items-center justify-between border-y border-navy-850 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={asset.creator.avatar}
                    alt={asset.creator.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Creator</span>
                    <span className="text-sm font-semibold text-slate-100 flex items-center gap-1">
                      {asset.creator.name}
                      {asset.creator.verified && (
                        <span className="w-3.5 h-3.5 rounded-full bg-teal-green/10 border border-teal-green/30 text-teal-green flex items-center justify-center text-[8px] font-bold">
                          ✓
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Wallet Address</span>
                  <span className="text-xs font-mono text-slate-400">{asset.creator.wallet}</span>
                </div>
              </div>

              {/* Price Details */}
              <div className="flex justify-between items-baseline bg-navy-950 border border-navy-850/60 rounded-xl p-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">License Price</span>
                  <span className="text-3xl font-bold text-primary-purple font-display">₹{asset.priceUSD}</span>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Crypto equivalent</span>
                  <span className="text-sm text-slate-400 font-mono font-medium">{asset.priceETH} ETH</span>
                </div>
              </div>

              {/* Royalty Splits Breakdown */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400">
                  Royalty splits on resell
                </h4>
                <div className="flex flex-col gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">Original Creator</span>
                      <span className="font-semibold text-slate-200">{asset.royaltySplits.creator}%</span>
                    </div>
                    <ProgressBar percent={asset.royaltySplits.creator * 3.33} color="purple" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">Platform Fee</span>
                      <span className="font-semibold text-slate-200">{asset.royaltySplits.platform}%</span>
                    </div>
                    <ProgressBar percent={asset.royaltySplits.platform * 10} color="teal" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">Previous Owner</span>
                      <span className="font-semibold text-slate-200">{asset.royaltySplits.prevOwner}%</span>
                    </div>
                    <ProgressBar percent={asset.royaltySplits.prevOwner * 10} color="amber" />
                  </div>
                </div>
              </div>

              {/* Buy Button */}
              <div className="flex flex-col gap-2.5">
                <Button
                  variant={asset.status === 'Sold' ? 'secondary' : 'primary'}
                  size="large"
                  disabled={asset.status === 'Sold'}
                  onClick={handleBuy}
                  className="w-full"
                >
                  {asset.status === 'Sold' ? 'License Purchased' : 'Buy License Now'}
                </Button>
                <p className="text-[10px] text-slate-500 text-center leading-normal">
                  Platform fee of 2.5% applies to secondary transactions. Ownership is transferred instantly to wallet.
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Ownership History table */}
        <div className="bg-navy-900 border border-navy-850 rounded-2xl p-6 mt-6">
          <h3 className="font-bold text-base font-display text-slate-100 mb-6">
            Ownership and Licensing Logs
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-navy-850 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 pl-4">Date</th>
                  <th className="pb-3">Asset</th>
                  <th className="pb-3">From Wallet</th>
                  <th className="pb-3">To Wallet</th>
                  <th className="pb-3">Price Paid</th>
                  <th className="pb-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-850/60 text-xs font-mono text-slate-300">
                {asset.history.map((hist, idx) => (
                  <tr key={idx} className="hover:bg-navy-850/20 transition-colors">
                    <td className="py-4.5 pl-4 font-sans text-slate-450">{hist.date}</td>
                    <td className="py-4.5 font-sans font-semibold text-slate-200">{asset.name}</td>
                    <td className="py-4.5 text-slate-400">{hist.from}</td>
                    <td className="py-4.5 text-slate-400">{hist.to}</td>
                    <td className="py-4.5 font-bold text-slate-200">₹{hist.price}</td>
                    <td className="py-4.5 pr-4">
                      {hist.status === 'success' ? (
                        <Badge type="success">Settled</Badge>
                      ) : (
                        <div className="flex flex-col gap-0.5">
                          <Badge type="danger">Failed</Badge>
                          <span className="text-[9px] text-soft-red font-medium tracking-wide">Rollback Applied</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Similar Assets row */}
        <div className="flex flex-col gap-6 mt-12">
          <div className="border-b border-navy-850 pb-4 flex justify-between items-center">
            <h3 className="font-bold text-lg font-display text-slate-100">Similar Licensing Assets</h3>
            <Link to="/marketplace" className="text-xs text-primary-purple-hover hover:underline font-medium">Explore All</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarAssets.map((sim) => {
              const SimIcon = getCategoryIcon(sim.category);
              return (
                <div
                  key={sim.id}
                  onClick={() => navigate(`/assets/${sim.id}`)}
                  className="bg-navy-900 border border-navy-850 hover:border-navy-750 hover:translate-y-[-2px] transition-all duration-300 rounded-xl p-4 flex flex-col justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-navy-950 flex items-center justify-center shrink-0 border border-navy-850 text-slate-400 group-hover:text-primary-purple transition-all">
                      <SimIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-100 font-display group-hover:text-primary-purple-hover transition-colors truncate max-w-[150px]">
                        {sim.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">{sim.category}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-navy-850/60 pt-3 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-slate-500 uppercase font-semibold">License Price</span>
                      <span className="font-bold text-slate-200 font-display">₹{sim.priceUSD}</span>
                    </div>
                    <Badge type={sim.licenseType === 'Commercial' ? 'teal' : 'neutral'}>
                      {sim.licenseType}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};
