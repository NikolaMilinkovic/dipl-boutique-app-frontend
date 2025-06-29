import React from 'react';
import Button from './Button';
import InputField from './InputField';
import './singleInputForm.scss';

interface SingleInputFormTypes {
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
  formMethod: () => Promise<void> | void;
  title: string;
  borders?: boolean;
  label: string;
  btn_label: string;
}

function SingleInputForm({
  data,
  setData,
  formMethod,
  title,
  borders = true,
  label,
  btn_label,
}: SingleInputFormTypes) {
  const borderStyles = {
    borderBottom: '1px solid var(--secondaryLight)',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
  };
  return (
    <section className="controls-section" style={borders ? borderStyles : {}}>
      <h2>{title}</h2>
      <form
        className="single-input-controls-form"
        onSubmit={(e) => {
          e.preventDefault();
          formMethod();
        }}
      >
        <InputField
          inputText={data}
          label={label}
          setInputText={(text) => setData(text)}
          type="text"
          showClearBtn={true}
          backgroundColor="var(--primaryLight)"
        />
        <Button label={btn_label} type="submit" className="add-btn" />
      </form>
    </section>
  );
}

export default SingleInputForm;
