import { useEffect, useRef, useState } from 'react';
import { CategoryTypes, ColorTypes } from '../../../global/types';
import {
  notifyError,
  notifySuccess,
} from '../../../components/util-components/Notify';
import { betterErrorLog } from '../../../util-methods/log-methods';
import Button from '../../../components/util-components/Button';
import InputFieldBorderless from '../../../components/util-components/InputFieldBorderless';
import './categoryItem.scss';
import { useAuth } from '../../../store/auth-context';

function CategoryItem({ data }: { data: CategoryTypes }) {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [categoryData, setCategoryData] = useState<CategoryTypes>({
    _id: '',
    name: '',
    stockType: '',
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
    setCategoryData(data);
    setNewName(data.name);
  }, [data]);

  // Updates the current color name in the database
  async function updateCategoryHandler() {
    try {
      if (newName.trim() === data.name) {
        setShowEdit(false);
        return;
      }
      if (newName.trim() === '') {
        notifyError('Kategorija mora imati ime!');
        return;
      }

      const response = await fetch(`${apiUrl}/category/${categoryData._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: categoryData._id,
          name: newName,
          stockType: categoryData.stockType,
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
  async function removeCategoryHandler() {
    try {
      const response = await fetch(`${apiUrl}/category/${categoryData._id}`, {
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

      notifySuccess(`Kategorija je uspešno obrisana`);
    } catch (error) {
      betterErrorLog('> Error deleting category:', error);
    }
  }

  if (categoryData === null) {
    return <></>;
  }

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (showEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showEdit]);

  return (
    <div className="categorItemStyles" onClick={showEditColorHandler}>
      {showEdit ? (
        <form className="mainInputsContainer" action={updateCategoryHandler}>
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
          <p className="colorText">{categoryData.name}</p>
          <p className="colorText" style={{ marginLeft: 'auto' }}>
            {categoryData.stockType}
          </p>
          <Button
            label="Delete"
            onClick={(e) => {
              e.stopPropagation();
              removeCategoryHandler();
            }}
            className="deleteIcon"
          />
        </div>
      )}
    </div>
  );
}

export default CategoryItem;
