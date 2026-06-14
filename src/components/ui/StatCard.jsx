import React from 'react';
import * as Lucide from 'lucide-react';

export const StatCard = ({
  label,
  value,
  iconName, // e.g. "Coins", "Award"
  trend, // number (e.g. +12.4 or -3.2)
  className = ''
}) => {
  // Map string to Lucide icon component dynamically if needed
  const IconComponent = Lucide[iconName] || Lucide.TrendingUp;

  const isPositive = trend >= 0;

  return (
    <div className={`bg-navy-900 border border-navy-800 rounded-xl p-5 flex items-center justify-between ${className}`}>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
        <span className="text-2xl font-bold text-slate-50 font-display">{value}</span>
        
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-1 text-xs">
            {isPositive ? (
              <span className="text-teal-green flex items-center font-medium">
                <Lucide.TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +{trend}%
              </span>
            ) : (
              <span className="text-soft-red flex items-center font-medium">
                <Lucide.TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                {trend}%
              </span>
            )}
            <span className="text-slate-600">vs last month</span>
          </div>
        )}
      </div>

      <div className="p-3 bg-primary-purple/10 border border-primary-purple/20 text-primary-purple rounded-xl">
        <IconComponent className="w-6 h-6" />
      </div>
    </div>
  );
};
