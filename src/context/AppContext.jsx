import React, { createContext, useContext, useState, useEffect } from 'react';
import { assets as initialAssets } from '../data/assets';
import { auctions as initialAuctions } from '../data/auctions';
import { dashboardData as initialDashboard } from '../data/dashboard';

const AppContext = createContext();
const NAME = 'Pratik Swain';
const AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
const WALLET = '0x7F3a56241b1285C4D19485C92b9500000000C4D1';
const SHORT = '0x7F3a...C4D1';
const ETH = 2600;
const EMAIL = 'pratik.swain@copyrightflow.io';

// Helpers
const load = (k, fb) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; } catch { return fb; } };
const rid = () => Math.random().toString(36).substring(2, 8).toUpperCase();
const licId = (cat) => `${(cat || 'AS').slice(0, 2).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
const now = () => new Date().toISOString().split('T')[0];
const sw = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : SHORT;
const txh = () => `0x${Math.random().toString(16).substr(2, 4).toUpperCase()}...${Math.random().toString(16).substr(2, 4).toUpperCase()}`;
const toETH = (p) => parseFloat((p / ETH).toFixed(3));
const estTime = () => `${Math.floor(10 + Math.random() * 40)} mins`;

// Reusable object builders
const makeOwnedAsset = (id, name, cat, price, lic, status = "Active", fileName = null) => (
  { id, name, category: cat, dateAcquired: now(), purchasePrice: price, currentValue: price, licenseType: lic, status, fileName }
);
const makeLicense = (cat, name, lic, status = "Pending") => (
  { id: licId(cat), assetName: name, licenseType: lic, expiryDate: "Permanent", status }
);
const makeTransfer = (id, name, buyer, price, pos) => (
  { id: rid(), assetId: id, assetName: name, buyerWallet: buyer, price, queuePosition: pos, estTime: estTime(), status: "Queued" }
);
const requeue = (list, excludeId) => {
  const f = list.filter(t => t.id !== excludeId);
  return f.map((t, i) => ({ ...t, queuePosition: i + 1 }));
};

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const defWallet = { connected: false, address: null, provider: null, status: 'idle' };
  const [wallet, setWallet] = useState(() => load('wallet', defWallet));
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const loaded = load('user', null);
    if (loaded && loaded.name === 'Alex Johnson') {
      loaded.name = 'Pratik Swain';
      if (loaded.email === 'alex.johnson@copyrightflow.io') {
        loaded.email = 'pratik.swain@copyrightflow.io';
      }
    }
    return loaded;
  });
  const [assets, setAssets] = useState(() => {
    const cached = load('assets', null);
    if (!cached) return initialAssets;
    const newAssets = initialAssets.filter(ia => !cached.some(ca => ca.id === ia.id));
    return [...cached, ...newAssets];
  });
  const [auctions, setAuctions] = useState(initialAuctions);
  const [dashboard, setDashboard] = useState(() => {
    const loaded = load('dashboard', initialDashboard);
    if (loaded && loaded.user && loaded.user.name === 'Alex Johnson') {
      loaded.user.name = 'Pratik Swain';
    }
    return loaded;
  });
  const [toast, setToast] = useState({ visible: false, title: '', message: '', type: 'info' });

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('wallet', JSON.stringify(wallet)); }, [wallet]);
  useEffect(() => { user ? localStorage.setItem('user', JSON.stringify(user)) : localStorage.removeItem('user'); }, [user]);
  useEffect(() => { localStorage.setItem('assets', JSON.stringify(assets)); }, [assets]);
  useEffect(() => { localStorage.setItem('dashboard', JSON.stringify(dashboard)); }, [dashboard]);

  // Auto-deduplicate owned assets by name
  useEffect(() => {
    if (!dashboard?.myAssets) return;
    const seen = new Set(), unique = [];
    let dup = false;
    for (const a of dashboard.myAssets) { if (seen.has(a.name)) dup = true; else { seen.add(a.name); unique.push(a); } }
    if (dup) setDashboard(p => ({ ...p, myAssets: unique, stats: { ...p.stats, assetsOwned: unique.length } }));
  }, [dashboard.myAssets]);

  // Keep licenses in sync with owned assets
  useEffect(() => {
    if (!dashboard?.myAssets) return;
    const aNames = dashboard.myAssets.map(a => a.name);
    const lNames = (dashboard.myLicenses || []).map(l => l.assetName);
    if (aNames.length === lNames.length && aNames.every(n => lNames.includes(n))) return;
    const synced = dashboard.myAssets.map(a => {
      const ex = (dashboard.myLicenses || []).find(l => l.assetName === a.name);
      return ex ? { ...ex, licenseType: a.licenseType } : makeLicense(a.category, a.name, a.licenseType || "Commercial");
    });
    setDashboard(p => ({ ...p, myLicenses: synced }));
  }, [dashboard.myAssets]);

  // Toast
  const showToast = (title, msg = '', type = 'info') => setToast({ visible: true, title, message: msg, type });
  const hideToast = () => setToast(p => ({ ...p, visible: false }));

  // Fresh dashboard for new users
  const emptyDash = {
    user: { name: '', wallet: '', avatar: '' },
    stats: { assetsOwned: 0, totalRoyalties: 0, pendingTransfers: 0, activeBids: 0 },
    earningsHistory: ['Jan','Feb','Mar','Apr','May','Jun'].map(m => ({ month: m, earnings: 0, volume: 0 })),
    recentActivity: [], myAssets: [], myLicenses: [], pendingTransfers: []
  };
  const resetNew = (name, avatar, addr) => {
    setDashboard({ ...emptyDash, user: { name, wallet: sw(addr), avatar } });
    setAssets(initialAssets);
  };

  // Auth
  const loginUser = (email) => {
    const isNew = !user || user.email !== email;
    setUser({ email, name: NAME, avatar: AVATAR });
    setWallet({ connected: true, address: WALLET, provider: 'MetaMask', status: 'verified' });
    if (isNew) resetNew(NAME, AVATAR, WALLET);
  };

  // Wallet
  const connectWallet = (provider) => {
    setWallet({ connected: false, address: null, provider, status: 'connecting' });
    setTimeout(() => {
      const isNew = !user || user.email !== EMAIL;
      setWallet({ connected: true, address: WALLET, provider, status: 'verified' });
      setUser({ email: EMAIL, name: NAME, avatar: AVATAR });
      if (isNew) resetNew(NAME, AVATAR, WALLET);
      showToast("Wallet Connected", `Verified using ${provider}`, "success");
    }, 2000);
  };
  const disconnectWallet = () => { setWallet(defWallet); setUser(null); showToast("Wallet Disconnected", "Session closed", "info"); };

  // List a new asset
  const listAsset = (a) => {
    const id = assets.length + 1, price = parseFloat(a.startingPrice), addr = wallet.address || SHORT;
    const asset = {
      id, name: a.name, category: a.category,
      creator: { name: user?.name || NAME, wallet: addr, verified: true, avatar: user?.avatar || AVATAR },
      priceUSD: price, priceETH: toETH(price), licenseType: a.licenseType, tradeVolume: 0,
      status: a.listingType === 'Auction' ? 'Auction' : 'Available', description: a.description,
      royaltySplits: { creator: parseInt(a.royaltyPercentage), platform: 2.5, prevOwner: 0 },
      history: [{ date: now(), from: "0x0000...0000", to: addr, price, status: "success" }],
      fileName: a.fileName || null
    };
    setAssets(p => [asset, ...p]);
    if (a.listingType === 'Auction') {
      setAuctions(p => [{ id: auctions.length + 1, assetId: id, name: a.name, category: a.category, creator: user?.name || NAME, highestBid: price, bidCount: 0, endsAt: 86400, bids: [] }, ...p]);
    }
    setDashboard(p => ({
      ...p, stats: { ...p.stats, assetsOwned: p.stats.assetsOwned + 1 },
      myAssets: [makeOwnedAsset(id, a.name, a.category, price, a.licenseType, "Active", a.fileName), ...p.myAssets],
      myLicenses: [makeLicense(a.category, a.name, a.licenseType), ...p.myLicenses]
    }));
    showToast("Asset Listed", `'${a.name}' is now listed!`, "success");
  };

  // Place bid
  const placeBid = (auctionId, amount) => {
    let ok = false;
    setAuctions(p => p.map(a => {
      if (a.id === auctionId && amount > a.highestBid) {
        ok = true;
        return { ...a, highestBid: parseFloat(amount), bidCount: a.bidCount + 1,
          bids: [{ id: a.bids.length + 1, wallet: sw(wallet.address), amount: parseFloat(amount), timestamp: new Date().toISOString(), status: "success" }, ...a.bids] };
      }
      return a;
    }));
    if (ok) setDashboard(p => ({ ...p, stats: { ...p.stats, activeBids: p.stats.activeBids + 1 } }));
    return ok;
  };

  // Stop auction
  const stopAuction = (auctionId) => {
    const auc = auctions.find(a => a.id === auctionId);
    if (!auc) return;
    const bids = auc.bids.filter(b => b.status === 'success');
    if (!bids.length) { showToast("No Bids", "No valid bids to close.", "warning"); return; }
    const winner = bids[0].wallet, amt = bids[0].amount;

    setAuctions(p => p.map(a => a.id === auctionId ? { ...a, endsAt: 0, status: 'ended', winner, winningBid: amt } : a));
    const t = assets.find(a => a.id === auc.assetId);
    if (t) {
      setAssets(p => p.map(a => a.id === auc.assetId
        ? { ...a, status: "Sold", priceUSD: amt, priceETH: toETH(amt), history: [{ date: now(), from: a.creator.wallet, to: winner, price: amt, status: "success" }, ...a.history] } : a));
      if (winner === sw(wallet.address)) {
        setDashboard(p => ({
          ...p, stats: { ...p.stats, assetsOwned: p.stats.assetsOwned + 1 },
          myAssets: [makeOwnedAsset(t.id, t.name, t.category, amt, t.licenseType, "Pending Settlement"), ...p.myAssets],
          myLicenses: [makeLicense(t.category, t.name, t.licenseType, "Pending"), ...p.myLicenses],
          pendingTransfers: [...(p.pendingTransfers || []), { ...makeTransfer(t.id, auc.name, winner, amt, (p.pendingTransfers || []).length + 1), status: "Processing" }]
        }));
      }
    }
    showToast("Auction Ended", `"${auc.name}" sold to ${winner} for ₹${amt}!`, "success");
  };

  // Buy asset
  const buyAsset = (assetId) => {
    const t = assets.find(a => a.id == assetId || a.name === assetId);
    if (!t) return;
    if ((dashboard.myAssets || []).some(a => a.name === t.name)) { showToast("Already Owned", `You already own "${t.name}".`, "warning"); return; }
    const limited = ['Game Asset', 'Artwork'].includes(t.category);

    setAssets(p => p.map(a => (a.id == assetId || a.name === t.name)
      ? { ...a, status: limited ? "Sold" : "Available", history: [{ date: now(), from: a.creator.wallet, to: wallet.address || SHORT, price: a.priceUSD, status: "success" }, ...a.history] } : a));

    const pt = limited ? makeTransfer(t.id, t.name, sw(wallet.address), t.priceUSD, (dashboard.pendingTransfers || []).length + 1) : null;
    setDashboard(p => ({
      ...p, stats: { ...p.stats, assetsOwned: p.stats.assetsOwned + 1 },
      myAssets: [makeOwnedAsset(t.id, t.name, t.category, t.priceUSD, t.licenseType, limited ? "Pending Settlement" : "Active", t.fileName), ...p.myAssets],
      myLicenses: [makeLicense(t.category, t.name, t.licenseType, "Pending"), ...p.myLicenses],
      pendingTransfers: pt ? [...(p.pendingTransfers || []), pt] : (p.pendingTransfers || [])
    }));
    showToast(limited ? "Purchase Queued" : "Purchase Complete",
      limited ? `"${t.name}" pending settlement.` : `Purchased license for ${t.name}`, "success");
  };

  // Resell asset
  const resellAsset = (assetId, price) => {
    const t = assets.find(a => a.id == assetId || a.name === assetId);
    const d = dashboard.myAssets.find(a => a.id == assetId || a.name === assetId);
    const earned = Math.max(0, +(parseFloat(price) - (d?.purchasePrice ?? 0)).toFixed(2));
    const month = new Date().toLocaleString('default', { month: 'short' });

    setAssets(p => p.map(a => (a.id == assetId || a.name === t?.name) ? { ...a, priceUSD: +price, priceETH: toETH(price), status: "Available" } : a));
    setDashboard(p => ({
      ...p,
      stats: { ...p.stats, totalRoyalties: +(p.stats.totalRoyalties + earned).toFixed(2), assetsOwned: Math.max(0, p.myAssets.length - 1) },
      earningsHistory: (p.earningsHistory || []).map(e => e.month === month ? { ...e, earnings: +(e.earnings + earned).toFixed(2), volume: e.volume + 1 } : e),
      myAssets: p.myAssets.filter(a => a.id != assetId && a.name !== t?.name),
      recentActivity: [{ id: rid(), type: "royalty", description: `Resale profit for '${t?.name || "Asset"}'`, amount: earned, timestamp: "Just now", txHash: txh(), icon: "Coins" }, ...p.recentActivity]
    }));
    showToast("Asset Sold", `Sold for ₹${price}. Earned ₹${earned} profit!`, "success");
  };

  // Delist asset
  const delistAsset = (id) => {
    const t = assets.find(a => a.id == id || a.name === id);
    setAssets(p => p.map(a => (a.id == id || a.name === t?.name) ? { ...a, status: "Sold" } : a));
    setDashboard(p => ({ ...p, myAssets: p.myAssets.map(a => (a.id == id || a.name === t?.name) ? { ...a, status: "Active" } : a) }));
    showToast("Asset Delisted", "Listing cancelled.", "info");
  };

  // Verify license
  const verifyLicense = (id) => {
    setDashboard(p => ({ ...p, myLicenses: (p.myLicenses || []).map(l => l.id === id ? { ...l, status: "Verified" } : l) }));
    showToast("License Verified", `Certificate ${id} verified.`, "success");
  };

  // Cancel transfer
  const cancelTransfer = (id) => {
    const tr = (dashboard.pendingTransfers || []).find(t => t.id === id);
    if (tr) setAssets(p => p.map(a => (a.id === tr.assetId || a.name === tr.assetName) ? { ...a, status: "Available" } : a));
    setDashboard(p => {
      const q = requeue(p.pendingTransfers || [], id), n = tr?.assetName;
      return { ...p,
        stats: { ...p.stats, assetsOwned: n ? Math.max(0, p.stats.assetsOwned - 1) : p.stats.assetsOwned },
        myAssets: n ? p.myAssets.filter(a => !(a.name === n && a.status === 'Pending Settlement')) : p.myAssets,
        myLicenses: n ? p.myLicenses.filter(l => !(l.assetName === n && l.status === 'Pending')) : p.myLicenses,
        pendingTransfers: q };
    });
    showToast("Transfer Cancelled", "Purchase reversed.", "info");
  };

  // Complete transfer
  const completeTransfer = (id) => {
    const tr = (dashboard.pendingTransfers || []).find(t => t.id === id);
    if (!tr) return;
    setDashboard(p => ({
      ...p,
      myAssets: p.myAssets.map(a => (a.name === tr.assetName && a.status === 'Pending Settlement') ? { ...a, status: 'Active' } : a),
      myLicenses: p.myLicenses.map(l => (l.assetName === tr.assetName && l.status === 'Pending') ? { ...l, status: 'Verified' } : l),
      pendingTransfers: requeue(p.pendingTransfers || [], id)
    }));
    showToast("Settlement Complete", `"${tr.assetName}" ownership finalized.`, "success");
  };

  // Request payout
  const requestPayout = () => {
    const amt = dashboard.stats.totalRoyalties;
    if (amt <= 0) { showToast("No Earnings", "No royalty balance.", "warning"); return; }
    setDashboard(p => ({
      ...p, stats: { ...p.stats, totalRoyalties: 0 },
      recentActivity: [{ id: p.recentActivity.length + 1, type: "payout", description: `Payout of ₹${amt} processed`, amount: amt, timestamp: "Just now", txHash: txh(), icon: "ArrowUpRight" }, ...p.recentActivity]
    }));
    showToast("Payout Successful", `₹${amt} transferred to wallet.`, "success");
  };

  return (
    <AppContext.Provider value={{
      wallet, walletModalOpen, setWalletModalOpen, connectWallet, disconnectWallet,
      user, loginUser, assets, auctions, dashboard, toast, showToast, hideToast,
      listAsset, placeBid, stopAuction, buyAsset, resellAsset, delistAsset,
      verifyLicense, cancelTransfer, completeTransfer, requestPayout
    }}>
      {children}
    </AppContext.Provider>
  );
};
