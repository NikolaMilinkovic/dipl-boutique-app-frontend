import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import {
  ColorSizeTypes,
  DressColorTypes,
  NewOrderData,
  Product,
  ProductTypes,
  PurseColorTypes,
} from '../global/types';
import {
  notifySuccess,
  notifyWarrning,
} from '../components/util-components/Notify';

interface NewOrderContextType {
  newOrderData: NewOrderData;
  setNewOrderData: React.Dispatch<React.SetStateAction<NewOrderData>>;
  createOrderHandler: () => FormData | void;
  setProductsDataHandler: (productsArr: Product[]) => void;
  addProductHandler: (product: Product) => void;
  removeProductByIndexHandler: (index: number) => void;
  updateProductColorByIndexHandler: (
    index: number,
    selectedColorObj: DressColorTypes | PurseColorTypes,
  ) => void;
  updateProductSizeByIndexHandler: (
    index: number,
    selectedSizeObj: { _id: string; size: string },
  ) => void;
  resetOrderDataHandler: () => void;
}

interface ContextChildrenTypes {
  children: ReactNode;
}

export const NewOrderContext = createContext<NewOrderContextType | null>(null);

export function NewOrderContextProvider({ children }: ContextChildrenTypes) {
  const [newOrderData, setNewOrderData] = useState<NewOrderData>({
    buyer: {
      name: '',
      address: '',
      place: '',
      phone: '',
      phone2: '',
      bankNumber: '',
      profileImage: null,
    },
    products: [],
    productsPrice: 0,
    totalPrice: 0,
    value: 0,
    reservation: false,
    packedIndicator: false,
    packed: false,
    processed: false,
    courier: {
      name: '',
      deliveryPrice: 0,
    },
    weight: '',
    internalRemark: '',
    deliveryRemark: '',
    orderNotes: '',
    reservationDate: null,
  });

  // Check to see if all products have selectedColor & selectedSize where applicable
  function validateProductData() {
    const isValid = newOrderData.products.every((product) => {
      const hasSelectedColor =
        product.selectedColor !== undefined && product.selectedColor !== '';
      const hasSelectedSize =
        product.selectedSize !== undefined ? product.selectedSize !== '' : true;

      return hasSelectedColor && hasSelectedSize;
    });
    return isValid;
  }

  // Validates all inputs | Creates a new form, prepares all data and returns the form
  // Used for sending the data back to server
  function createOrderHandler() {
    if (newOrderData.products.length === 0)
      return notifyWarrning('Nedostaju podaci o proizvodima');
    if (!newOrderData.buyer) return notifyWarrning('Nedostaju podaci o kupcu');
    if (!newOrderData.buyer.address)
      return notifyWarrning('Nedostaju podaci o adresi');
    if (!newOrderData.buyer.name)
      return notifyWarrning('Nedostaju podaci o imenu');
    if (!newOrderData.buyer.phone && !newOrderData.buyer.phone2)
      return notifyWarrning('Nedostaju podaci o broju telefona');
    if (!newOrderData.buyer.place)
      return notifyWarrning('Nedostaju podaci o mestu');
    if (!newOrderData.courier.name)
      return notifyWarrning('Nedostaju podaci o kuriru');
    if (!newOrderData.courier.deliveryPrice)
      return notifyWarrning('Nedostaju podaci o kuriru');
    if (!newOrderData.buyer.profileImage)
      return notifyWarrning('Nedostaje slika kupčevog profila');
    if (!validateProductData())
      return notifyWarrning(
        'Svi proizvodi moraju imati selektovane boje i veličine',
      );

    const price = calculatePriceHandler();
    if (!price) return notifyWarrning('Nije moguće izračunati cenu');

    const appendIfDefined = (fd: FormData, key: string, value: any) => {
      if (value !== undefined && value !== null) {
        fd.append(
          key,
          typeof value === 'object' ? JSON.stringify(value) : String(value),
        );
      }
    };

    const order = new FormData();
    appendIfDefined(order, 'buyerData', newOrderData.buyer);
    appendIfDefined(order, 'productData', newOrderData.products);
    appendIfDefined(order, 'productsPrice', price.productsPrice);
    appendIfDefined(order, 'totalPrice', price.totalPrice);
    appendIfDefined(order, 'reservation', newOrderData.reservation);
    appendIfDefined(
      order,
      'reservationDate',
      newOrderData.reservation
        ? newOrderData.reservationDate?.toISOString()
        : null,
    );
    appendIfDefined(order, 'packedIndicator', newOrderData.packedIndicator);
    appendIfDefined(order, 'packed', newOrderData.packed);
    appendIfDefined(order, 'processed', newOrderData.processed);
    appendIfDefined(order, 'value', newOrderData.value);
    appendIfDefined(order, 'weight', newOrderData.weight);
    appendIfDefined(order, 'internalRemark', newOrderData.internalRemark);
    appendIfDefined(order, 'deliveryRemark', newOrderData.deliveryRemark);
    appendIfDefined(order, 'courier', newOrderData.courier);
    appendIfDefined(order, 'orderNotes', newOrderData.orderNotes);
    order.append('image', newOrderData.buyer.profileImage as File);

    return order;
  }

  function calculatePriceHandler() {
    if (
      newOrderData.products.length > 0 &&
      newOrderData.courier?.deliveryPrice
    ) {
      const productsPrice = newOrderData.products
        .map((item) => item.price)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

      const deliveryPrice = newOrderData.courier.deliveryPrice;

      let totalPrice;
      totalPrice = productsPrice + deliveryPrice;

      return {
        productsPrice: productsPrice,
        deliveryPrice: deliveryPrice,
        totalPrice: totalPrice,
      };
    }
  }

  // PRODUCTS
  const setProductsDataHandler = (productsArr: Product[]) => {
    setNewOrderData((prev) => ({
      ...prev,
      products: productsArr,
    }));
  };

  const addProductHandler = (product: ProductTypes) => {
    function getMondoDBType(stockType: string) {
      if (stockType === 'Boja-Veličina-Količina') return 'Dress';
      return 'Purse';
    }
    const fullProduct: Product = {
      category: product.category ?? '',
      image: product.image ?? { imageName: '', uri: '' },
      itemReference: product ?? null,
      mongoDB_type: getMondoDBType(product.stockType),
      name: product.name ?? '',
      price: product.price ?? 0,
      selectedColor: '',
      selectedColorId: '',
      selectedSize: '',
      selectedSizeId: '',
      stockType: product.stockType ?? '',
    };

    setNewOrderData((prev) => ({
      ...prev,
      products: [...prev.products, fullProduct],
    }));
    notifySuccess(
      `${product.name} added to the order. Current number of orders: ${newOrderData.products.length + 1}`,
    );
  };

  const removeProductByIndexHandler = (index: number) => {
    setNewOrderData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };
  const updateProductColorByIndexHandler = (
    index: number,
    selectedColorObj: DressColorTypes | PurseColorTypes,
  ) => {
    setNewOrderData((prev) => {
      const updatedProducts = [...prev.products];
      if (updatedProducts[index]) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          selectedColor: selectedColorObj.color,
          selectedColorId: selectedColorObj._id,
        };
      }
      return {
        ...prev,
        products: updatedProducts,
      };
    });
  };
  const updateProductSizeByIndexHandler = (
    index: number,
    selectedSizeObj: { _id: string; size: string },
  ) => {
    setNewOrderData((prev) => {
      const updatedProducts = [...prev.products];
      if (updatedProducts[index]) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          selectedSize: selectedSizeObj.size,
          selectedSizeId: selectedSizeObj._id,
        };
      }
      return {
        ...prev,
        products: updatedProducts,
      };
    });
  };

  const resetOrderDataHandler = () => {
    setNewOrderData({
      buyer: {
        name: '',
        address: '',
        place: '',
        phone: '',
        phone2: '',
        bankNumber: '',
        profileImage: null,
      },
      products: [
        {
          category: '',
          image: {
            imageName: '',
            uri: '',
          },
          itemReference: null,
          mongoDB_type: 'Dress',
          name: '',
          price: 0,
          selectedColor: '',
          selectedColorId: '',
          selectedSize: '',
          selectedSizeId: '',
          stockType: '',
        },
      ],
      productsPrice: 0,
      totalPrice: 0,
      value: 0,
      reservation: false,
      packedIndicator: false,
      packed: false,
      processed: false,
      courier: {
        name: '',
        deliveryPrice: 0,
      },
      weight: '',
      internalRemark: '',
      deliveryRemark: '',
      orderNotes: '',
      reservationDate: null,
    });
  };

  const value = useMemo(
    () => ({
      newOrderData,
      setNewOrderData,
      createOrderHandler,
      setProductsDataHandler,
      addProductHandler,
      removeProductByIndexHandler,
      updateProductColorByIndexHandler,
      updateProductSizeByIndexHandler,
      resetOrderDataHandler,
    }),
    [newOrderData],
  );

  return (
    <NewOrderContext.Provider value={value}>
      {children}
    </NewOrderContext.Provider>
  );
}

export function useNewOrder() {
  const context = useContext(NewOrderContext);
  if (!context)
    throw new Error('useNewOrder must be used within NewOrderContextProvider');
  return context;
}
