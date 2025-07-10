import React from 'react';
import './confirmationModal.scss';

interface ConfirmModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onConfirmBtnText?: string;
  onCancel: () => void;
  onCancelBtnText?: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  onConfirm,
  onConfirmBtnText = 'Nastavi',
  onCancel,
  onCancelBtnText = 'Odustani',
  message,
}) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay fade" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src="/img/infinity.png" alt="Infinity" className="modal-image" />
        <p className="modal-text">
          {message || 'Da li sigurno želiš da nastaviš dalje sa ovom akcijom?'}
        </p>
        <div className="button-container">
          <button className="modal-button" onClick={onCancel}>
            {onCancelBtnText}
          </button>
          <button className="modal-button" onClick={onConfirm}>
            {onConfirmBtnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
