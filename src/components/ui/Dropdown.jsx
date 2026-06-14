import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Dropdown = ({
  trigger,
  label,
  options, // array of { label, value, icon: Icon }
  selected,
  onSelect,
  align = 'left', // left or right
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {trigger ? (
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-between w-full bg-navy-900 border border-navy-700 text-slate-200 rounded-lg px-4 py-2 text-sm hover:border-navy-600 transition-all cursor-pointer"
        >
          <span>{selected ? options.find(opt => opt.value === selected)?.label || selected : label || 'Select option'}</span>
          <ChevronDown className="w-4 h-4 ml-2 text-slate-500" />
        </button>
      )}

      {isOpen && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-56 rounded-xl border border-navy-800 bg-navy-900 shadow-2xl z-40 overflow-hidden py-1`}
        >
          {options.map((option, idx) => {
            const Icon = option.icon;
            const isSelected = option.value === selected;
            
            return (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                className={`flex items-center w-full px-4 py-2.5 text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary-purple/10 text-primary-purple-hover font-medium'
                    : 'text-slate-300 hover:bg-navy-850 hover:text-slate-100'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 mr-2.5 text-slate-500" />}
                <span className="flex-1 text-left">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
