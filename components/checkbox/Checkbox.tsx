import React from 'react';
import './checkbox.scss';

interface Props {
  label: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}

export default function Checkbox({ label, checked, onCheckedChange }: Props) {
  function onClickHandler() {
    onCheckedChange(!checked);
  }

  return (
    <div className="checkbox-container" onClick={onClickHandler}>
      <div className={`checkbox ${checked ? 'checked' : ''}`}>
        {checked && <div className="tick" />}
      </div>
      <span className="label">{label}</span>
    </div>
  );
}
