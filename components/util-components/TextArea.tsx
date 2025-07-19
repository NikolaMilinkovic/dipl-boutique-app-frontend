import './textArea.scss';
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';
import { FaTimes } from 'react-icons/fa';
interface TextAreaHandle {
  focus: () => void;
}
interface TextAreaTypes {
  label: string;
  inputText: string | number;
  id?: string;
  showClearBtn?: boolean;
  setInputText: (text: string | number) => void;
  backgroundColor?: string;
  tabIndex?: number;
  onKeyDown?: any;
  customClass?: string;
  customInputClass?: string;
}
const TextArea = forwardRef<TextAreaHandle, TextAreaTypes>(
  (
    {
      label = '',
      inputText = '',
      id = '',
      showClearBtn = false,
      setInputText,
      backgroundColor = '#ffffff',
      tabIndex,
      onKeyDown,
      customClass,
      customInputClass,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus();
      },
    }));

    function onClearBtnClick() {
      setInputText('');
    }

    return (
      <div
        className={`text-area-input-wrapper ${inputText ? 'has-value' : ''} ${customClass}`}
        style={{ '--label-bg': backgroundColor } as React.CSSProperties}
      >
        <label className="input-field-label" htmlFor={id}>
          {label}
        </label>
        <textarea
          ref={textareaRef}
          onKeyDown={onKeyDown}
          id={id}
          className={`input-field ${customInputClass}`}
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
  },
);

export default TextArea;
