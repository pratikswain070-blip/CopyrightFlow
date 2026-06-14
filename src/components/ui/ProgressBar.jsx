import React from 'react';

export const ProgressBar = ({
  percent = 0,
  color = 'purple', // purple, teal, amber, red
  className = '',
  height = 'h-1.5'
}) => {
  const colors = {
    purple: 'bg-primary-purple shadow-[0_0_8px_rgba(59,130,246,0.5)]',
    teal: 'bg-teal-green shadow-[0_0_8px_rgba(20,184,166,0.5)]',
    amber: 'bg-amber-orange shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    red: 'bg-soft-red shadow-[0_0_8px_rgba(239,68,68,0.5)]'
  };

  const currentColor = colors[color] || colors.purple;

  // Cap percentage
  const clampedPercent = Math.max(0, Math.min(100, percent));

  return (
    <div className={`w-full bg-navy-800 rounded-full overflow-hidden ${height} ${className}`}>
      <div
        className={`rounded-full transition-all duration-500 ease-out ${currentColor} ${height}`}
        style={{ width: `${clampedPercent}%` }}
      />
    </div>
  );
};
