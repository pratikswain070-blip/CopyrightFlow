import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { InputField } from '../components/ui/InputField';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  Upload,
  Music,
  Gamepad,
  Palette,
  Volume2,
  Type,
  FileText,
  IndianRupee,
  Gavel,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ArrowRight
} from 'lucide-react';

export const CreatorPortal = () => {
  const { listAsset, wallet, setWalletModalOpen, showToast } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form States
  const [formData, setFormData] = useState({
    name: 'Neon Horizon Loops',
    category: 'Game Asset',
    description: 'A modular, high-tempo synthwave soundtrack pack designed for fast-paced cyberpunk racers.',
    licenseType: 'Commercial',
    licenseRules: 'Permits embedding in commercial gaming titles and videos. Re-distribution of raw audio files is forbidden.',
    royaltyPercentage: 15,
    startingPrice: 120,
    listingType: 'Fixed Price', // Fixed Price, Auction
    minimumBid: 130
  });

  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Categories list
  const categories = ['Game Asset', 'Music License', 'Artwork', 'Sound Effect', 'Font License'];

  // License types metadata
  const licenseTypes = [
    { type: 'Commercial', desc: 'Allows usage in commercial games, trailers, and applications.' },
    { type: 'Exclusive', desc: 'Grants single-buyer ownership. Original creator loses selling rights.' },
    { type: 'Non-Exclusive', desc: 'Permits personal usage. Original creator retains selling rights.' },
    { type: 'Personal Use', desc: 'Perfect for educational or non-profit student projects.' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
      showToast("File Ready", `Successfully loaded ${e.dataTransfer.files[0].name}`, "success");
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      showToast("File Ready", `Successfully loaded ${e.target.files[0].name}`, "success");
    }
  };

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

  const getCategoryBg = (cat) => {
    switch (cat) {
      case 'Music License': return 'bg-purple-900/20 border-purple-800/30 text-purple-400';
      case 'Game Asset': return 'bg-teal-900/20 border-teal-800/30 text-teal-400';
      case 'Artwork': return 'bg-amber-900/20 border-amber-800/30 text-amber-400';
      case 'Sound Effect': return 'bg-red-900/20 border-red-800/30 text-red-400';
      case 'Font License': return 'bg-blue-900/20 border-blue-800/30 text-blue-400';
      default: return 'bg-navy-800 text-slate-400';
    }
  };

  const catClass = getCategoryBg(formData.category);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!wallet.connected) {
      showToast("Verification Required", "Please connect your wallet to list assets.", "warning");
      setWalletModalOpen(true);
      return;
    }
    if (!formData.name) {
      showToast("Incomplete Form", "Please specify an asset name.", "warning");
      return;
    }
    
    listAsset({ ...formData, fileName });
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-300 flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex-1 flex flex-col gap-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-50 font-display">Creator Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Register new digital licenses and configure secondary royalty distributions.</p>
        </div>

        {/* Form Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Register Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 bg-navy-900 border border-navy-850 rounded-2xl p-6 flex flex-col gap-6">
            
            {/* Form Section: Asset Details */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-400">1. Asset Registry</h3>
              
              <InputField
                label="Asset Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Neon City Background Loop"
                required
              />

              {/* Custom Drag & Drop File Upload */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upload File</label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center transition-all cursor-pointer ${
                    dragActive
                      ? 'border-primary-purple bg-primary-purple/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                      : fileName
                      ? 'border-teal-green bg-teal-green/5'
                      : 'border-navy-800 hover:border-navy-700 bg-navy-950/40'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className={`p-3 rounded-full ${fileName ? 'bg-teal-green/10 text-teal-green' : 'bg-primary-purple/10 text-primary-purple'}`}>
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-200">
                      {fileName ? fileName : 'Drag and drop your file here'}
                    </h5>
                    <p className="text-xs text-slate-500 mt-1">Supports ZIP, MP3, WAV, PNG, OTF (Max 50MB)</p>
                  </div>
                </div>
              </div>

              {/* Category selector */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-navy-950 border border-navy-800 focus:border-primary-purple text-slate-200 text-sm rounded-lg p-2.5 outline-none transition-colors cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-navy-950 border border-navy-800 focus:border-primary-purple text-slate-200 text-sm rounded-lg p-3 outline-none transition-colors"
                  placeholder="Describe the asset content, utility, and target scopes..."
                />
              </div>
            </div>

            {/* Form Section: Licensing Parameters */}
            <div className="flex flex-col gap-4 border-t border-navy-850 pt-6">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-400">2. License Framework</h3>
              
              {/* Radio grid list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {licenseTypes.map((lic) => {
                  const isSelected = formData.licenseType === lic.type;
                  return (
                    <div
                      key={lic.type}
                      onClick={() => setFormData(prev => ({ ...prev, licenseType: lic.type }))}
                      className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col gap-1.5 ${
                        isSelected
                          ? 'border-primary-purple bg-primary-purple/5 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                          : 'border-navy-800 hover:border-navy-750 bg-navy-950/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold font-display text-slate-100">{lic.type}</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-primary-purple' : 'border-slate-600'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary-purple" />}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal">{lic.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-1.5 w-full mt-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">License Rules</label>
                <textarea
                  name="licenseRules"
                  value={formData.licenseRules}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-navy-950 border border-navy-800 focus:border-primary-purple text-slate-200 text-sm rounded-lg p-3 outline-none transition-colors"
                  placeholder="e.g. Permitted for distribution on WebGL platforms. No raw distribution allowed."
                />
              </div>
            </div>

            {/* Form Section: Royalty splits & pricing */}
            <div className="flex flex-col gap-4 border-t border-navy-850 pt-6">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-400">3. Distribution & Pricing</h3>
              
              {/* Royalty Slider */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-400 uppercase tracking-wider">Secondary Royalty percentage</label>
                  <span className="bg-primary-purple text-white px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
                    {formData.royaltyPercentage}% Creator Share
                  </span>
                </div>
                <div className="relative pt-4 pb-2">
                  <input
                    type="range"
                    name="royaltyPercentage"
                    min="0"
                    max="30"
                    step="1"
                    value={formData.royaltyPercentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, royaltyPercentage: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-primary-purple"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2.5">
                    <span>0% (Standard)</span>
                    <span>15%</span>
                    <span>30% (Max)</span>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Starting Price (INR)"
                  name="startingPrice"
                  type="number"
                  value={formData.startingPrice}
                  onChange={handleInputChange}
                  icon={IndianRupee}
                  required
                />

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Listing Type</label>
                  <div className="flex bg-navy-950 border border-navy-800 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, listingType: 'Fixed Price' }))}
                      className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        formData.listingType === 'Fixed Price'
                          ? 'bg-navy-900 text-slate-100 shadow'
                          : 'text-slate-500 hover:text-slate-350'
                      }`}
                    >
                      Fixed Price
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, listingType: 'Auction' }))}
                      className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        formData.listingType === 'Auction'
                          ? 'bg-navy-900 text-slate-100 shadow'
                          : 'text-slate-500 hover:text-slate-350'
                      }`}
                    >
                      Auction
                    </button>
                  </div>
                </div>
              </div>

              {/* Conditional Minimum Bid for Auction */}
              {formData.listingType === 'Auction' && (
                <div className="animate-fadeIn">
                  <InputField
                    label="Minimum Bid Increment (INR)"
                    name="minimumBid"
                    type="number"
                    value={formData.minimumBid}
                    onChange={handleInputChange}
                    icon={Gavel}
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="w-full mt-4"
            >
              List Asset on CopyrightFlow
            </Button>
          </form>

          {/* Right Column: Sticky Live Preview */}
          <aside className="lg:col-span-4 sticky top-20 flex flex-col gap-4">
            <div className="flex justify-between items-center text-xs text-slate-500 uppercase tracking-wider font-semibold pl-1">
              <span>Live Card Preview</span>
              <Badge type="purple">Preview Mode</Badge>
            </div>

            {/* Asset Card Preview mirroring the Marketplace */}
            <div className="bg-navy-900 border border-navy-850 rounded-xl overflow-hidden flex flex-col relative shadow-xl">
              
              {/* Thumbnail Container */}
              <div className="h-44 bg-navy-950 relative flex items-center justify-center overflow-hidden border-b border-navy-850">
                {React.createElement(getCategoryIcon(formData.category), { className: "w-24 h-24 text-navy-900 absolute opacity-20 pointer-events-none" })}
                
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${catClass}`}>
                    {formData.category}
                  </span>
                </div>
                
                <div className="p-3.5 rounded-full bg-navy-900/80 border border-navy-800 text-slate-400 z-10">
                  {React.createElement(getCategoryIcon(formData.category), { className: "w-6 h-6" })}
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-100 font-display truncate mb-1">
                    {formData.name || 'Untitled Asset'}
                  </h3>

                  {/* Creator */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-[10px] text-slate-500">
                      👤
                    </div>
                    <span className="text-xs text-slate-400 font-medium truncate">
                      {wallet.connected ? 'My Connected Wallet' : 'Anonymous Creator'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center gap-2 mb-3">
                    <Badge type={formData.licenseType === 'Exclusive' ? 'purple' : 'neutral'}>
                      {formData.licenseType}
                    </Badge>
                    <span className="text-[10px] font-mono text-slate-500">Vol: 0%</span>
                  </div>

                  <ProgressBar percent={0} color="purple" className="mb-4" />
                </div>

                <div>
                  <hr className="border-navy-850 mb-3" />

                  {/* Price Row */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        {formData.listingType === 'Auction' ? 'Minimum Bid' : 'Starting Price'}
                      </span>
                      <span className="text-base font-bold text-slate-50 font-display">
                        ₹{formData.startingPrice || 0}
                      </span>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Royalty split</span>
                      <span className="text-xs text-primary-purple font-semibold font-mono">
                        {formData.royaltyPercentage}% Secondary
                      </span>
                    </div>
                  </div>

                  {/* Dummy Actions */}
                  <div className="grid grid-cols-2 gap-2 opacity-50 pointer-events-none">
                    <Button variant="ghost" size="small" className="w-full">
                      Details
                    </Button>
                    <Button variant="primary" size="small" className="w-full">
                      {formData.listingType === 'Auction' ? 'Bid' : 'Buy Now'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hint Notice */}
            <div className="bg-navy-900 border border-navy-850/60 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-slate-500">
              <AlertTriangle className="w-5 h-5 text-amber-orange shrink-0 mt-0.5" />
              <p>Pre-computation fees apply upon listing confirmation. Submitting transfers requires standard wallet approval confirmations.</p>
            </div>
          </aside>

        </div>
      </div>

      <Footer />
    </div>
  );
};
