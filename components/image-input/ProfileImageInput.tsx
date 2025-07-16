import React, { useEffect, useState } from 'react';
import './profileImageInput.scss';

function ProfileImageInput({ reference, rerenderkey, onImageUpload }) {
  const [imageDisplay, setImageDisplay] = useState('');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const file = Array.from(e.clipboardData?.files || []).find((f) =>
        f.type.startsWith('image/'),
      );
      if (!file) return;

      const dt = new DataTransfer();
      dt.items.add(file);
      reference.current.files = dt.files;
      reference.current.dispatchEvent(new Event('change', { bubbles: true }));
    };

    window.addEventListener('paste', handlePaste as any);
    return () => window.removeEventListener('paste', handlePaste as any);
  }, []);

  useEffect(() => {
    setImageDisplay('');
    if (reference.current) reference.current.value = '';
  }, [rerenderkey]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageDisplay(URL.createObjectURL(file));
    onImageUpload?.(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    handleUpload({ target: { files: [file] } });
  };

  return (
    <>
      {dragActive && (
        <div
          className="profile-drop-overlay"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      )}
      <div className="profile-image-input-container">
        <button
          type="button"
          className="profile-image-input-button"
          onClick={() => reference.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            ref={reference}
            style={{ display: 'none' }}
          />
          {imageDisplay ? (
            <img src={imageDisplay} alt="Preview" />
          ) : (
            <div className="image-placeholder-text">
              Insert buyer profile image here
            </div>
          )}
        </button>
      </div>
    </>
  );
}

export default ProfileImageInput;
