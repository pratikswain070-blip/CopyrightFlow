import React from 'react';

export const Tabs = ({
  tabs, // array of { id, label, icon: IconComponent }
  activeTab,
  onChange,
  className = ''
}) => {
  return (
    <div className={`border-b border-navy-800 flex gap-6 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all relative cursor-pointer ${
              isActive
                ? 'text-slate-50 border-b-2 border-primary-purple font-semibold'
                : 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent'
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
