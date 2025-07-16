import React, { useReducer, useRef, useState } from 'react';
import TextArea from '../../../../components/util-components/TextArea';
import { useNewOrder } from '../../../../store/new-order-context';
import './buyerInformationInputs.scss';
import Button from '../../../../components/util-components/Button';
import InputField from '../../../../components/util-components/InputField';
import ImageInput from '../../../../components/image-input/ImageInput';
import ProfileImageInput from '../../../../components/image-input/ProfileImageInput';
import {
  notifyError,
  notifyInfo,
  notifySuccess,
} from '../../../../components/util-components/Notify';
import { handleBuyerDataInputSort } from '../../../../util-methods/inputSortMethod';
import { useAuth } from '../../../../store/auth-context';

interface BuyerInformationInputsPropTypes {
  onNext: () => void;
}

function BuyerInformationInputs({ onNext }: BuyerInformationInputsPropTypes) {
  const { newOrderData, setNewOrderData } = useNewOrder();
  const { token } = useAuth();
  const [dataSortingInput, setDataSortingInput] = useState<string | number>('');
  const imageInputRef = useRef(null);
  const [rerenderKey, setRerenderKey] = useState(0);
  const [isSortingUserInformation, setIsSortingUserInformation] =
    useState(false);
  async function handleInputSort() {
    try {
      if (isSortingUserInformation)
        return notifyInfo('Data is being sorted. Please wait.');
      setIsSortingUserInformation(true);
      const result = await handleBuyerDataInputSort(
        token as string,
        setNewOrderData,
        dataSortingInput as string,
      );
      setIsSortingUserInformation(false);
      notifySuccess('Data parsed successfully!');
      setDataSortingInput('');
    } catch (error) {
      console.error(error);
      notifyError('There was an error while sorting information');
      setIsSortingUserInformation(false);
    }
  }

  function validateData() {
    if (!newOrderData.buyer.name) {
      notifyError('Buyer name is required');
      return false;
    }
    if (!newOrderData.buyer.address) {
      notifyError('Buyer address is required');
      return false;
    }
    if (!newOrderData.buyer.place) {
      notifyError('Buyer place is required');
      return false;
    }
    if (!newOrderData.buyer.phone) {
      notifyError('Buyer phone is required');
      return false;
    }
    if (!newOrderData.buyer.profileImage) {
      notifyError('Buyer profile image is required');
      return false;
    }
    return true;
  }
  function handleOnNext() {
    if (validateData()) onNext();
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
        onClick={handleInputSort}
        className="sort-information-button"
      />

      {/* FULL NAME */}
      <InputField
        showClearBtn={true}
        customClass="buyer-info-input-field"
        backgroundColor="var(--primaryLight)"
        label="Full name"
        inputText={newOrderData.buyer.name}
        setInputText={(value: any) =>
          setNewOrderData((prev) => ({
            ...prev,
            buyer: {
              ...prev.buyer,
              name: value,
            },
          }))
        }
      />

      {/* ADDRESS */}
      <InputField
        showClearBtn={true}
        customClass="buyer-info-input-field"
        backgroundColor="var(--primaryLight)"
        label="Address"
        inputText={newOrderData.buyer.address}
        setInputText={(value: any) =>
          setNewOrderData((prev) => ({
            ...prev,
            buyer: {
              ...prev.buyer,
              address: value,
            },
          }))
        }
      />

      {/* PLACE */}
      <InputField
        showClearBtn={true}
        customClass="buyer-info-input-field"
        backgroundColor="var(--primaryLight)"
        label="Place"
        inputText={newOrderData.buyer.place}
        setInputText={(value: any) =>
          setNewOrderData((prev) => ({
            ...prev,
            buyer: {
              ...prev.buyer,
              place: value,
            },
          }))
        }
      />

      {/* PHONE NUM */}
      <InputField
        showClearBtn={true}
        customClass="buyer-info-input-field"
        backgroundColor="var(--primaryLight)"
        label="Phone number"
        inputText={newOrderData.buyer.phone}
        setInputText={(value: any) =>
          setNewOrderData((prev) => ({
            ...prev,
            buyer: {
              ...prev.buyer,
              phone: value,
            },
          }))
        }
      />

      {/* PHONE NUM 2 */}
      <InputField
        showClearBtn={true}
        customClass="buyer-info-input-field"
        backgroundColor="var(--primaryLight)"
        label="Additional phone number"
        inputText={newOrderData.buyer.phone2}
        setInputText={(value: any) =>
          setNewOrderData((prev) => ({
            ...prev,
            buyer: {
              ...prev.buyer,
              phone2: value,
            },
          }))
        }
      />

      {/* COURIER NOTE */}
      <TextArea
        id="delivery-note-input-field"
        inputText={newOrderData.deliveryRemark}
        setInputText={(value: any) =>
          setNewOrderData((prev) => ({
            ...prev,
            deliveryRemark: value,
          }))
        }
        label="Delivery note"
        showClearBtn={true}
        backgroundColor="var(--primaryLight)"
      />

      {/* INTERNAL NOTE */}
      <TextArea
        id="internal-note-input-field"
        inputText={newOrderData.internalRemark}
        setInputText={(value: any) =>
          setNewOrderData((prev) => ({
            ...prev,
            internalRemark: value,
          }))
        }
        label="Internal note"
        showClearBtn={true}
        backgroundColor="var(--primaryLight)"
      />

      {/* IMAGE INPUT */}
      <ProfileImageInput
        reference={imageInputRef}
        rerenderkey={rerenderKey}
        onImageUpload={(image: File) =>
          setNewOrderData((prev) => ({
            ...prev,
            buyer: {
              ...prev.buyer,
              profileImage: image,
            },
          }))
        }
      />

      {/* ON NEXT BUTTON */}
      <Button label="Next" onClick={handleOnNext} className="on-next-btn" />
    </div>
  );
}

export default BuyerInformationInputs;
