import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Coins,
  History,
  Award,
  ArrowLeftRight,
  Database
} from 'lucide-react';

export const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { dashboard, assets } = useApp();

  // Compute history count across all owned assets
  const historyCount = React.useMemo(() => {
    if (!dashboard || !dashboard.myAssets || !assets) return 0;
    let count = 0;
    dashboard.myAssets.forEach(myAsset => {
      const globalAsset = assets.find(a => a.id === myAsset.id || a.name === myAsset.name);
      if (globalAsset && globalAsset.history) {
        count += globalAsset.history.length;
      }
    });
    return count;
  }, [dashboard?.myAssets, assets]);

  const getCount = (id) => {
    if (!dashboard) return undefined;
    switch (id) {
      case 'my-assets':
        return dashboard.myAssets?.length;
      case 'my-licenses':
        return dashboard.myLicenses?.length;
      case 'history':
        return historyCount;
      case 'transfers':
        return dashboard.pendingTransfers?.length;
      default:
        return undefined;
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'my-assets', label: 'My Assets', icon: Database },
    { id: 'history', label: 'Ownership History', icon: History },
    { id: 'my-licenses', label: 'My Licenses', icon: Award },
    { id: 'royalty', label: 'Royalty Earnings', icon: Coins },
    { id: 'transfers', label: 'Pending Transfers', icon: ArrowLeftRight }
  ];

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col text-slate-300">
      {/* Navbar Fixed */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 flex pt-16 pb-20 md:pb-0 h-[calc(100vh-64px)] overflow-hidden">
        {/* Left Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col w-[240px] bg-navy-900 border-r border-navy-850 h-full p-4 justify-between shrink-0">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-2">
              Management
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const count = getCount(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left cursor-pointer border-l-2 ${
                    isActive
                      ? 'border-primary-purple bg-primary-purple/10 text-slate-50 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-navy-850'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-purple' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {count !== undefined && (
                    <span className="ml-auto bg-navy-800 text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded-full border border-navy-750">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Tab Bar - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-navy-900 border-t border-navy-850 flex items-center justify-around z-40 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const count = getCount(item.id);

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors cursor-pointer relative ${
                isActive ? 'text-primary-purple' : 'text-slate-500'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {count !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-primary-purple text-[8px] text-white font-mono w-3.5 h-3.5 flex items-center justify-center rounded-full border border-navy-900">
                    {count}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-medium">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
