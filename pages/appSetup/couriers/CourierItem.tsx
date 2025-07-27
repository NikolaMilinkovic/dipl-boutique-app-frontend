import { useEffect, useRef, useState } from 'react';
import { CourierTypes } from '../../../global/types';
import {
  notifyError,
  notifySuccess,
  notifyWarrning,
} from '../../../components/util-components/Notify';
import { betterErrorLog } from '../../../util-methods/log-methods';
import Button from '../../../components/util-components/Button';
import './courierItem.scss';
import InputFieldBorderless from '../../../components/util-components/InputFieldBorderless';
import { useAuth } from '../../../store/auth-context';
import { useUser } from '../../../store/user-context';

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
  const { user } = useUser();
  const { token } = useAuth();

  // Toggler
  function showEditCourierHandler() {
    if (!user?.permissions.courier.edit) {
      notifyWarrning('You do not have permission to edit couriers');
      return;
    }
    setNewName(data.name);
    setNewPrice(data.deliveryPrice);
    setShowEdit(!showEdit);
  }

  // Set default data to read from
  useEffect(() => {
    setCouriersData(data);
    setNewName(data.name);
  }, [data]);

  // Updates the current courier in the database
  async function updateCourierHandler() {
    try {
      if (!user?.permissions.courier.edit) {
        notifyWarrning('You do not have permission to edit couriers');
        return;
      }
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

  // Deletes the courier from the database
  async function removeCourierHandler() {
    try {
      if (!user?.permissions.courier.remove) {
        notifyWarrning('You do not have permission to remove couriers');
        return;
      }
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
      betterErrorLog('> Error deleting courier:', error);
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
        <form className="mainInputsContainer" action={updateCourierHandler}>
          <InputFieldBorderless
            customClass="courier-item-input"
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
            customClass="courier-item-input"
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
        <div className="displayColor" style={{ width: '100%' }}>
          <div className="grid-1-1 display-color-info-wrapper">
            <p className="colorText">{couriersData.name}</p>
            <p className="colorText">{couriersData.deliveryPrice} RSD</p>
          </div>
          <Button
            label="Delete"
            onClick={(e) => {
              e.stopPropagation();
              removeCourierHandler();
            }}
            className="deleteIcon"
          />
        </div>
      )}
    </div>
  );
}

export default CourierItem;
