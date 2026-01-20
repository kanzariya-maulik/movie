'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="fixed bottom-8 left-0 right-0 z-[100] mx-auto px-4 sm:left-1/2 sm:right-auto sm:w-auto sm:-translate-x-1/2 sm:px-0"
    >
      <div className={`flex w-full items-center justify-between space-x-3 rounded-2xl border px-5 py-3.5 shadow-2xl backdrop-blur-md sm:w-auto sm:rounded-full ${
        type === 'success' 
          ? 'border-green-500/30 bg-green-500/10 text-green-400' 
          : 'border-red-500/30 bg-red-500/10 text-red-400'
      }`}>
        <div className="flex items-center space-x-3">
          {type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <span className="text-sm font-bold tracking-tight leading-tight">{message}</span>
        </div>
        <button 
          onClick={onClose}
          className="ml-2 rounded-full p-1 opacity-60 transition hover:bg-white/10 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
