import React, { useState, useMemo } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Badge } from '../components/ui/Badge';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Wallet,
  ShoppingCart,
  UploadCloud,
  Coins,
  FileText,
  Activity,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  const guides = [
    { title: 'Connecting Your Wallet', desc: 'Step-by-step setup guides for MetaMask, Coinbase, and WalletConnect extensions.', icon: Wallet },
    { title: 'Buying Your First Asset', desc: 'Understanding licensing terms, checkout flows, and key registrations.', icon: ShoppingCart },
    { title: 'Listing an Asset', desc: 'Upload file structures, descriptions, and custom royalty split configurations.', icon: UploadCloud },
    { title: 'Understanding Royalties', desc: 'Deep dive into automatic secondary payouts and smart agreements.', icon: Coins }
  ];

  const faqCategories = [
    {
      name: 'Buying and Selling',
      faqs: [
        { id: 'bs1', q: 'How are licenses delivered to my account?', a: 'Once a purchase transaction clears, the digital rights license is immediately generated and tied to your Web3 wallet address. You can download the files from your Dashboard under My Assets.' },
        { id: 'bs2', q: 'What payment methods do you support?', a: 'We support standard Ethereum payments (ETH) as well as credit card / fiat payments processed via Stripe with automatic conversion on-chain.' },
        { id: 'bs3', q: 'Can I sell a license I bought?', a: 'Yes! All commercial and exclusive licenses listed on copyrightFlow can be resold. When you list a purchased license, the system automatically handles transfer splits.' }
      ]
    },
    {
      name: 'Licenses',
      faqs: [
        { id: 'l1', q: 'What is the difference between Commercial and Exclusive licenses?', a: 'Commercial licenses allow you to use the asset across multiple projects. Exclusive licenses grant full ownership of the item to a single buyer. Once sold, the asset is locked from future distributions.' },
        { id: 'l2', q: 'Do licenses expire?', a: 'Most licenses on copyrightFlow are perpetual (permanent). However, specific content models might include defined renewal terms, which are clearly shown in the License Details tab.' },
        { id: 'l3', q: 'Can I refund my license purchase?', a: 'Due to the cryptographically enforced nature of digital asset keys, transactions cannot be reversed once cleared. Please review the live previews before buying.' }
      ]
    },
    {
      name: 'Royalties',
      faqs: [
        { id: 'r1', q: 'How are secondary sale royalties distributed?', a: 'When a buyer resells a license on the secondary marketplace, the protocol automatically routes a configured percentage (e.g. 15%) directly to the original creator wallet.' },
        { id: 'r2', q: 'What is the maximum royalty split percentage?', a: 'Creators can configure secondary royalties from 0% up to a maximum of 30% of the resell value.' },
        { id: 'r3', q: 'Are platform fees subtracted from my royalties?', a: 'No. The standard platform fee of 2.5% is charged on top of transactions and is paid by the purchaser.' }
      ]
    },
    {
      name: 'Technical',
      faqs: [
        { id: 't1', q: 'What happens if a transaction fails mid-transfer?', a: 'CopyrightFlow features a rollback safety protocol. If a network transfer fails or times out, ownership states are auto-reversed and returned to the seller.' },
        { id: 't2', q: 'How do I download the API SDK?', a: 'You can download the full SDK package from our developer docs, allowing you to integrate royalty split checks on external games or marketplaces.' },
        { id: 't3', q: 'Do I need gas fees to claim my payouts?', a: 'Platform payouts are gas-optimized. The claiming cost is automatically deducted from the requested payout amount.' }
      ]
    }
  ];

  const handleToggleFaq = (id) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  // Filter FAQs based on search query
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqCategories;
    
    return faqCategories.map(cat => {
      const matched = cat.faqs.filter(
        faq => faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
               faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...cat, faqs: matched };
    }).filter(cat => cat.faqs.length > 0);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-navy-950 text-slate-300 flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-24 pb-16 flex-1 flex flex-col gap-12">
        
        {/* Page Header and Search */}
        <div className="text-center flex flex-col items-center gap-4">
          <Badge type="purple">Documentation Center</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-50 font-display">How can we help?</h1>
          <p className="text-xs text-slate-400 max-w-md">Search for answers regarding wallet verification, smart licensing rules, and automatic payout splits.</p>
          
          <div className="w-full max-w-xl mt-2">
            <InputField
              placeholder="Search help topics, FAQ keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
        </div>

        {/* Getting Started Guides */}
        <div className="flex flex-col gap-6">
          <h3 className="font-bold text-base font-display text-slate-100 border-b border-navy-850 pb-2">
            Getting Started Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guides.map((guide, idx) => {
              const Icon = guide.icon;
              return (
                <div
                  key={idx}
                  className="bg-navy-900 border border-navy-850 hover:border-navy-750 transition-all rounded-xl p-5 flex gap-4 group cursor-pointer"
                >
                  <div className="p-3 bg-primary-purple/10 border border-primary-purple/20 text-primary-purple rounded-xl shrink-0 h-fit group-hover:scale-105 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100 font-display mb-1 group-hover:text-primary-purple-hover transition-colors">
                      {guide.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">{guide.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordions */}
        <div className="flex flex-col gap-8">
          <h3 className="font-bold text-base font-display text-slate-100 border-b border-navy-850 pb-2">
            Frequently Asked Questions
          </h3>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No matching questions found for "{searchQuery}".
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredFaqs.map((category) => (
                <div key={category.name} className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-500">
                    {category.name}
                  </h4>
                  
                  <div className="flex flex-col gap-2">
                    {category.faqs.map((faq) => {
                      const isExpanded = expandedFaqId === faq.id;
                      return (
                        <div
                          key={faq.id}
                          className="bg-navy-900 border border-navy-850 rounded-xl overflow-hidden"
                        >
                          <button
                            onClick={() => handleToggleFaq(faq.id)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left text-xs font-semibold text-slate-200 hover:text-slate-100 cursor-pointer"
                          >
                            <span>{faq.q}</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                          </button>
                          
                          {isExpanded && (
                            <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed font-sans border-t border-navy-850/40 pt-3">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Developer Info & System Status */}
        <div className="bg-navy-900 border border-navy-850 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-green/10 border border-teal-green/20 text-teal-green rounded-lg shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100 font-display">System Infrastructure Status</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">All protocol smart contract verification nodes are operating.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-teal-green font-medium">
              <span className="w-2 h-2 rounded-full bg-teal-green animate-ping" />
              <span>All Systems Operational</span>
            </div>
            <a href="#" className="text-xs text-primary-purple hover:underline font-semibold font-display">API Docs &rarr;</a>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};
