import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import './inputField.scss';

interface InputFieldProps {
  label: string;
  inputText: string | number;
  id?: string;
  type?: string;
  showPasswordBtn?: boolean;
  showClearBtn?: boolean;
  setInputText: (text: string | number) => void;
  backgroundColor?: string;
  tabIndex?: number;
}

function InputField({
  label = '',
  inputText = '',
  id = '',
  type = 'text',
  showPasswordBtn = false,
  showClearBtn = false,
  setInputText,
  backgroundColor = '#ffffff',
  tabIndex,
}: InputFieldProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [inputType, setInputType] = useState<string>(type);

  function onShowPasswordToggle() {
    if (inputType === 'password') {
      setInputType('text');
    } else {
      setInputType('password');
    }
  }

  function onClearBtnClick() {
    setInputText('');
  }

  return (
    <div
      className={`input-wrapper ${inputText ? 'has-value' : ''}`}
      style={{ '--label-bg': backgroundColor } as React.CSSProperties}
    >
      <label className="input-field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="input-field"
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        type={inputType}
        tabIndex={tabIndex}
      ></input>
      {showPasswordBtn && (
        <button
          type="button"
          className="btn-password-show"
          onClick={onShowPasswordToggle}
          tabIndex={-1}
        >
          {inputType === 'password' ? <FaEye /> : <FaEyeSlash />}
        </button>
      )}

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

export default InputField;
