import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, isDeleting = false, taskTitle = '' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="var(--color-danger)" />
            <h3 className="modal-title">Delete Task?</h3>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ marginBottom: '8px', color: 'var(--text-primary)', fontWeight: 500 }}>
            {taskTitle ? `Are you sure you want to delete "${taskTitle}"?` : 'Are you sure you want to delete this task?'}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            This action cannot be undone. The task will be permanently removed from your dashboard and analytics.
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isDeleting}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="btn btn-danger" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
