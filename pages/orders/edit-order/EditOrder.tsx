import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import './editOrder.scss';
import { ImageTypes, OrderTypes } from '../../../global/types';
import InputField from '../../../components/util-components/InputField';
import ProfileImageInput from '../../../components/image-input/ProfileImageInput';
import TextArea from '../../../components/util-components/TextArea';
import Dropdown from '../../../components/dropdowns/Dropdown';
import { useCouriers } from '../../../store/couriers-context';
import EditOrderProductDisplay from './components/EditOrderProductDisplay';
import Button from '../../../components/util-components/Button';
import { useAddProductModal } from './components/AddProductModal';
import { useEditOrder } from '../../../store/modals/edit-order-modal-context';
import Checkbox from '../../../components/checkbox/Checkbox';
import { useAlertModal } from '../../../store/modals/alert-modal-context';

interface EditOrderPropTypes {
  editedOrder: OrderTypes;
  setEditedOrder: Dispatch<SetStateAction<OrderTypes>>;
  closeDrawer: () => void;
}

function EditOrder({
  editedOrder,
  setEditedOrder,
  closeDrawer,
}: EditOrderPropTypes) {
  const { onSubmitOrderUpdate } = useEditOrder();
  const { getCouriersDropdownItems } = useCouriers();
  const [dropdownItems] = useState(getCouriersDropdownItems());
  const [newProfileImage, setNewProfileImage] = useState<File | ImageTypes>(
    editedOrder.buyer.profileImage,
  );
  const imageInputRef = useRef(null);
  const [rerenderKey, setRerenderKey] = useState(0);
  const { showAlert } = useAlertModal();

  const { openModal, closeModal } = useAddProductModal();
  function handleOnAddProduct() {
    openModal();
  }

  const handleImageUpload = (file: File) => {
    setEditedOrder((prev) => ({
      ...prev,
      buyer: {
        ...prev.buyer,
        profileImage: file,
      },
    }));
  };

  return (
    <>
      {editedOrder && (
        <section className="edit-order-section">
          {/* BUYER INFORMATION SECTION */}
          <div className="edit-order-buyer-information-section">
            <h3 className="edit-order-header">Buyer Information</h3>
            <br />
            {/* IMAGE INPUT */}
            <ProfileImageInput
              reference={imageInputRef}
              rerenderkey={rerenderKey}
              onImageUpload={handleImageUpload}
              customClass="edit-order-profile-image-input"
              defaultDisplayImageUri={editedOrder.buyer.profileImage.uri}
            />

            <div className="edit-order-buyer-information-right">
              {/* NAME */}
              <InputField
                label="Full buyer name"
                inputText={editedOrder.buyer.name}
                setInputText={(newName) =>
                  setEditedOrder((prev) => ({
                    ...prev,
                    buyer: {
                      ...prev.buyer,
                      name: newName.toString(),
                    },
                  }))
                }
              />

              {/* ADRESS */}
              <InputField
                label="Address"
                inputText={editedOrder.buyer.address}
                setInputText={(newAddress) =>
                  setEditedOrder((prev) => ({
                    ...prev,
                    buyer: {
                      ...prev.buyer,
                      address: newAddress.toString(),
                    },
                  }))
                }
              />

              {/* PLACE */}
              <InputField
                label="Place"
                inputText={editedOrder.buyer.place}
                setInputText={(newPlace) =>
                  setEditedOrder((prev) => ({
                    ...prev,
                    buyer: {
                      ...prev.buyer,
                      place: newPlace.toString(),
                    },
                  }))
                }
              />
              {/* PHONE */}
              <InputField
                label="Phone number"
                inputText={editedOrder.buyer.phone}
                setInputText={(newPhone) =>
                  setEditedOrder((prev) => ({
                    ...prev,
                    buyer: {
                      ...prev.buyer,
                      phone: newPhone.toString(),
                    },
                  }))
                }
              />
            </div>

            {/* COURIER NOTE */}
            <TextArea
              customClass="edit-order-delivery-note-input"
              inputText={editedOrder.deliveryRemark}
              setInputText={(value: any) =>
                setEditedOrder((prev) => ({
                  ...prev,
                  deliveryRemark: value,
                }))
              }
              label="Delivery note"
              showClearBtn={true}
              backgroundColor="var(--white)"
            />
          </div>

          {/* COURIER INFORMATION SECTION */}
          <div className="edit-order-courier-information-section">
            <h3 className="edit-order-header">Courier Information</h3>
            <Dropdown
              options={dropdownItems}
              onSelect={({ value, label }) =>
                setEditedOrder((prev) => ({
                  ...prev,
                  courier: {
                    deliveryPrice: Number(value),
                    name: label,
                  },
                }))
              }
              value={{
                label: editedOrder.courier.name,
                value: editedOrder.courier.deliveryPrice.toString(),
              }}
            />
          </div>

          {/* PRODUCTS INFORMATION SECTION */}
          <div className="edit-order-products-information-section">
            <h3 className="edit-order-header">
              Products Information ({editedOrder.products.length})
            </h3>

            {/* PRODUCTS LIST */}
            <div className="edit-order-products-list">
              {editedOrder &&
                editedOrder.products.map((product, index) => (
                  <EditOrderProductDisplay
                    key={`product-${index}`}
                    product={product}
                    index={index}
                    setProducts={(updater) =>
                      setEditedOrder((prev) => ({
                        ...prev,
                        products: updater(prev.products),
                      }))
                    }
                  />
                ))}
              {editedOrder && editedOrder.products.length === 0 && (
                <p>There are no products added to the order.</p>
              )}
            </div>

            {/* ADD NEW PRODUCTS */}
            <Button label="Add product" onClick={handleOnAddProduct} />
          </div>

          {/* OTHER */}
          <div className="edit-order-other-information-section">
            <h3>Other information</h3>
            <br />

            <div className="grid-1-1 gap-1">
              {/* RESERVATION */}
              <div>
                <p>Reservation</p>
                <hr />
                <div className="edit-order-checkbox-section">
                  <Checkbox
                    label="Yes"
                    checked={editedOrder.reservation}
                    onCheckedChange={() =>
                      setEditedOrder((prev) => ({ ...prev, reservation: true }))
                    }
                  />
                  <Checkbox
                    label="No"
                    checked={!editedOrder.reservation}
                    onCheckedChange={() =>
                      setEditedOrder((prev) => ({
                        ...prev,
                        reservation: false,
                      }))
                    }
                  />
                </div>
              </div>

              {/* PACKED */}
              <div>
                <p>Packed</p>
                <hr />
                <div className="edit-order-checkbox-section">
                  <Checkbox
                    label="Yes"
                    checked={editedOrder.packed}
                    onCheckedChange={() =>
                      setEditedOrder((prev) => ({ ...prev, packed: true }))
                    }
                  />
                  <Checkbox
                    label="No"
                    checked={!editedOrder.packed}
                    onCheckedChange={() =>
                      setEditedOrder((prev) => ({ ...prev, packed: false }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* CENE */}
            <p>Prices</p>
            <hr style={{ marginBottom: '1rem' }} />
            <div
              className="new-order-other-information"
              style={{ marginLeft: '0.5rem' }}
            >
              <div className="grid-1-1">
                <p>Courier:</p>
                <p>{editedOrder.courier.name}</p>
              </div>
              <div className="grid-1-1">
                <p>Courier price:</p>
                <p>{editedOrder.courier.deliveryPrice} rsd.</p>
              </div>
              <div className="grid-1-1">
                <p>Products price:</p>
                <p>{editedOrder.productsPrice} rsd.</p>
              </div>
              <div className="grid-1-1">
                <p>Total price:</p>
                <p>{editedOrder.totalPrice} rsd.</p>
              </div>
            </div>
            <br />
            <hr />

            <div className="new-order-total-price-input-container">
              <InputField
                label="Custom price"
                backgroundColor="var(--white)"
                inputText={editedOrder.totalPrice.toString()}
                setInputText={(value) => {
                  if (isNaN(Number(value))) {
                    showAlert('Please enter a valid number!');
                    return;
                  }
                  setEditedOrder((prev) => ({
                    ...prev,
                    totalPrice: Number(value),
                  }));
                }}
                showClearBtn={true}
              />
            </div>
          </div>

          {/* SAVE | CANCEL BTN */}
          <div className="edit-order-controls-section">
            <Button label="Cancel" onClick={closeDrawer} />
            <Button label="Save changes" onClick={onSubmitOrderUpdate} />
          </div>
        </section>
      )}
    </>
  );
}

export default EditOrder;
