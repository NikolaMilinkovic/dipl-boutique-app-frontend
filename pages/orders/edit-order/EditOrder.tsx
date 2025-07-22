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
import { betterConsoleLog } from '../../../util-methods/log-methods';
import EditOrderProductDisplay from './components/EditOrderProductDisplay';
import Button from '../../../components/util-components/Button';
import { useAddProductModal } from './components/AddProductModal';
import { useEditOrder } from '../../../store/modals/edit-order-modal-context';

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
  const { getCouriersDropdownItems } = useCouriers();
  const [dropdownItems] = useState(getCouriersDropdownItems());
  betterConsoleLog('> Edited order is', editedOrder);
  const [newProfileImage, setNewProfileImage] = useState<File | ImageTypes>(
    editedOrder.buyer.profileImage,
  );
  const imageInputRef = useRef(null);
  const [rerenderKey, setRerenderKey] = useState(0);

  const { openModal, closeModal } = useAddProductModal();
  function handleOnAddProduct() {
    openModal();
  }

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
              onImageUpload={(image: any) => setNewProfileImage(image)}
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
            {/* RESERVATION | PACKED */}

            {/* CENE */}
          </div>

          {/* SAVE | CANCEL BTN */}
          <div className="edit-order-controls-section">
            <Button label="Cancel" onClick={closeDrawer} />
            <Button label="Save changes" />
          </div>
        </section>
      )}
    </>
  );
}

export default EditOrder;
