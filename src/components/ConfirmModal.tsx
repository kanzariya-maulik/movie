'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  isLoading 
}: ConfirmModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return (
    <div className={`fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-netflix-dark-grey p-6 shadow-2xl sm:p-8 transition-transform duration-300 ${
          show ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-netflix-red/10 p-3 sm:mb-6 sm:p-4">
            <AlertTriangle className="h-6 w-6 text-netflix-red sm:h-8 sm:w-8" />
          </div>
          
          <h3 className="mb-2 text-lg font-black text-white sm:text-xl">{title}</h3>
          <p className="mb-6 text-sm leading-relaxed text-gray-400 sm:mb-8 md:text-base">
            {message}
          </p>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <button
              disabled={isLoading}
              onClick={onCancel}
              className="flex-1 rounded-xl bg-white/5 py-3 text-sm font-bold text-gray-400 transition hover:bg-white/10 active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-netflix-red py-3 text-sm font-bold text-white shadow-lg shadow-netflix-red/20 transition hover:bg-red-700 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Confirm Delete'
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-gray-500 transition hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
