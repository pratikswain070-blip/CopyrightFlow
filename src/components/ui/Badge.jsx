import React from 'react';

export const Badge = ({ children, type = 'neutral', className = '' }) => {
  const styles = {
    purple: {
      bg: 'bg-primary-purple/10 border-primary-purple/30 text-primary-purple-hover',
      dot: 'bg-primary-purple'
    },
    teal: {
      bg: 'bg-teal-green/10 border-teal-green/30 text-teal-green-hover',
      dot: 'bg-teal-green'
    },
    amber: {
      bg: 'bg-amber-orange/10 border-amber-orange/30 text-amber-orange-hover',
      dot: 'bg-amber-orange'
    },
    success: {
      bg: 'bg-teal-green/10 border-teal-green/30 text-teal-green-hover',
      dot: 'bg-teal-green'
    },
    warning: {
      bg: 'bg-amber-orange/10 border-amber-orange/30 text-amber-orange-hover',
      dot: 'bg-amber-orange'
    },
    danger: {
      bg: 'bg-soft-red/10 border-soft-red/30 text-soft-red-hover',
      dot: 'bg-soft-red'
    },
    info: {
      bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      dot: 'bg-blue-500'
    },
    neutral: {
      bg: 'bg-navy-800 border-navy-700 text-slate-400',
      dot: 'bg-slate-500'
    }
  };

  const currentStyle = styles[type] || styles.neutral;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle.bg} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${currentStyle.dot}`} />
      {children}
    </span>
  );
};
