import React from 'react';


export interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className='dialog-overlay'>
      <div className='dialog-content'>
        <h3 className='dialog-title'>{title}</h3>
        <p className='dialog-message'>{message}</p>
        <div className='dialog-actions'>
          <button className='dialog-cancel' onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className='dialog-confirm' onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
