import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useCountdown } from '../hooks/useCountdown';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { InputField } from '../components/ui/InputField';
import { Modal } from '../components/ui/Modal';
import {
  Gavel,
  Clock,
  TrendingUp,
  History,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  User,
  ShieldX,
  StopCircle,
  Trophy
} from 'lucide-react';

// Live timer helper component
const LiveTimer = ({ initialSeconds }) => {
  const { timeLeft, isEnded } = useCountdown(initialSeconds);
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-orange/10 border border-amber-orange/30 text-amber-orange font-mono text-sm font-semibold rounded-lg">
      <Clock className="w-4 h-4 animate-pulse" />
      <span>{isEnded ? "Ended" : timeLeft}</span>
    </div>
  );
};

export const AuctionHouse = () => {
  const { auctions, placeBid, stopAuction, wallet, setWalletModalOpen, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('live'); // live, upcoming
  const [selectedAuctionId, setSelectedAuctionId] = useState(1);
  const [bidModalOpen, setBidModalOpen] = useState(false);

  // Modal flow states
  const [bidStep, setBidStep] = useState(1); // 1: input & price safety, 2: license checker, 3: confirm
  const [bidAmount, setBidAmount] = useState('');
  
  // Simulation states
  const [safetyChecking, setSafetyChecking] = useState(false);
  const [safetyStatus, setSafetyStatus] = useState(null); // 'validated', 'flagged'
  const [licenseChecking, setLicenseChecking] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState(null); // 'verified', 'failed'


  const activeAuction = auctions.find(a => a.id === selectedAuctionId) || auctions[0];

  const handleOpenBidModal = (auctionId) => {
    setSelectedAuctionId(auctionId);
    setBidAmount('');
    setBidStep(1);
    setSafetyStatus(null);
    setLicenseStatus(null);
    setBidModalOpen(true);
  };

  // Run Price Safety Check (Step 1)
  const runSafetyCheck = () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) return;
    setSafetyChecking(true);
    setSafetyStatus(null);

    setTimeout(() => {
      setSafetyChecking(false);
      // Validate bid: must be greater than current highest bid and not excessively large (> 10x highest bid)
      const amount = parseFloat(bidAmount);
      if (amount > activeAuction.highestBid && amount < activeAuction.highestBid * 10) {
        setSafetyStatus('validated');
      } else {
        setSafetyStatus('flagged');
      }
    }, 1200);
  };

  // Run License Checker (Step 2)
  const runLicenseChecker = () => {
    setLicenseChecking(true);
    setLicenseStatus(null);

    setTimeout(() => {
      setLicenseChecking(false);
      if (wallet.connected) {
        setLicenseStatus('verified');
      } else {
        setLicenseStatus('failed');
      }
    }, 1200);
  };

  const handleNextToStep2 = () => {
    setBidStep(2);
    runLicenseChecker();
  };

  const handleConfirmBid = () => {
    const success = placeBid(activeAuction.id, parseFloat(bidAmount));
    if (success) {
      showToast("Bid Placed Successfully", `Your bid of ₹${bidAmount} is now active!`, "success");
      setBidModalOpen(false);
    } else {
      showToast("Bid Failed", "Check your wallet balance and try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-300 flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex-1 flex flex-col gap-6">
        
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-50 font-display flex items-center gap-2">
            <Gavel className="w-8 h-8 text-amber-orange" />
            <span>Auction House</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Bid on exclusive licensing agreements and acquire full digital rights.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-4 border-b border-navy-850">
          <button
            onClick={() => setActiveTab('live')}
            className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
              activeTab === 'live'
                ? 'text-slate-50 border-b-2 border-primary-purple'
                : 'text-slate-500 hover:text-slate-350'
            }`}
          >
            Live Auctions
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
              activeTab === 'upcoming'
                ? 'text-slate-50 border-b-2 border-primary-purple'
                : 'text-slate-500 hover:text-slate-350'
            }`}
          >
            Upcoming Auctions
          </button>
        </div>

        {activeTab === 'live' ? (
          /* Live Auctions Split Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Auction Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {auctions.map((auc) => {
                const isSelected = selectedAuctionId === auc.id;
                const isEnded = auc.status === 'ended';

                return (
                  <div
                    key={auc.id}
                    onClick={() => setSelectedAuctionId(auc.id)}
                    className={`bg-navy-900 border rounded-2xl p-5 flex flex-col gap-4 transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'border-primary-purple shadow-[0_0_20px_rgba(59,130,246,0.15)] bg-navy-900'
                        : 'border-navy-850 hover:border-navy-750'
                    } ${isEnded ? 'opacity-80' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {auc.category}
                      </span>
                      {isEnded ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-green/10 border border-teal-green/30 text-teal-green font-mono text-sm font-semibold rounded-lg">
                          <Trophy className="w-4 h-4" />
                          <span>Sold</span>
                        </div>
                      ) : (
                        <LiveTimer initialSeconds={auc.endsAt} />
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-base font-display text-slate-100 truncate group-hover:text-primary-purple">
                        {auc.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Listed by {auc.creator}</p>
                    </div>

                    {/* Price Splits */}
                    <div className="bg-navy-950/80 border border-navy-850 rounded-xl p-3 flex justify-between items-center text-xs">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] text-slate-500 font-semibold uppercase">
                          {isEnded ? 'Winning Bid' : 'Highest Bid'}
                        </span>
                        <span className="font-bold text-slate-200 text-sm font-mono">
                          ₹{isEnded ? auc.winningBid : auc.highestBid}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5 text-right">
                        {isEnded ? (
                          <>
                            <span className="text-[9px] text-slate-500 font-semibold uppercase">Winner</span>
                            <span className="font-semibold text-teal-green font-mono text-xs">{auc.winner}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-[9px] text-slate-500 font-semibold uppercase">Bids Count</span>
                            <span className="font-semibold text-slate-400 font-mono">{auc.bidCount} bids</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Mini Bids Preview */}
                    <div className="flex flex-col gap-1.5 border-t border-navy-850/60 pt-3">
                      <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Recent Bids</span>
                      <div className="flex flex-col gap-1">
                        {auc.bids.slice(0, 3).map((b, i) => (
                          <div key={i} className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                            <span>{b.wallet}</span>
                            <span className={b.status === 'failed' ? 'text-soft-red line-through' : 'text-teal-green font-semibold'}>
                              ₹{b.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isEnded ? (
                      <div className="bg-teal-green/10 border border-teal-green/20 rounded-xl p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-teal-green text-xs font-semibold">
                          <Trophy className="w-4 h-4" />
                          <span>Auction Completed</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Won by {auc.winner} for ₹{auc.winningBid}</p>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="primary"
                          size="medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenBidModal(auc.id);
                          }}
                          className="flex-1"
                        >
                          Place Bid
                        </Button>
                        <Button
                          variant="danger"
                          size="medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            stopAuction(auc.id);
                          }}
                          className="flex items-center gap-1.5 shrink-0"
                          disabled={auc.bids.filter(b => b.status === 'success').length === 0}
                        >
                          <StopCircle className="w-4 h-4" />
                          <span>Stop</span>
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column: Bid Queue Sidebar */}
            <aside className="lg:col-span-4 bg-navy-900 border border-navy-850 rounded-2xl p-5 flex flex-col gap-4">
              <div className="border-b border-navy-850 pb-3 flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-100 font-display flex items-center gap-1.5">
                  <History className="w-4 h-4 text-primary-purple" />
                  <span>Auction Queue</span>
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  {activeAuction ? activeAuction.name.split(' ')[0] : 'Bids'}
                </span>
              </div>

              {activeAuction && activeAuction.status === 'ended' && (
                <div className="bg-teal-green/10 border border-teal-green/30 rounded-xl p-3 flex items-center gap-2.5 text-xs text-teal-green">
                  <Trophy className="w-5 h-5 shrink-0" />
                  <div>
                    <div className="font-bold">Auction Won</div>
                    <p className="text-[10px] text-teal-green/80 mt-0.5">
                      {activeAuction.winner} secured this asset for ₹{activeAuction.winningBid}
                    </p>
                  </div>
                </div>
              )}

              {activeAuction && activeAuction.bids.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-slate-650" />
                  <span>No bids placed yet on this auction.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {activeAuction.bids.map((bid, index) => {
                    const isFailed = bid.status === 'failed';
                    const isWinner = activeAuction.status === 'ended' && index === 0 && !isFailed;
                    return (
                      <div
                        key={bid.id}
                        className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
                          isFailed
                            ? 'border-soft-red/20 bg-soft-red/5'
                            : isWinner
                            ? 'border-teal-green/40 bg-teal-green/10 ring-1 ring-teal-green/20'
                            : index === 0
                            ? 'border-teal-green/30 bg-teal-green/5'
                            : 'border-navy-850 bg-navy-950/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Position Circle */}
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                            isFailed
                              ? 'bg-soft-red/10 text-soft-red'
                              : isWinner
                              ? 'bg-teal-green/20 text-teal-green'
                              : index === 0
                              ? 'bg-teal-green/10 text-teal-green'
                              : 'bg-navy-800 text-slate-400'
                          }`}>
                            {isWinner ? <Trophy className="w-3.5 h-3.5" /> : index + 1}
                          </div>

                          <div className="flex flex-col">
                            <span className="text-xs font-mono font-semibold text-slate-300">{bid.wallet}</span>
                            <span className="text-[9px] text-slate-500">
                              {new Date(bid.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-xs font-bold font-mono ${
                            isFailed ? 'text-soft-red line-through' : 'text-slate-200'
                          }`}>
                            ₹{bid.amount}
                          </span>
                          
                          {isFailed ? (
                            <div className="flex items-center gap-1">
                              <Badge type="danger">Failed</Badge>
                              <span className="text-[8px] text-soft-red font-medium tracking-wide">Rollback</span>
                            </div>
                          ) : isWinner ? (
                            <Badge type="success">Winner</Badge>
                          ) : index === 0 ? (
                            <Badge type="teal">Leading</Badge>
                          ) : (
                            <Badge type="neutral">Outbid</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </aside>

          </div>
        ) : (
          /* Upcoming Auctions Tab Placeholder */
          <div className="bg-navy-900 border border-navy-850 rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-3">
            <Clock className="w-10 h-10 text-slate-650" />
            <h3 className="font-bold text-slate-300 font-display">No Upcoming Auctions</h3>
            <p className="text-xs text-slate-500 max-w-sm leading-normal">There are no upcoming scheduled bidding slots. New licenses are registered in the creator portal every Friday.</p>
          </div>
        )}

      </div>

      {/* Place Bid Multi-Step Modal */}
      <Modal
        isOpen={bidModalOpen}
        onClose={() => setBidModalOpen(false)}
        title={`Place Bid on ${activeAuction ? activeAuction.name : 'Asset'}`}
        size="sm"
      >
        {activeAuction && (
          <div className="flex flex-col gap-6">
            
            {/* Top Step indicator */}
            <div className="flex items-center justify-between border-b border-navy-850 pb-3">
              <span className="text-xs text-slate-500">Step {bidStep} of 3</span>
              <span className="text-xs font-semibold text-primary-purple font-display">
                {bidStep === 1 ? 'Price Safety Check' : bidStep === 2 ? 'License Verification' : 'Confirm Bidding'}
              </span>
            </div>

            {/* Step 1: Input Bid Amount & Safety check */}
            {bidStep === 1 && (
              <div className="flex flex-col gap-4">
                <div className="bg-navy-950 border border-navy-850 rounded-xl p-3 flex justify-between text-xs">
                  <span className="text-slate-500">Minimum Bid Required:</span>
                  <span className="font-bold text-amber-orange font-mono">₹{activeAuction.highestBid + 5}</span>
                </div>

                <div className="flex gap-2 items-end">
                  <InputField
                    label="Bid Amount (INR)"
                    type="number"
                    placeholder={`e.g. ₹${activeAuction.highestBid + 10}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    icon={TrendingUp}
                  />
                  <Button
                    variant="secondary"
                    size="medium"
                    onClick={runSafetyCheck}
                    disabled={safetyChecking || !bidAmount}
                    className="shrink-0 h-11"
                  >
                    Check
                  </Button>
                </div>

                {/* Safety check simulation reports */}
                {safetyChecking && (
                  <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400 bg-navy-950/40 rounded-xl border border-dashed border-navy-800">
                    <svg className="animate-spin h-4 w-4 text-primary-purple" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Analyzing price volatility risks...</span>
                  </div>
                )}

                {!safetyChecking && safetyStatus === 'validated' && (
                  <div className="bg-teal-green/10 border border-teal-green/30 text-teal-green p-3 rounded-xl flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-bold">Price Validated</div>
                      <p className="mt-0.5 leading-normal">Bid satisfies minimum step criteria and historical ranges. Safety clears are green.</p>
                    </div>
                  </div>
                )}

                {!safetyChecking && safetyStatus === 'flagged' && (
                  <div className="bg-amber-orange/10 border border-amber-orange/30 text-amber-orange p-3 rounded-xl flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-bold">Price Flagged</div>
                      <p className="mt-0.5 leading-normal">Bid amount must exceed current highest bid (₹{activeAuction.highestBid}) and satisfy standard ranges.</p>
                    </div>
                  </div>
                )}

                <Button
                  variant="primary"
                  className="w-full mt-2"
                  disabled={safetyStatus !== 'validated'}
                  onClick={handleNextToStep2}
                >
                  Next Step
                </Button>
              </div>
            )}

            {/* Step 2: License verification */}
            {bidStep === 2 && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-slate-400">Verifying wallet compliance checks and licensing authorizations.</p>
                
                {licenseChecking && (
                  <div className="flex items-center justify-center gap-2 py-6 text-xs text-slate-400 bg-navy-950/40 rounded-xl border border-dashed border-navy-800">
                    <svg className="animate-spin h-4 w-4 text-primary-purple" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Clearing license compliance records...</span>
                  </div>
                )}

                {!licenseChecking && licenseStatus === 'verified' && (
                  <div className="bg-teal-green/10 border border-teal-green/30 text-teal-green p-3 rounded-xl flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-bold">Wallet Verified</div>
                      <p className="mt-0.5 leading-normal">Wallet clearances are approved. Compliance locks unlocked successfully.</p>
                    </div>
                  </div>
                )}

                {!licenseChecking && licenseStatus === 'failed' && (
                  <div className="bg-soft-red/10 border border-soft-red/30 text-soft-red p-3 rounded-xl flex flex-col gap-2.5">
                    <div className="flex items-start gap-2.5">
                      <ShieldX className="w-5 h-5 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <div className="font-bold">Not Approved</div>
                        <p className="mt-0.5 leading-normal">No connected wallet detected. Please connect your Web3 wallet first.</p>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => setWalletModalOpen(true)}
                    >
                      Connect Wallet
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setBidStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    disabled={licenseStatus !== 'verified'}
                    onClick={() => setBidStep(3)}
                    className="flex-1"
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation summary */}
            {bidStep === 3 && (
              <div className="flex flex-col gap-4">
                <div className="bg-navy-950 border border-navy-850 rounded-xl p-4 flex flex-col gap-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Asset:</span>
                    <span className="text-slate-350">{activeAuction.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bidding Amount:</span>
                    <span className="text-slate-350">₹{bidAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Wallet:</span>
                    <span className="text-slate-350">{wallet.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : "0x7F3a...C4D1"}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setBidStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleConfirmBid}
                    className="flex-1"
                  >
                    Confirm Bid
                  </Button>
                </div>
              </div>
            )}

          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
};
