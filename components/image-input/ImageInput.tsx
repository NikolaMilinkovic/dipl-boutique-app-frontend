async function resizeImage(file) {
  if (!(file instanceof Blob)) {
    throw new TypeError('The provided file is not of type Blob.');
  }

  const imageUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });

  return new Promise((resolve, reject) => {
    const image = document.createElement('img');
    image.src = imageUrl;

    image.onload = (e) => {
      // Original image
      const originalWidth = e.target.width;
      const originalHeight = e.target.height;
      // image / 10
      const canvasWidth = Math.round(originalWidth / 10);
      const canvasHeight = Math.round(originalHeight / 10);

      // Create canvas element
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      // const ratio = originalWidth / canvasWidth;
      // canvas.height = ratio * originalHeight;
      canvas.height = canvasHeight;

      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const new_imageUrl = context.canvas.toDataURL('image/jpeg', 1);
      resolve(new_imageUrl);
    };

    image.onerror = (error) => {
      reject(error);
    };
  });
}

import React, { useEffect, useState } from 'react';
import './imageInput.scss';

function ImageInput({
  reference,
  rerenderkey,
  label = 'Click to upload image',
  product,
  onImageUpload,
}) {
  const [text, setText] = useState(label);
  const [imageDisplay, setImageDisplay] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // PASTE EVENT HANDLER
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const file = Array.from(e.clipboardData?.files || []).find((f) =>
        f.type.startsWith('image/'),
      );
      if (!file) return;

      const dt = new DataTransfer();
      dt.items.add(file);
      reference.current.files = dt.files;

      const changeEvent = new Event('change', { bubbles: true });
      reference.current.dispatchEvent(changeEvent);
    };

    window.addEventListener('paste', handlePaste as any);
    return () => {
      window.removeEventListener('paste', handlePaste as any);
    };
  }, []);

  useEffect(() => {
    if (product?.image?.uri) {
      setImageDisplay(product.image.uri);
      setText(product.image.imageName || 'Image');
      setShowPreview(true);
    }
  }, [product]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setText(file.name);
    setShowPreview(true);
    setImageDisplay(URL.createObjectURL(file));

    onImageUpload?.(file);
  };

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   const file = e.dataTransfer.files[0];
  //   if (!file) return;

  //   const dt = new DataTransfer();
  //   dt.items.add(file);
  //   reference.current.files = dt.files;

  //   const changeEvent = new Event('change', { bubbles: true });
  //   reference.current.dispatchEvent(changeEvent);
  // };

  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    await handleUpload({ target: { files: [file] } });
  };

  return (
    <>
      {dragActive && (
        <div
          className="drop-overlay"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      )}
      <div>
        <div className="image-input-container">
          <button
            type="button"
            className="image-input-button"
            onClick={() => reference.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <span>{text}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              ref={reference}
              style={{ display: 'none' }}
            />
            {imageDisplay && showPreview && (
              <img
                src={imageDisplay}
                alt="Preview"
                className={showPreview ? 'visible' : ''}
              />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default ImageInput;
