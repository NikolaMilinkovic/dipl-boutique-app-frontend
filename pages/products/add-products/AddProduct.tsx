import React, { useEffect, useState } from 'react';
import './addProduct.scss';
import InputField from '../../../components/util-components/InputField';
import { PurseColorTypes, DressColorTypes } from '../../../global/types';
import Dropdown from '../../../components/dropdowns/dropdown';
import { useCategories } from '../../../store/categories-context';
import { useSuppliers } from '../../../store/suppliers-context';
import ImageInput from '../../../components/image-input/ImageInput';
import TextArea from '../../../components/util-components/TextArea';
import ColorAmountInput from '../../../components/color-inputs/ColorAmountInput';
import DressColor from '../../../models/DressColor';
import PurseColor from '../../../models/PurseColor';
import ColorsSelect from '../../../components/colors-select/ColorsSelect';
import Button from '../../../components/util-components/Button';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface NewProductData {
  name: string;
  active: boolean;
  category: string;
  stockType: string;
  price: number | string;
  colors: (DressColorTypes | PurseColorTypes)[];
  image: {
    uri: string;
    imageName: string;
  };
  description?: string;
  displayPriority: number | string;
  supplier?: string;
  totalStock?: number | string;
}

function AddProduct({ isExpanded, setIsExpanded }) {
  const { getCategoryDropdownItems } = useCategories();
  const { getSupplierDropdownItems } = useSuppliers();
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const [imageRerenderKey, setImageRerenderKey] = useState(0);
  const [selectedColors, setSelectedColors] = useState([]);
  const [product, setProduct] = useState<NewProductData>({
    name: '',
    active: true,
    category: '',
    stockType: 'Boja-Veličina-Količina',
    price: '',
    colors: [],
    image: {
      uri: '',
      imageName: '',
    },
    description: '',
    displayPriority: '',
    supplier: '',
    totalStock: '',
  });

  useEffect(() => {
    setProduct((prevProduct) => {
      const prevColors = prevProduct.colors;
      const selectedColorValues = selectedColors.map((option) => option);

      const stockTypeChanged =
        prevColors.length > 0 &&
        ((product.stockType === 'Boja-Veličina-Količina' &&
          !(prevColors[0] instanceof DressColor)) ||
          (product.stockType === 'Boja-Količina' &&
            !(prevColors[0] instanceof PurseColor)));

      if (stockTypeChanged) {
        const recreatedColors = selectedColorValues.map((colorValue) => {
          if (product.stockType === 'Boja-Veličina-Količina') {
            const d = new DressColor();
            d.setColor(colorValue);
            return d;
          }
          if (product.stockType === 'Boja-Količina') {
            const p = new PurseColor();
            p.setColor(colorValue);
            return p;
          }
          const d = new DressColor();
          d.setColor(colorValue);
          return d;
        });

        return {
          ...prevProduct,
          colors: recreatedColors,
        };
      }

      // Normal flow: Filter out colors no longer selected
      const updatedColors = prevColors.filter((c: any) =>
        selectedColorValues.includes(c.color),
      );

      // Create new color objects for newly selected colors
      const newColors = selectedColorValues
        .filter(
          (colorValue) => !prevColors.some((c: any) => c.color === colorValue),
        )
        .map((colorValue) => {
          if (product.stockType === 'Boja-Veličina-Količina') {
            const d = new DressColor();
            d.setColor(colorValue);
            return d;
          }
          if (product.stockType === 'Boja-Količina') {
            const p = new PurseColor();
            p.setColor(colorValue);
            return p;
          }
          // fallback DressColor
          const d = new DressColor();
          d.setColor(colorValue);
          return d;
        });

      return {
        ...prevProduct,
        colors: [...updatedColors, ...newColors],
      };
    });
  }, [selectedColors, product.stockType]);

  const categoryDropdownItems = getCategoryDropdownItems();
  const supplierDropdownItems = getSupplierDropdownItems();

  return (
    <section
      className="add-product-section"
      style={{
        width: isExpanded ? '100vw' : '50vw',
      }}
    >
      {isExpanded && <h2 style={{ margin: '0px' }}>Add new product</h2>}
      <div className={isExpanded ? 'grid-1-1 gap-1' : ''}>
        <div>
          {!isExpanded && <h2>Add new product</h2>}
          <div className="grid-1-1 gap-1">
            {/* Slika */}
            <ImageInput
              reference={imageInputRef}
              rerenderkey={imageRerenderKey}
              product={product}
              onImageUpload={(img) => {
                setProduct((prev) => ({
                  ...prev,
                  image: img,
                }));
              }}
            />

            <div className="data-container">
              {/* Naziv */}
              <InputField
                label="Product name"
                inputText={product.name}
                setInputText={(value) =>
                  setProduct((prev) => ({ ...prev, name: value as string }))
                }
                showClearBtn={true}
                backgroundColor="var(--primaryLight)"
              />

              {/* Cena */}
              <InputField
                label="Price"
                inputText={product.price as any}
                setInputText={(value) =>
                  setProduct((prev) => ({ ...prev, price: value as any }))
                }
                showClearBtn={true}
                backgroundColor="var(--primaryLight)"
              />

              {/* Dobavljac */}
              <Dropdown
                options={supplierDropdownItems}
                onSelect={(value) =>
                  setProduct((prev) => ({ ...prev, stockType: value }))
                }
                // NOTE -> Uzeti iz settings korisnika
                defaultValue={{
                  value: '',
                  label: 'Supplier',
                }}
                onResetText="Supplier"
              />

              {/* Opis */}
              <TextArea
                label="Description"
                inputText={product.description as string}
                setInputText={(value) =>
                  setProduct((prev) => ({
                    ...prev,
                    description: value as string,
                  }))
                }
                showClearBtn={true}
                backgroundColor="var(--primaryLight)"
              />

              {/* Kategorija */}
              <Dropdown
                options={categoryDropdownItems}
                onSelect={(value) =>
                  setProduct((prev) => ({ ...prev, stockType: value }))
                }
                // NOTE -> Uzeti iz settings korisnika
                defaultValue={{
                  value: 'Boja-Veličina-Količina',
                  label: 'Haljina',
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="flex-column gap-1"
          style={{ marginTop: isExpanded ? '' : '1rem' }}
        >
          <ColorsSelect
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
          />
          {/* Boje | Velicina | Kolicina lagera */}
          {product && product.colors && product.colors.length > 0 && (
            <ColorAmountInput
              stockType={product.stockType}
              colors={product.colors}
              setColors={(newColors) =>
                setProduct((prev) => ({ ...prev, colors: newColors }))
              }
            />
          )}
          {/* BTN */}
          <div style={{ marginTop: 'auto' }}>
            <Button label="Add product" type="button" onClick={() => {}} />
          </div>
        </div>
      </div>

      <button
        className="add-product-toggle-width-btn"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
      </button>
    </section>
  );
}

export default AddProduct;
