export const dashboardData = {
  user: {
    name: "Pratik Swain",
    wallet: "0x7F3a...C4D1",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"
  },
  stats: {
    assetsOwned: 12,
    totalRoyalties: 2840,
    pendingTransfers: 3,
    activeBids: 2
  },
  // 6 months of royalty earnings chart data
  earningsHistory: [
    { month: "Jan", earnings: 320, volume: 1200 },
    { month: "Feb", earnings: 450, volume: 1800 },
    { month: "Mar", earnings: 510, volume: 1950 },
    { month: "Apr", earnings: 420, volume: 1600 },
    { month: "May", earnings: 560, volume: 2200 },
    { month: "Jun", earnings: 580, volume: 2400 }
  ],
  // 5 recent activity entries
  recentActivity: [
    {
      id: 1,
      type: "sale", // sale, royalty, bid, transfer
      description: "Royalty payment received for 'Neon City Background Loop' resale",
      amount: 18.00,
      timestamp: "2 hours ago",
      txHash: "0x3f9a...8b2c",
      icon: "Coins"
    },
    {
      id: 2,
      type: "bid",
      description: "Placed bid on 'Pixel Warrior Sprite Pack'",
      amount: 240.00,
      timestamp: "5 hours ago",
      txHash: "0x7a2c...9e1d",
      icon: "Gavel"
    },
    {
      id: 3,
      type: "royalty",
      description: "Royalty payment received for 'Ambient Drift Vol 3' secondary sale",
      amount: 10.20,
      timestamp: "1 day ago",
      txHash: "0x9d4e...2f8a",
      icon: "Coins"
    },
    {
      id: 4,
      type: "transfer",
      description: "Ownership of 'Urban Skyline 4K Pack' transferred successfully",
      amount: 350.00,
      timestamp: "3 days ago",
      txHash: "0x1b4f...6d9c",
      icon: "Send"
    },
    {
      id: 5,
      type: "purchase",
      description: "Purchased license for 'Deep Bass Loops Bundle'",
      amount: 60.00,
      timestamp: "1 week ago",
      txHash: "0x5e8c...1a2b",
      icon: "ShoppingCart"
    }
  ],
  myAssets: [
    { id: 1, name: "Neon City Background Loop", category: "Game Asset", dateAcquired: "2026-05-10", purchasePrice: 90, currentValue: 120, licenseType: "Commercial", status: "Active" },
    { id: 2, name: "Ambient Drift Vol 3", category: "Music License", dateAcquired: "2026-06-01", purchasePrice: 85, currentValue: 95, licenseType: "Non-Exclusive", status: "Active" },
    { id: 4, name: "Urban Skyline 4K Pack", category: "Artwork", dateAcquired: "2026-04-18", purchasePrice: 350, currentValue: 380, licenseType: "Commercial", status: "Active" },
    { id: 5, name: "Deep Bass Loops Bundle", category: "Sound Effect", dateAcquired: "2026-06-03", purchasePrice: 60, currentValue: 65, licenseType: "Personal Use", status: "Active" },
    { id: 6, name: "Retro UI Kit v2", category: "Font License", dateAcquired: "2026-06-05", purchasePrice: 45, currentValue: 50, licenseType: "Commercial", status: "Active" }
  ],
  myLicenses: [
    { id: "NC8827", assetName: "Neon City Background Loop", licenseType: "Commercial", expiryDate: "Permanent", status: "Verified" },
    { id: "AD3310", assetName: "Ambient Drift Vol 3", licenseType: "Non-Exclusive", expiryDate: "Permanent", status: "Verified" },
    { id: "US9912", assetName: "Urban Skyline 4K Pack", licenseType: "Commercial", expiryDate: "2027-06-09", status: "Verified" },
    { id: "DB5541", assetName: "Deep Bass Loops Bundle", licenseType: "Personal Use", expiryDate: "Permanent", status: "Pending" },
    { id: "RU4492", assetName: "Retro UI Kit v2", licenseType: "Commercial", expiryDate: "Permanent", status: "Verified" }
  ],
  pendingTransfers: [
    { id: 1, assetId: 1, assetName: "Neon City Background Loop", buyerWallet: "0xE82d...9A3b", price: 120, queuePosition: 1, estTime: "12 mins", status: "Queued" },
    { id: 2, assetId: 3, assetName: "Pixel Warrior Sprite Pack", buyerWallet: "0x5F2a...9D1c", price: 240, queuePosition: 3, estTime: "45 mins", status: "Processing" },
    { id: 3, assetId: 6, assetName: "Retro UI Kit v2", buyerWallet: "0x2E4b...9C1d", price: 45, queuePosition: 2, estTime: "28 mins", status: "Queued" }
  ]
};
