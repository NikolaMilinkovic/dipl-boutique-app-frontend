import React from 'react';
import './alertModal.scss';

interface AlertModalProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  btnText?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isVisible,
  message,
  onClose,
  btnText = 'OK',
}) => {
  if (!isVisible) return null;

  return (
    <div className="alert-modal-overlay fade" onClick={onClose}>
      <div className="alert-modal-content" onClick={(e) => e.stopPropagation()}>
        <img
          src="/img/infinity.png"
          alt="Infinity"
          className="alert-modal-image"
        />
        <p className="alert-modal-text">{message}</p>
        <div className="alert-button-container">
          <button className="alert-modal-button" onClick={onClose}>
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
