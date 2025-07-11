import React from 'react';
import './imagePreviewModal.scss';
import ButtonClose from '../util-components/ButtonClose';
import { MdClose } from 'react-icons/md';

interface ImagePreviewModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onCloseBtnText?: string;
  title?: string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isVisible,
  onCancel,
  title = '',
  imgUri = '',
}) => {
  if (!isVisible) return null;

  return (
    <div className="modal-image-preview-overlay fade" onClick={onCancel}>
      <div
        className="modal-image-preview-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="image-preview-modal-header">
          <h2>{title}</h2>
          <ButtonClose
            onClick={onCancel}
            label={<MdClose size={24} />}
            className="btn-edit-product-close"
          />
        </div>
        <hr />
        <img
          src={imgUri}
          alt="Preview image"
          className="image-preview-img-element"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
