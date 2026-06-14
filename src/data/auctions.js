export const auctions = [
  {
    id: 1,
    assetId: 3, // Pixel Warrior Sprite Pack
    name: "Pixel Warrior Sprite Pack",
    category: "Game Asset",
    creator: "PixelCo",
    highestBid: 240,
    bidCount: 5,
    endsAt: 3600 * 3 + 120, // 3 hours, 2 minutes from now
    bids: [
      { id: 1, wallet: "0x7F3a...C4D1", amount: 240, timestamp: "2026-06-09T15:30:00Z", status: "success" },
      { id: 2, wallet: "0xE82d...9A3b", amount: 225, timestamp: "2026-06-09T15:15:00Z", status: "success" },
      { id: 3, wallet: "0x3A2b...7C4d", amount: 210, timestamp: "2026-06-09T15:00:00Z", status: "success" },
      { id: 4, wallet: "0x98Fb...32A1", amount: 250, timestamp: "2026-06-09T14:45:00Z", status: "failed" } // Failed/Rollback bid
    ]
  },
  {
    id: 2,
    assetId: 1, // Neon City Background Loop
    name: "Neon City Background Loop",
    category: "Game Asset",
    creator: "Alex Dev",
    highestBid: 120,
    bidCount: 4,
    endsAt: 3600 * 1.5 + 45, // 1 hour, 30 minutes from now
    bids: [
      { id: 1, wallet: "0x3A2b...7C4d", amount: 120, timestamp: "2026-06-09T15:40:00Z", status: "success" },
      { id: 2, wallet: "0x7F3a...C4D1", amount: 110, timestamp: "2026-06-09T15:20:00Z", status: "success" },
      { id: 3, wallet: "0x5d4A...B2e3", amount: 130, timestamp: "2026-06-09T15:10:00Z", status: "failed" }, // Failed/Rollback bid
      { id: 4, wallet: "0x8E1b...7A4f", amount: 95, timestamp: "2026-06-09T14:50:00Z", status: "success" }
    ]
  }
];
