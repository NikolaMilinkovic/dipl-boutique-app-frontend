import './textArea.scss';
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface TextAreaTypes {
  label: string;
  inputText: string | number;
  id?: string;
  showClearBtn?: boolean;
  setInputText: (text: string | number) => void;
  backgroundColor?: string;
  tabIndex?: number;
}
function TextArea({
  label = '',
  inputText = '',
  id = '',
  showClearBtn = false,
  setInputText,
  backgroundColor = '#ffffff',
  tabIndex,
}: TextAreaTypes) {
  const [isActive, setIsActive] = useState<boolean>(false);
  function onClearBtnClick() {
    setInputText('');
  }

  return (
    <div
      className={`text-area-input-wrapper ${inputText ? 'has-value' : ''}`}
      style={{ '--label-bg': backgroundColor } as React.CSSProperties}
    >
      <label className="input-field-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className="input-field"
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        tabIndex={tabIndex}
      ></textarea>

      {showClearBtn && (
        <button
          type="button"
          className="btn-clear"
          onClick={onClearBtnClick}
          tabIndex={-1}
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
}

export default TextArea;
