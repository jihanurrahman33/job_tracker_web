'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, Check, ArrowRight } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface AlertModalState {
  isOpen: boolean;
  type: ToastType;
  title: string;
  message?: string;
  onConfirm?: () => void;
  confirmText?: string;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  dismissToast: (id: string) => void;
  showAlert: (options: {
    title: string;
    message?: string;
    type?: ToastType;
    confirmText?: string;
    onConfirm?: () => void;
  }) => void;
  closeAlert: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [alertModal, setAlertModal] = useState<AlertModalState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 4500) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  const success = useCallback((title: string, message?: string) => showToast('success', title, message), [showToast]);
  const error = useCallback((title: string, message?: string) => showToast('error', title, message, 6000), [showToast]);
  const info = useCallback((title: string, message?: string) => showToast('info', title, message), [showToast]);
  const warning = useCallback((title: string, message?: string) => showToast('warning', title, message), [showToast]);

  const showAlert = useCallback(
    ({
      title,
      message,
      type = 'info',
      confirmText = 'OK',
      onConfirm,
    }: {
      title: string;
      message?: string;
      type?: ToastType;
      confirmText?: string;
      onConfirm?: () => void;
    }) => {
      setAlertModal({
        isOpen: true,
        type,
        title,
        message,
        confirmText,
        onConfirm,
      });
    },
    []
  );

  const closeAlert = useCallback(() => {
    if (alertModal.onConfirm) {
      alertModal.onConfirm();
    }
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
  }, [alertModal]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        success,
        error,
        info,
        warning,
        dismissToast,
        showAlert,
        closeAlert,
      }}
    >
      {children}

      {/* Floating High-Priority Toast Overlay (Z-Index 9999, top-right) */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full px-4 sm:px-0 pointer-events-none">
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
            info: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
          };

          const cardStyles = {
            success:
              'bg-white dark:bg-zinc-900 border-emerald-500/40 dark:border-emerald-500/30 text-slate-900 dark:text-zinc-100 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/20',
            error:
              'bg-white dark:bg-zinc-900 border-rose-500/40 dark:border-rose-500/30 text-slate-900 dark:text-zinc-100 shadow-xl shadow-rose-500/10 ring-1 ring-rose-500/20',
            info:
              'bg-white dark:bg-zinc-900 border-sky-500/40 dark:border-sky-500/30 text-slate-900 dark:text-zinc-100 shadow-xl shadow-sky-500/10 ring-1 ring-sky-500/20',
            warning:
              'bg-white dark:bg-zinc-900 border-amber-500/40 dark:border-amber-500/30 text-slate-900 dark:text-zinc-100 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/20',
          };

          const badgeStyles = {
            success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
            error: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300',
            info: 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300',
            warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
          };

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 animate-slide-up ${cardStyles[toast.type]}`}
            >
              <div className={`p-1.5 rounded-xl ${badgeStyles[toast.type]} shrink-0`}>
                {icons[toast.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold tracking-tight">{toast.title}</div>
                {toast.message && (
                  <div className="text-xs text-slate-600 dark:text-zinc-300 mt-1 leading-relaxed break-words">
                    {toast.message}
                  </div>
                )}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Global Centered Confirmation/Feedback Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-zinc-800 text-center animate-slide-up space-y-4">
            <div
              className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
                alertModal.type === 'success'
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400'
                  : alertModal.type === 'error'
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
                  : alertModal.type === 'warning'
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400'
                  : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400'
              }`}
            >
              {alertModal.type === 'success' && <CheckCircle2 className="w-8 h-8" />}
              {alertModal.type === 'error' && <AlertCircle className="w-8 h-8" />}
              {alertModal.type === 'warning' && <AlertTriangle className="w-8 h-8" />}
              {alertModal.type === 'info' && <Info className="w-8 h-8" />}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                {alertModal.title}
              </h3>
              {alertModal.message && (
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  {alertModal.message}
                </p>
              )}
            </div>

            <button
              onClick={closeAlert}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-white shadow-md transition-all cursor-pointer ${
                alertModal.type === 'success'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  : alertModal.type === 'error'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
              }`}
            >
              {alertModal.confirmText || 'Got it'}
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
