import React, { useEffect, useState } from 'react';
import './productEditModal.scss';
import { ProductTypes } from '../../global/types';
import { MdClose } from 'react-icons/md';
import ButtonClose from '../util-components/ButtonClose';
import Button from '../util-components/Button';
import ImageInput from '../../components/image-input/ImageInput';
import InputField from '../util-components/InputField';
import Dropdown from '../dropdowns/Dropdown';
import { useSuppliers } from '../../store/suppliers-context';
import { useCategories } from '../../store/categories-context';
import TextArea from '../util-components/TextArea';
import ColorsSelect from '../colors-select/ColorsSelect';
import ColorAmountInput from '../color-inputs/ColorAmountInput';
import DressColor from '../../models/DressColor';
import PurseColor from '../../models/PurseColor';
import { notifyWarrning } from '../util-components/Notify';

interface ProductEditModalTypes {
  data: any;
  isVisible: boolean;
  onConfirm: (editedProduct: ProductTypes) => void;
  onCancel: () => void;
}

function ProductEditModal({
  data,
  isVisible,
  onConfirm,
  onCancel,
}: ProductEditModalTypes) {
  const [editedData, setEditedData] = useState(data);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const [imageRerenderKey, setImageRerenderKey] = useState(0);
  const { getSupplierDropdownItems } = useSuppliers();
  const { getCategoryDropdownItems } = useCategories();
  const supplierDropdownItems = getSupplierDropdownItems();
  const categoryDropdownItems = getCategoryDropdownItems();
  const [selectedColors, setSelectedColors] = useState(
    data.colors.map((color) => color.color),
  );

  useEffect(() => {
    const supplierData = supplierDropdownItems.find(
      (supplier) => supplier.value === editedData.supplier,
    );

    const categoryData = categoryDropdownItems.find(
      (category) => category.label === editedData.category,
    );

    setEditedData((prev) => ({
      ...prev,
      supplier: supplierData || prev.supplier,
      category: categoryData || prev.category,
    }));

    setSelectedColors(data.colors.map((color) => color.color));
  }, []);

  useEffect(() => {
    setEditedData((prevData) => {
      const prevColors = prevData.colors;

      // Keep existing color objects that are still selected
      const existingColors = prevColors.filter((existingColor) =>
        selectedColors.includes(existingColor.color),
      );

      // Create new color objects for any new selections
      const newColors = selectedColors
        .filter((color) => !existingColors.some((ec) => ec.color === color))
        .map((color) => {
          if (prevData.stockType === 'Boja-Veličina-Količina') {
            const d = new DressColor();
            d.setColor(color);
            return d;
          }
          if (prevData.stockType === 'Boja-Količina') {
            const p = new PurseColor();
            p.setColor(color);
            return p;
          }
          return null;
        })
        .filter(Boolean);

      return {
        ...prevData,
        colors: [...existingColors, ...newColors],
      };
    });
  }, [selectedColors, editedData.stockType]);

  function handleConfirm() {
    onConfirm(editedData);
  }

  if (!isVisible) return null;
  return (
    <div className="modal-edit-product-overlay fade" onClick={onCancel}>
      <div
        className="modal-edit-product-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-edit-product-header">
          <h2>Edit {data.name}</h2>
          <ButtonClose
            onClick={onCancel}
            label={<MdClose size={24} />}
            className="btn-edit-product-close"
          />
        </div>
        <hr />

        {/* DATA INPUTS */}
        <section className="modal-edit-product-data-input-container">
          <div className="modal-edit-product-basic-product-information-container">
            {/* Slika */}
            <ImageInput
              reference={imageInputRef}
              rerenderkey={imageRerenderKey}
              product={editedData}
              onImageUpload={(img) => {
                setEditedData((prev) => ({
                  ...prev,
                  image: img,
                }));
              }}
            />
            <div className="modal-edit-product-basic-product-information-inputs">
              {/* Naziv */}
              <InputField
                label="Product name"
                inputText={editedData.name}
                setInputText={(value) =>
                  setEditedData((prev) => ({ ...prev, name: value as string }))
                }
                showClearBtn={true}
                backgroundColor="var(--white)"
              />

              {/* Cena */}
              <InputField
                label="Price"
                inputText={editedData.price as any}
                setInputText={(value) =>
                  setEditedData((prev) => ({ ...prev, price: value as any }))
                }
                showClearBtn={true}
                backgroundColor="var(--white)"
              />

              {/* Dobavljac */}
              <Dropdown
                options={supplierDropdownItems}
                value={editedData.supplier}
                onSelect={(option) =>
                  setEditedData((prev) => ({ ...prev, supplier: option }))
                }
                onResetText="Supplier"
              />

              {/* Opis */}
              <TextArea
                label="Description"
                inputText={editedData.description as string}
                setInputText={(value) =>
                  setEditedData((prev) => ({
                    ...prev,
                    description: value as string,
                  }))
                }
                showClearBtn={true}
                backgroundColor="var(--white)"
              />

              {/* Kategorija */}
              <Dropdown
                options={categoryDropdownItems}
                onSelect={({ value, label }) => {
                  if (editedData.stockType !== value) {
                    notifyWarrning('Stock type of product must be the same.');
                    return;
                  }
                  setEditedData((prev) => ({
                    ...prev,
                    stockType: value,
                    category: { value, label },
                  }));
                }}
                value={editedData.category}
              />
            </div>
            <div>
              <ColorsSelect
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                backgroundColor="var(--white)"
              />
              {/* Boje | Velicina | Kolicina lagera */}
            </div>
          </div>
          {editedData && editedData.colors && editedData.colors.length > 0 && (
            <ColorAmountInput
              stockType={editedData.stockType}
              colors={editedData.colors}
              setColors={(newColors) =>
                setEditedData((prev) => ({ ...prev, colors: newColors }))
              }
            />
          )}
          {/* BUTTONS */}
          <div className="modal-edit-product-buttons-container">
            <Button label="Update product" onClick={handleConfirm} />
            <Button label="Cancel" onClick={onCancel} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductEditModal;
