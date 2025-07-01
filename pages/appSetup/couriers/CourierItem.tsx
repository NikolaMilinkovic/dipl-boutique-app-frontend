import { useEffect, useRef, useState } from 'react';
import { CourierTypes } from '../../../global/types';
import {
  notifyError,
  notifySuccess,
} from '../../../components/util-components/Notify';
import { betterErrorLog } from '../../../util-methods/log-methods';
import Button from '../../../components/util-components/Button';
import './courierItem.scss';
import InputFieldBorderless from '../../../components/util-components/InputFieldBorderless';
import { useAuth } from '../../../store/auth-context';

function CourierItem({ data }: { data: CourierTypes }) {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [couriersData, setCouriersData] = useState<CourierTypes>({
    _id: '',
    name: '',
    deliveryPrice: '',
  });
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState<string | number>('');
  const [showEdit, setShowEdit] = useState<Boolean>(false);
  const { token } = useAuth();

  // Toggler
  function showEditCourierHandler() {
    setNewName(data.name);
    setNewPrice(data.deliveryPrice);
    setShowEdit(!showEdit);
  }

  // Set default data to read from
  useEffect(() => {
    setCouriersData(data);
    setNewName(data.name);
  }, [data]);

  // Updates the current color name in the database
  async function updateSupplierHandler() {
    try {
      if (newName.trim() === data.name && newPrice === data.deliveryPrice) {
        setShowEdit(false);
        return;
      }
      if (newName.trim() === '') {
        notifyError('Kurir mora imati ime!');
        return;
      }
      if (newPrice === '') {
        notifyError('Kurir mora imati cenu!');
        return;
      }

      const response = await fetch(`${apiUrl}/courier/${couriersData._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: couriersData._id,
          name: newName,
          deliveryPrice: newPrice,
        }),
      });

      if (!response.ok) {
        const parsedResponse = await response.json();
        notifyError(parsedResponse.message);
      }

      const parsedResponse = await response.json();
      notifySuccess(parsedResponse.message);
      setShowEdit(false);
    } catch (error) {
      betterErrorLog('> Error updating the courier:', error);
    }
  }

  // Deletes the color from the database
  async function removeSupplierHandler() {
    try {
      const response = await fetch(`${apiUrl}/courier/${couriersData._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const parsedResponse = await response.json();
        notifyError(parsedResponse.message);
        return;
      }

      notifySuccess(`Kurir je uspešno obrisan`);
    } catch (error) {
      betterErrorLog('> Error deleting supplier:', error);
    }
  }

  if (couriersData === null) {
    return <></>;
  }

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (showEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showEdit]);

  return (
    <div className="courrierItem" onClick={showEditCourierHandler}>
      {showEdit ? (
        <form className="mainInputsContainer" action={updateSupplierHandler}>
          <InputFieldBorderless
            label="Courier name"
            inputText={newName}
            setInputText={setNewName}
            showClearBtn={true}
            ref={inputRef}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <InputFieldBorderless
            label="Courier price"
            inputText={newPrice}
            setInputText={setNewPrice}
            showClearBtn={true}
            ref={inputRef}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <div className="buttons">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                showEditCourierHandler();
              }}
              label="Cancel"
              className="color-btn"
            />
            <Button
              onClick={(e) => {
                e.stopPropagation();
              }}
              label="Save"
              className="color-btn"
              type="submit"
            />
          </div>
        </form>
      ) : (
        <div className="displayColor">
          <p className="colorText">{couriersData.name}</p>
          <p className="colorText" style={{ marginLeft: 'auto' }}>
            {couriersData.deliveryPrice} RSD
          </p>
          <Button
            label="Delete"
            onClick={(e) => {
              e.stopPropagation();
              removeSupplierHandler();
            }}
            className="deleteIcon"
          />
        </div>
      )}
    </div>
  );
}

export default CourierItem;
