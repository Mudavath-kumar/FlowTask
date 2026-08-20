import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showSuccess: (msg) => addToast(msg, 'success'), showError: (msg) => addToast(msg, 'error') }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} role="status">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {t.type === 'success' ? (
                <CheckCircle2 size={18} color="var(--color-success)" />
              ) : (
                <AlertCircle size={18} color="var(--color-danger)" />
              )}
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{ color: 'var(--text-muted)', display: 'flex', padding: 2 }}
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
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
