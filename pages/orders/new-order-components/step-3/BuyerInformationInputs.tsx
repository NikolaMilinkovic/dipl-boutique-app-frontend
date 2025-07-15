import React, { useState } from 'react';
import TextArea from '../../../../components/util-components/TextArea';
import { useNewOrder } from '../../../../store/new-order-context';
import './buyerInformationInputs.scss';
import Button from '../../../../components/util-components/Button';
import InputField from '../../../../components/util-components/InputField';
import ImageInput from '../../../../components/image-input/ImageInput';

interface BuyerInformationInputsPropTypes {
  onNext: () => void;
}

function BuyerInformationInputs({ onNext }: BuyerInformationInputsPropTypes) {
  const { newOrderData } = useNewOrder();
  const [dataSortingInput, setDataSortingInput] = useState<string | number>('');
  const [tmp, setTmp] = useState<string | number>('');

  function handleOnNext() {
    // VALIDATE DATA BEFORE ALLOWING NEXT
    onNext();
  }
  return (
    <div className="buyer-information-inputs-container">
      <TextArea
        id="buyer-info-sort-input"
        inputText={dataSortingInput}
        setInputText={setDataSortingInput}
        label="Insert buyer name, address and phone number"
        showClearBtn={true}
        backgroundColor="var(--primaryLight)"
      />
      <Button
        label="Sort information"
        onClick={() => {}}
        className="sort-information-button"
      />

      {/* FULL NAME */}
      <InputField
        showClearBtn={true}
        customClass="buyer-info-input-field"
        backgroundColor="var(--primaryLight)"
        label="Full name"
        inputText={tmp}
        setInputText={setTmp}
      />

      {/* ADDRESS */}
      <InputField
        showClearBtn={true}
        customClass="buyer-info-input-field"
        backgroundColor="var(--primaryLight)"
        label="Address"
        inputText={tmp}
        setInputText={setTmp}
      />

      {/* LOCATION */}
      <InputField
        showClearBtn={true}
        customClass="buyer-info-input-field"
        backgroundColor="var(--primaryLight)"
        label="Location"
        inputText={tmp}
        setInputText={setTmp}
      />

      {/* PHONE NUM */}
      <InputField
        showClearBtn={true}
        customClass="buyer-info-input-field"
        backgroundColor="var(--primaryLight)"
        label="Phone number"
        inputText={tmp}
        setInputText={setTmp}
      />

      {/* PHONE NUM 2 */}
      <InputField
        showClearBtn={true}
        customClass="buyer-info-input-field"
        backgroundColor="var(--primaryLight)"
        label="Additional phone number"
        inputText={tmp}
        setInputText={setTmp}
      />

      {/* COURIER NOTE */}
      <TextArea
        id="courier-note-input-field"
        inputText={dataSortingInput}
        setInputText={setDataSortingInput}
        label="Courier note"
        showClearBtn={true}
        backgroundColor="var(--primaryLight)"
      />

      {/* INTERNAL NOTE */}
      <TextArea
        id="internal-note-input-field"
        inputText={dataSortingInput}
        setInputText={setDataSortingInput}
        label="Internal note"
        showClearBtn={true}
        backgroundColor="var(--primaryLight)"
      />

      {/* IMAGE INPUT */}

      {/* ON NEXT BUTTON */}
      <Button label="Next" onClick={handleOnNext} className="on-next-btn" />
    </div>
  );
}

export default BuyerInformationInputs;
