import React, { useState, forwardRef } from 'react';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import './inputFieldBorderless.scss';

interface InputFieldBorderlessProps {
  label: string;
  inputText: string;
  id?: string;
  type?: string;
  showPasswordBtn?: boolean;
  showClearBtn?: boolean;
  setInputText: (text: string) => void;
  backgroundColor?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  customClass?: string;
}

const InputFieldBorderless = forwardRef<
  HTMLInputElement,
  InputFieldBorderlessProps
>(
  (
    {
      label,
      inputText,
      id,
      type,
      showPasswordBtn,
      showClearBtn,
      setInputText,
      backgroundColor,
      onClick,
      customClass,
    },
    ref,
  ) => {
    const inputTypeDefault = type ?? 'text';
    const labelDefault = label ?? '';
    const inputTextDefault = inputText ?? '';
    const backgroundColorDefault = backgroundColor ?? '#ffffff';
    const [inputType, setInputType] = useState<string>(inputTypeDefault);

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
        className={`input-wrapper-borderless ${inputTextDefault ? 'has-value' : ''} ${customClass}`}
        style={{ '--label-bg': backgroundColorDefault } as React.CSSProperties}
        onClick={onClick}
      >
        <input
          id={id}
          className="input-field-borderless"
          onChange={(e) => setInputText(e.target.value)}
          value={inputTextDefault}
          type={inputType}
          placeholder={labelDefault}
          ref={ref}
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
  },
);

export default InputFieldBorderless;
