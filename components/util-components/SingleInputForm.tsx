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
}

function SingleInputForm({
  data,
  setData,
  formMethod,
  title,
  borders = true,
}: SingleInputFormTypes) {
  const borderStyles = {
    borderBottom: '1px solid var(--secondaryLight)',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
  };
  return (
    <section className="controls-section" style={borders ? borderStyles : {}}>
      <h2>{title}</h2>
      <form
        className="add-color-controls"
        onSubmit={(e) => {
          e.preventDefault();
          formMethod();
        }}
      >
        <InputField
          inputText={data}
          label="Color"
          id="new-color-input"
          setInputText={(text) => setData(text)}
          type="text"
          showClearBtn={true}
          backgroundColor="var(--primaryLight)"
        />
        <Button label="Add new color" type="submit" className="add-btn" />
      </form>
    </section>
  );
}

export default SingleInputForm;
