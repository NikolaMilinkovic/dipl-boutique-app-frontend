import { useEffect, useRef, useState } from 'react';
import { SupplierTypes } from '../../../global/types';
import {
  notifyError,
  notifySuccess,
} from '../../../components/util-components/Notify';
import { betterErrorLog } from '../../../util-methods/log-methods';
import Button from '../../../components/util-components/Button';
import './supplierItem.scss';
import InputFieldBorderless from '../../../components/util-components/InputFieldBorderless';
import { useAuth } from '../../../store/auth-context';

function SupplierItem({ data }: { data: SupplierTypes }) {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [supplierData, setSupplierData] = useState<SupplierTypes>({
    _id: '',
    name: '',
  });
  const [newName, setNewName] = useState('');
  const [showEdit, setShowEdit] = useState<Boolean>(false);
  const { token } = useAuth();

  // Toggler
  function showEditColorHandler() {
    setNewName(data.name);
    setShowEdit(!showEdit);
  }

  // Set default data to read from
  useEffect(() => {
    setSupplierData(data);
    setNewName(data.name);
  }, [data]);

  // Updates the current color name in the database
  async function updateSupplierHandler() {
    try {
      if (newName.trim() === data.name) {
        setShowEdit(false);
        return;
      }
      if (newName.trim() === '') {
        notifyError('Dobavljač mora imati ime!');
        return;
      }

      const response = await fetch(`${apiUrl}/supplier/${supplierData._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: supplierData._id,
          name: newName,
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
      betterErrorLog('> Error updating the supplier:', error);
    }
  }

  // Deletes the color from the database
  async function removeSupplierHandler() {
    try {
      const response = await fetch(`${apiUrl}/supplier/${supplierData._id}`, {
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

      notifySuccess(`Dobavljač je uspešno obrisan`);
    } catch (error) {
      betterErrorLog('> Error deleting supplier:', error);
    }
  }

  if (supplierData === null) {
    return <></>;
  }

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (showEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showEdit]);

  return (
    <div className="SupplierItem" onClick={showEditColorHandler}>
      {showEdit ? (
        <form className="mainInputsContainer" action={updateSupplierHandler}>
          <InputFieldBorderless
            label="Supplier name"
            inputText={newName}
            setInputText={setNewName}
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
                showEditColorHandler();
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
          <p className="colorText">{supplierData.name}</p>
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

export default SupplierItem;
