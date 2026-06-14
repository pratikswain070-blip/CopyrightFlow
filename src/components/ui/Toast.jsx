import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast = ({
  title,
  message,
  type = 'info',
  onClose,
  duration = 4000,
  visible = true
}) => {
  useEffect(() => {
    if (duration && onClose && visible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, visible]);

  const config = {
    success: {
      border: 'border-l-4 border-l-teal-green',
      icon: <CheckCircle className="w-5 h-5 text-teal-green" />,
      bg: 'bg-navy-900 border-navy-800'
    },
    warning: {
      border: 'border-l-4 border-l-amber-orange',
      icon: <AlertTriangle className="w-5 h-5 text-amber-orange" />,
      bg: 'bg-navy-900 border-navy-800'
    },
    error: {
      border: 'border-l-4 border-l-soft-red',
      icon: <AlertCircle className="w-5 h-5 text-soft-red" />,
      bg: 'bg-navy-900 border-navy-800'
    },
    info: {
      border: 'border-l-4 border-l-primary-purple',
      icon: <Info className="w-5 h-5 text-primary-purple" />,
      bg: 'bg-navy-900 border-navy-800'
    }
  };

  const style = config[type] || config.info;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={`fixed bottom-5 right-5 z-50 flex items-start gap-3 p-4 rounded-xl border shadow-xl max-w-sm ${style.bg} ${style.border}`}
        >
          <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
          
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-slate-100">{title}</span>
            {message && <span className="text-xs text-slate-400 leading-relaxed">{message}</span>}
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 text-slate-500 hover:text-slate-200 transition-colors p-1 rounded hover:bg-navy-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
