import React, { useRef, useState } from 'react';
import './editOrder.scss';
import { ImageTypes, OrderTypes } from '../../../global/types';
import InputField from '../../../components/util-components/InputField';
import ProfileImageInput from '../../../components/image-input/ProfileImageInput';
import TextArea from '../../../components/util-components/TextArea';

interface EditOrderPropTypes {
  order: OrderTypes;
}

function EditOrder({ order }: EditOrderPropTypes) {
  const [editedOrder, setEditedOrder] = useState(order);
  const [newProfileImage, setNewProfileImage] = useState<File | ImageTypes>(
    order.buyer.profileImage,
  );
  const imageInputRef = useRef(null);
  const [rerenderKey, setRerenderKey] = useState(0);
  return (
    <>
      {editedOrder && (
        <section className="edit-order-section">
          <div className="edit-order-buyer-information-section">
            <h3 className="edit-order-buyer-header">Buyer Information</h3>
            <br />
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

            {/* IMAGE INPUT */}
            <ProfileImageInput
              reference={imageInputRef}
              rerenderkey={rerenderKey}
              onImageUpload={(image: any) => setNewProfileImage(image)}
            />
          </div>
          <div>
            <h3 className="edit-order-buyer-header">Products Information</h3>
          </div>
        </section>
      )}
    </>
  );
}

export default EditOrder;
