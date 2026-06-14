import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { InputField } from '../components/ui/InputField';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  X,
  Music,
  Gamepad,
  Palette,
  Volume2,
  Type,
  Check,
  DollarSign
} from 'lucide-react';

export const Marketplace = () => {
  const { assets, buyAsset, wallet, auctions } = useApp();
  const navigate = useNavigate();

  // Search & View States
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLicenses, setSelectedLicenses] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  // Find absolute maximum asset price for dynamic filtering
  const maxPriceInDb = useMemo(() => {
    if (!assets || assets.length === 0) return 500;
    return Math.max(...assets.map(a => a.priceUSD || 0), 500);
  }, [assets]);

  const [priceMax, setPriceMax] = useState(500);
  const [sortBy, setSortBy] = useState('volume-desc');

  // Sync priceMax default if it is at the initial default and db max exceeds it
  React.useEffect(() => {
    setPriceMax(maxPriceInDb);
  }, [maxPriceInDb]);

  // Collapsible Sidebar Sections
  const [collapseCategory, setCollapseCategory] = useState(false);
  const [collapsePrice, setCollapsePrice] = useState(false);
  const [collapseLicense, setCollapseLicense] = useState(false);
  const [collapseStatus, setCollapseStatus] = useState(false);

  const categories = ['Game Asset', 'Music License', 'Artwork', 'Sound Effect', 'Font License'];
  const licenses = ['Commercial', 'Non-Exclusive', 'Exclusive', 'Personal Use'];
  const statuses = ['Available', 'Auction', 'Sold'];

  // Map categories to icons
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
      case 'Music License': return 'bg-primary-purple/10 border-primary-purple/20 text-primary-purple';
      case 'Game Asset': return 'bg-navy-800 border-navy-700 text-slate-400';
      case 'Artwork': return 'bg-primary-purple/10 border-primary-purple/20 text-primary-purple';
      case 'Sound Effect': return 'bg-navy-800 border-navy-700 text-slate-400';
      case 'Font License': return 'bg-navy-800 border-navy-700 text-slate-400';
      default: return 'bg-navy-800 text-slate-400';
    }
  };

  // Toggle handlers
  const handleCategoryToggle = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleLicenseToggle = (lic) => {
    setSelectedLicenses(prev =>
      prev.includes(lic) ? prev.filter(l => l !== lic) : [...prev, lic]
    );
  };

  const handleStatusToggle = (stat) => {
    setSelectedStatuses(prev =>
      prev.includes(stat) ? prev.filter(s => s !== stat) : [...prev, stat]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedLicenses([]);
    setSelectedStatuses([]);
    setPriceMax(maxPriceInDb);
    setSearch('');
  };

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedLicenses.length > 0) count += selectedLicenses.length;
    if (selectedStatuses.length > 0) count += selectedStatuses.length;
    if (priceMax < maxPriceInDb) count += 1;
    if (search !== '') count += 1;
    return count;
  }, [selectedCategories, selectedLicenses, selectedStatuses, priceMax, maxPriceInDb, search]);


  // Filtered Assets list
  const filteredAssets = useMemo(() => {
    let list = [...assets];

    // Search filter
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.creator.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      list = list.filter(a => selectedCategories.includes(a.category));
    }

    // License filter
    if (selectedLicenses.length > 0) {
      list = list.filter(a => selectedLicenses.includes(a.licenseType));
    }

    // Status filter
    const getEffectiveStatus = (asset) => {
      const activeAuction = auctions?.find(auc => 
        (auc.assetId == asset.id || auc.name === asset.name) && 
        auc.status !== 'ended' && 
        auc.endsAt > 0
      );
      return activeAuction ? 'Auction' : asset.status;
    };

    if (selectedStatuses.length > 0) {
      list = list.filter(a => selectedStatuses.includes(getEffectiveStatus(a)));
    } else {
      list = list.filter(a => getEffectiveStatus(a) !== 'Auction');
    }

    // Price Max filter
    list = list.filter(a => a.priceUSD <= priceMax);

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceUSD - b.priceUSD;
      if (sortBy === 'price-desc') return b.priceUSD - a.priceUSD;
      if (sortBy === 'volume-desc') return b.tradeVolume - a.tradeVolume;
      return 0;
    });

    return list;
  }, [assets, search, selectedCategories, selectedLicenses, selectedStatuses, priceMax, sortBy, auctions]);

  const removeFilterTag = (type, value) => {
    if (type === 'category') setSelectedCategories(prev => prev.filter(v => v !== value));
    if (type === 'license') setSelectedLicenses(prev => prev.filter(v => v !== value));
    if (type === 'status') setSelectedStatuses(prev => prev.filter(v => v !== value));
    if (type === 'price') setPriceMax(maxPriceInDb);
    if (type === 'search') setSearch('');
  };

  const handleBuyNow = (e, asset) => {
    e.stopPropagation();
    if (asset.status === 'Sold') return;
    buyAsset(asset.id);
  };

  const handleCardClick = (assetId) => {
    navigate(`/assets/${assetId}`);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-300 flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex-1 flex flex-col gap-6">
        
        {/* Header and Search */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-50 font-display">Asset Marketplace</h1>
              <p className="text-xs text-slate-400 mt-1">Explore verified licensing agreements and secondary resell rights.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:max-w-md">
              <InputField
                placeholder="Search music, code sprite sheets, artwork..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={Search}
              />
              <Button
                variant="secondary"
                className="md:hidden flex items-center gap-1.5 shrink-0"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary-purple text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex gap-8 items-start relative">
          
          {/* Left Column: Filter Sidebar - Desktop */}
          <aside className="hidden md:flex flex-col w-[260px] bg-navy-900 border border-navy-850 rounded-xl p-5 shrink-0 sticky top-20 max-h-[80vh] overflow-y-auto gap-5">
            <div className="flex justify-between items-center pb-2 border-b border-navy-850">
              <h3 className="font-bold text-sm text-slate-100 font-display flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-primary-purple" />
                <span>Filters</span>
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-primary-purple-hover hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Collapsible */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => setCollapseCategory(!collapseCategory)}
                className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider text-left cursor-pointer"
              >
                <span>Category</span>
                {collapseCategory ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
              {!collapseCategory && (
                <div className="flex flex-col gap-2 pl-0.5">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-slate-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        className="rounded border-navy-700 bg-navy-950 text-primary-purple focus:ring-primary-purple/40 w-3.5 h-3.5 cursor-pointer accent-primary-purple"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Max Slider */}
            <div className="flex flex-col gap-2.5 border-t border-navy-850/60 pt-4">
              <button
                onClick={() => setCollapsePrice(!collapsePrice)}
                className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider text-left cursor-pointer"
              >
                <span>Max Price (INR)</span>
                {collapsePrice ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
              {!collapsePrice && (
                <div className="flex flex-col gap-2.5 pl-0.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-slate-500">₹0</span>
                    <span className="font-mono text-primary-purple font-semibold">₹{priceMax}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxPriceInDb}
                    step="10"
                    value={priceMax}
                    onChange={(e) => setPriceMax(parseInt(e.target.value))}
                    className="w-full h-1 bg-navy-850 rounded-lg appearance-none cursor-pointer accent-primary-purple"
                  />
                </div>
              )}
            </div>

            {/* License Type Collapsible */}
            <div className="flex flex-col gap-2.5 border-t border-navy-850/60 pt-4">
              <button
                onClick={() => setCollapseLicense(!collapseLicense)}
                className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider text-left cursor-pointer"
              >
                <span>License Type</span>
                {collapseLicense ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
              {!collapseLicense && (
                <div className="flex flex-col gap-2 pl-0.5">
                  {licenses.map(lic => (
                    <label key={lic} className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-slate-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLicenses.includes(lic)}
                        onChange={() => handleLicenseToggle(lic)}
                        className="rounded border-navy-700 bg-navy-950 text-primary-purple focus:ring-primary-purple/40 w-3.5 h-3.5 cursor-pointer accent-primary-purple"
                      />
                      <span>{lic}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Status Collapsible */}
            <div className="flex flex-col gap-2.5 border-t border-navy-850/60 pt-4">
              <button
                onClick={() => setCollapseStatus(!collapseStatus)}
                className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider text-left cursor-pointer"
              >
                <span>Status</span>
                {collapseStatus ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
              {!collapseStatus && (
                <div className="flex flex-col gap-2 pl-0.5">
                  {statuses.map(stat => (
                    <label key={stat} className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-slate-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(stat)}
                        onChange={() => handleStatusToggle(stat)}
                        className="rounded border-navy-700 bg-navy-950 text-primary-purple focus:ring-primary-purple/40 w-3.5 h-3.5 cursor-pointer accent-primary-purple"
                      />
                      <span>{stat}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={() => setPriceMax(priceMax)} variant="primary" size="medium" className="w-full mt-2">
              Apply Filters
            </Button>
          </aside>

          {/* Right Column: Assets Content */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Top control bar */}
            <div className="flex justify-between items-center bg-navy-900 border border-navy-850 rounded-xl px-4 py-3">
              <div className="text-xs text-slate-400 font-medium">
                Showing <span className="text-slate-100 font-bold">{filteredAssets.length}</span> results
              </div>

              <div className="flex items-center gap-4">
                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 hidden sm:inline">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-navy-950 border border-navy-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-primary-purple cursor-pointer"
                  >
                    <option value="volume-desc">Trade Volume</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>

                {/* View toggler */}
                <div className="flex items-center border border-navy-800 rounded-lg p-0.5 bg-navy-950">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-navy-800 text-primary-purple' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-navy-800 text-primary-purple' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filters display tags */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-slate-500 font-medium">Active tags:</span>
                {search && (
                  <span className="inline-flex items-center gap-1 bg-navy-900 border border-navy-800 rounded-full px-3 py-1 text-[11px] text-slate-300">
                    Search: "{search}"
                    <X className="w-3 h-3 text-slate-500 hover:text-slate-200 cursor-pointer" onClick={() => removeFilterTag('search')} />
                  </span>
                )}
                {selectedCategories.map(cat => (
                  <span key={cat} className="inline-flex items-center gap-1 bg-navy-900 border border-navy-800 rounded-full px-3 py-1 text-[11px] text-slate-300">
                    {cat}
                    <X className="w-3 h-3 text-slate-500 hover:text-slate-200 cursor-pointer" onClick={() => removeFilterTag('category', cat)} />
                  </span>
                ))}
                {selectedLicenses.map(lic => (
                  <span key={lic} className="inline-flex items-center gap-1 bg-navy-900 border border-navy-800 rounded-full px-3 py-1 text-[11px] text-slate-300">
                    {lic}
                    <X className="w-3 h-3 text-slate-500 hover:text-slate-200 cursor-pointer" onClick={() => removeFilterTag('license', lic)} />
                  </span>
                ))}
                {selectedStatuses.map(stat => (
                  <span key={stat} className="inline-flex items-center gap-1 bg-navy-900 border border-navy-800 rounded-full px-3 py-1 text-[11px] text-slate-300">
                    {stat}
                    <X className="w-3 h-3 text-slate-500 hover:text-slate-200 cursor-pointer" onClick={() => removeFilterTag('status', stat)} />
                  </span>
                ))}
                {priceMax < maxPriceInDb && (
                  <span className="inline-flex items-center gap-1 bg-navy-900 border border-navy-800 rounded-full px-3 py-1 text-[11px] text-slate-300">
                    Max: ₹{priceMax}
                    <X className="w-3 h-3 text-slate-500 hover:text-slate-200 cursor-pointer" onClick={() => removeFilterTag('price')} />
                  </span>
                )}
              </div>
            )}

            {/* Asset Cards Grid/List */}
            {filteredAssets.length === 0 ? (
              <div className="bg-navy-900 border border-navy-850 rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3">
                <Search className="w-8 h-8 text-slate-600" />
                <h3 className="font-bold text-slate-300 font-display">No Assets Found</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-normal">We couldn't find any assets matching your filters. Try resetting them or adjusting your search queries.</p>
                <Button variant="secondary" size="small" onClick={resetFilters} className="mt-2">
                  Clear Filters
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets.map((asset) => {
                  const CategoryIcon = getCategoryIcon(asset.category);
                  const catClass = getCategoryBg(asset.category);
                  
                  return (
                    <div
                      key={asset.id}
                      onClick={() => handleCardClick(asset.id)}
                      className="bg-navy-900 border border-navy-850 hover:border-navy-750 hover:translate-y-[-2px] transition-all duration-300 rounded-xl overflow-hidden flex flex-col group cursor-pointer"
                    >
                      {/* Thumbnail container */}
                      <div className="h-44 bg-navy-950 relative flex items-center justify-center overflow-hidden border-b border-navy-850">
                        {/* Faded Category Icon Background */}
                        <CategoryIcon className="w-32 h-32 text-navy-900 absolute opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                        
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${catClass}`}>
                            {asset.category}
                          </span>
                        </div>
                        
                        {/* Center Icon */}
                        <div className={`p-4 rounded-full bg-navy-900/80 border border-navy-800 text-slate-400 group-hover:text-primary-purple group-hover:scale-105 transition-all duration-300 z-10`}>
                          <CategoryIcon className="w-8 h-8" />
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-sm text-slate-100 font-display group-hover:text-primary-purple-hover transition-colors truncate mb-1">
                            {asset.name}
                          </h3>

                          {/* Creator Row */}
                          <div className="flex items-center gap-2 mb-3">
                            <img
                              src={asset.creator.avatar}
                              alt={asset.creator.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1 truncate">
                              {asset.creator.name}
                              {asset.creator.verified && (
                                <span className="w-3.5 h-3.5 rounded-full bg-teal-green/10 border border-teal-green/30 text-teal-green flex items-center justify-center text-[8px] font-extrabold shrink-0">
                                  ✓
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between items-center gap-2 mb-3">
                            <Badge type={asset.licenseType === 'Exclusive' ? 'purple' : asset.licenseType === 'Commercial' ? 'teal' : 'neutral'}>
                              {asset.licenseType}
                            </Badge>
                            <span className="text-[10px] font-mono text-slate-500">Vol: {asset.tradeVolume}%</span>
                          </div>

                          {/* Trade Volume slider */}
                          <ProgressBar percent={asset.tradeVolume} color={asset.tradeVolume > 75 ? 'purple' : 'teal'} className="mb-4" />
                        </div>

                        <div>
                          <hr className="border-navy-850 mb-3" />

                          {/* Price Row */}
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">License Price</span>
                              <span className="text-base font-bold text-slate-50 font-display">₹{asset.priceUSD}</span>
                            </div>
                            <div className="text-right flex flex-col">
                              <span className="text-[10px] text-slate-500 uppercase font-semibold">Crypto equivalent</span>
                              <span className="text-xs text-slate-400 font-mono">{asset.priceETH} ETH</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="ghost"
                              size="small"
                              onClick={() => handleCardClick(asset.id)}
                              className="w-full text-slate-300 hover:text-white"
                            >
                              View Details
                            </Button>
                            <Button
                              variant={asset.status === 'Sold' ? 'secondary' : 'primary'}
                              size="small"
                              disabled={asset.status === 'Sold'}
                              onClick={(e) => handleBuyNow(e, asset)}
                              className="w-full"
                            >
                              {asset.status === 'Sold' ? 'Sold' : 'Buy Now'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // List View Mode
              <div className="flex flex-col gap-4">
                {filteredAssets.map((asset) => {
                  const CategoryIcon = getCategoryIcon(asset.category);
                  const catClass = getCategoryBg(asset.category);
                  
                  return (
                    <div
                      key={asset.id}
                      onClick={() => handleCardClick(asset.id)}
                      className="bg-navy-900 border border-navy-850 hover:border-navy-750 transition-all duration-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-navy-950 flex items-center justify-center shrink-0 border border-navy-850">
                          <CategoryIcon className="w-6 h-6 text-slate-400 group-hover:text-primary-purple transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-slate-100 font-display group-hover:text-primary-purple-hover transition-colors truncate mb-1">
                            {asset.name}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${catClass}`}>
                              {asset.category}
                            </span>
                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                              By {asset.creator.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-8 justify-between">
                        <div className="flex flex-col gap-1 w-24">
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">License</span>
                          <Badge type={asset.licenseType === 'Exclusive' ? 'purple' : 'neutral'}>
                            {asset.licenseType}
                          </Badge>
                        </div>

                        <div className="flex flex-col gap-0.5 w-24">
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">Volume</span>
                          <span className="text-xs font-mono text-slate-350">{asset.tradeVolume}%</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">Price</span>
                          <span className="text-sm font-bold text-slate-50 font-display">₹{asset.priceUSD}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant={asset.status === 'Sold' ? 'secondary' : 'primary'}
                            size="small"
                            disabled={asset.status === 'Sold'}
                            onClick={(e) => handleBuyNow(e, asset)}
                          >
                            {asset.status === 'Sold' ? 'Sold' : 'Buy Now'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide-in Mobile Drawer Filter Panel */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Drawer container */}
          <div className="relative w-full max-w-xs bg-navy-900 border-l border-navy-850 p-6 flex flex-col justify-between overflow-y-auto ml-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-navy-850 mb-4">
                <h3 className="font-bold text-sm text-slate-100 font-display flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-primary-purple" />
                  <span>Filters ({activeFiltersCount})</span>
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-slate-400 hover:text-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category checkmarks */}
              <div className="flex flex-col gap-3 mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category</h4>
                <div className="flex flex-col gap-2 pl-0.5">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-2.5 text-xs text-slate-350 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        className="rounded border-navy-700 bg-navy-950 text-primary-purple w-3.5 h-3.5"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="flex flex-col gap-3 mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Price Limit</h4>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-500">₹0</span>
                  <span className="font-mono text-primary-purple font-semibold">₹{priceMax}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPriceInDb}
                  step="10"
                  value={priceMax}
                  onChange={(e) => setPriceMax(parseInt(e.target.value))}
                  className="w-full h-1 bg-navy-850 rounded-lg appearance-none cursor-pointer accent-primary-purple"
                />
              </div>

              {/* Mobile License */}
              <div className="flex flex-col gap-3 mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">License</h4>
                <div className="flex flex-col gap-2 pl-0.5">
                  {licenses.map(lic => (
                    <label key={lic} className="flex items-center gap-2.5 text-xs text-slate-350 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLicenses.includes(lic)}
                        onChange={() => handleLicenseToggle(lic)}
                        className="rounded border-navy-700 bg-navy-950 text-primary-purple w-3.5 h-3.5"
                      />
                      <span>{lic}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Status */}
              <div className="flex flex-col gap-3 mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status</h4>
                <div className="flex flex-col gap-2 pl-0.5">
                  {statuses.map(stat => (
                    <label key={stat} className="flex items-center gap-2.5 text-xs text-slate-350 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(stat)}
                        onChange={() => handleStatusToggle(stat)}
                        className="rounded border-navy-700 bg-navy-950 text-primary-purple w-3.5 h-3.5"
                      />
                      <span>{stat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-navy-850 pt-4">
              <Button
                variant="primary"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full"
              >
                Apply Filters
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  resetFilters();
                  setMobileFiltersOpen(false);
                }}
                className="w-full border border-navy-850 text-slate-400"
              >
                Reset All
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
