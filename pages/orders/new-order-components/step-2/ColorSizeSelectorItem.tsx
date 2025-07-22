import './colorSizeSelectorItem.scss';
import { useEffect, useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import {
  DressColorTypes,
  Product,
  PurseColorTypes,
  RadioButtonOption,
} from '../../../../global/types';
import { notifyError } from '../../../../components/util-components/Notify';
import RadioButtonsGroup from '../../../../components/radio-buttons/RadioButtonsGroup';

interface PropTypes {
  product: Product;
  index: number;
  updateProductColorByIndexHandler: any;
  updateProductSizeByIndexHandler: any;
}

function ColorSizeSelectorItem({
  product,
  index,
  updateProductColorByIndexHandler,
  updateProductSizeByIndexHandler,
}: PropTypes) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [productColors, setProductColors] = useState<
    (DressColorTypes | PurseColorTypes)[]
  >([]);
  const [selectedColorObj, setSelectedColorObj] =
    useState<DressColorTypes | null>(null);
  const [colorButtons, setColorButtons] = useState<RadioButtonOption[]>([]);
  const [sizeButtons, setSizeButtons] = useState<RadioButtonOption[]>([]);

  useEffect(() => {
    const hasSize = product.stockType === 'Boja-Veličina-Količina';
    const isReady = product.selectedColor && (!hasSize || product.selectedSize);

    if (isReady) {
      setIsExpanded(false);
    }
  }, [product.selectedColor, product.selectedSize]);

  // Parse available product colors based on stock values
  useEffect(() => {
    if (!product) return notifyError('Product is missing!');
    if (!product.itemReference)
      return notifyError('Product reference is missing!');
    function isDressColorType(
      color: DressColorTypes | PurseColorTypes,
    ): color is DressColorTypes {
      return 'sizes' in color;
    }

    if (product.stockType === 'Boja-Veličina-Količina') {
      const filtered = product.itemReference.colors.filter(
        (color) =>
          isDressColorType(color) &&
          color.sizes.some((size) => Number(size.stock) > 0),
      );
      setProductColors(filtered);
    } else if (product.stockType === 'Boja-Količina') {
      const filtered = product.itemReference.colors.filter(
        (color): color is PurseColorTypes =>
          'stock' in color && Number(color.stock) > 0,
      );
      setProductColors(filtered);
    }
  }, [product]);

  // Create color options once available colors are parsed
  useEffect(() => {
    const colorOptions = productColors.map((color) => ({
      id: color._id,
      label: color.color,
      value: color._id,
    }));
    setColorButtons(colorOptions);
  }, [productColors]);

  // Parse size options based on available size stock
  useEffect(() => {
    if (!product.itemReference)
      return notifyError('Product reference is missing!');
    if (
      product.itemReference.stockType !== 'Boja-Količina' &&
      product.selectedColor
    ) {
      const colorObj = product.itemReference.colors.find(
        (c) => c.color === product.selectedColor,
      ) as DressColorTypes;

      // Create size options
      setSelectedColorObj(colorObj);
      if (colorObj) {
        const sizeOptions = colorObj.sizes
          .filter((s) => Number(s.stock) > 0)
          .map((s) => ({
            id: s._id,
            label: s.size,
            value: s._id,
          }));
        setSizeButtons(sizeOptions);
      }
    }
  }, [product.selectedColor]);

  const handleColorSelect = (id: string) => {
    if (!product.itemReference)
      return notifyError('Product reference is missing!');
    const colorObj = product.itemReference.colors.find((c) => c._id === id);
    if (colorObj) {
      setSelectedColorObj(colorObj as DressColorTypes);
      updateProductColorByIndexHandler(index, colorObj);
      if ('selectedSize' in product) {
        updateProductSizeByIndexHandler(index, { _id: '', size: '' });
      }
    }
  };

  const handleSizeSelect = (id: string) => {
    if (selectedColorObj && 'selectedSize' in product) {
      const sizeObj = selectedColorObj.sizes.find((s) => s._id === id);
      if (sizeObj) updateProductSizeByIndexHandler(index, sizeObj);
    }
  };

  if (!product.itemReference) return;
  return (
    <div className={`css-container ${isExpanded ? 'expanded' : ''}`}>
      {/* HEADER */}
      <div
        className={`css-header ${
          product.stockType === 'Boja-Količina'
            ? !product.selectedColor && 'css-missing'
            : (!product.selectedColor || !product.selectedSize) && 'css-missing'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="css-header-title">{product.itemReference.name}</span>
        {isExpanded ? (
          <MdExpandLess className="css-icon" size={24} />
        ) : (
          <MdExpandMore className="css-icon" size={24} />
        )}
      </div>

      {/* BODY */}
      {isExpanded && (
        <div className="css-body">
          {/* COLOR PICKER */}
          <div className="css-group">
            <div className="css-group-label">Boja</div>
            <RadioButtonsGroup
              radioButtons={colorButtons}
              onSelect={handleColorSelect}
              selectedId={product.selectedColorId}
            />
          </div>

          {/* SIZE PICKER */}
          {product.selectedColor &&
            product.itemReference.stockType !== 'Boja-Količina' && (
              <div className="css-group">
                <div className="css-group-label">Veličina</div>
                <RadioButtonsGroup
                  radioButtons={sizeButtons}
                  onSelect={handleSizeSelect}
                  selectedId={product.selectedSizeId}
                />
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default ColorSizeSelectorItem;
