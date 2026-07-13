'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import useNotificationStore from '../../stores/notificationStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotificationStore();

  const getIcon = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-violet-400" />;
    }
  };

  const getBgColor = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-emerald-950/20';
      case 'error':
        return 'border-rose-500/30 bg-rose-950/20';
      case 'info':
      default:
        return 'border-violet-500/30 bg-violet-950/20';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${getBgColor(
              toast.type
            )}`}
          >
            <div className="flex-shrink-0 mt-0.5">{getIcon(toast.type)}</div>
            <div className="flex-grow text-sm font-medium text-zinc-200">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-zinc-500 hover:text-zinc-300 p-0.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
