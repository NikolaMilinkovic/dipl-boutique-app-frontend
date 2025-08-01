import { useEffect, useRef, useState } from 'react';
import { ColorTypes } from '../../../global/types';
import {
  notifyError,
  notifySuccess,
  notifyWarrning,
} from '../../../components/util-components/Notify';
import { betterErrorLog } from '../../../util-methods/log-methods';
import Button from '../../../components/util-components/Button';
import './ColorItem.scss';
import InputFieldBorderless from '../../../components/util-components/InputFieldBorderless';
import { useAuth } from '../../../store/auth-context';
import { useUser } from '../../../store/user-context';

function ColorItem({ data }: { data: ColorTypes }) {
  const { user } = useUser();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [colorData, setColorData] = useState<ColorTypes>({
    _id: '',
    name: '',
    colorCode: '',
  });
  const [newName, setNewName] = useState('');
  const [showEdit, setShowEdit] = useState<Boolean>(false);
  const { token } = useAuth();

  // Toggler
  function showEditColorHandler() {
    if (!user?.permissions.color.edit) {
      notifyWarrning('You do not have permission to edit colors');
      return;
    }
    setNewName(data.name);
    setShowEdit(!showEdit);
  }

  // Set default data to read from
  useEffect(() => {
    setColorData(data);
    setNewName(data.name);
  }, [data]);

  // Updates the current color name in the database
  async function updateColorHandler() {
    try {
      if (!user?.permissions.color.edit) {
        notifyWarrning('You do not have permission to edit colors');
        return;
      }
      if (newName.trim() === data.name) {
        setShowEdit(false);
        return;
      }
      if (newName.trim() === '') {
        notifyError('Boja mora imati ime!');
        return;
      }

      const response = await fetch(`${apiUrl}/colors/${colorData._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: colorData._id,
          name: newName,
          colorCode: colorData.colorCode,
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
      betterErrorLog('> Error updating the color:', error);
    }
  }

  // Deletes the color from the database
  async function removeColorHandler() {
    try {
      if (!user?.permissions.color.remove) {
        notifyWarrning('You do not have permission to edit colors');
        return;
      }
      const response = await fetch(`${apiUrl}/colors/${colorData._id}`, {
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

      notifySuccess(`Boja je uspesno obrisana`);
    } catch (error) {
      betterErrorLog('> Error deleting color:', error);
    }
  }

  if (colorData === null) {
    return <></>;
  }

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (showEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showEdit]);

  return (
    <div className="colorItem" onClick={showEditColorHandler}>
      {showEdit ? (
        <form className="mainInputsContainer" action={updateColorHandler}>
          <InputFieldBorderless
            label="Color name"
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
          <p className="colorText">{colorData.name}</p>
          <Button
            label="Delete"
            onClick={(e) => {
              e.stopPropagation();
              removeColorHandler();
            }}
            className="deleteIcon"
          />
        </div>
      )}
    </div>
  );
}

export default ColorItem;
