import React from 'react';

export const InputField = ({
  label,
  placeholder,
  type = 'text',
  icon: Icon,
  error,
  onChange,
  value,
  name,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label} {required && <span className="text-soft-red">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-slate-500 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`w-full bg-navy-900 border text-sm text-slate-100 rounded-lg py-2.5 ${
            Icon ? 'pl-10' : 'px-3'
          } pr-3 transition-all duration-200 outline-none ${
            error
              ? 'border-soft-red focus:border-soft-red focus:ring-2 focus:ring-soft-red/20'
              : 'border-navy-700 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20'
          }`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-soft-red font-medium mt-0.5">{error}</span>
      )}
    </div>
  );
};
