/* eslint-disable quotes */

// ENUMS
export const StockTypeValues = [
  'Boja-Veličina-Količina',
  'Boja-Količina',
] as const;
type StockTypes = (typeof StockTypeValues)[number];

// \ENUMS

export interface User {
  id: string;
  name: string;
  role: string;
}

export interface ColorTypes {
  _id?: string;
  name: string;
  colorCode: string;
}
export interface CategoryTypes {
  _id?: string;
  name: string;
  stockType: StockTypes;
}
export interface SupplierTypes {
  _id?: string;
  name: string;
}
export interface CourierTypes {
  _id?: string;
  name: string;
  deliveryPrice: number | string;
}

// DRESSES
export interface ImageTypes {
  uri: string;
  imageName: string;
}
export interface ColorSizeTypes {
  size: string;
  stock: string;
  _id: string;
}
export interface DressColorTypes {
  _id: string;
  color: string;
  colorCode: string;
  sizes: ColorSizeTypes[];
}
export interface DressTypes {
  _id: string;
  name: string;
  active: boolean;
  category: string;
  stockType: StockTypes;
  price: number;
  colors: DressColorTypes[];
  image: ImageTypes;
  description: string;
  displayPriority: number;
  supplier?: string;
  totalStock: number;
}

// PURSES
export interface PurseColorTypes {
  _id: string;
  color: string;
  colorCode: string;
  stock: number;
}
export interface PurseTypes {
  _id: string;
  name: string;
  active: boolean;
  category: string;
  stockType: StockTypes;
  price: number;
  colors: PurseColorTypes[];
  image: ImageTypes;
  description: string;
  displayPriority: number;
  supplier?: string;
  totalStock: number;
}

// PURSE & DRESS TYPE
export type ProductTypes = DressTypes | PurseTypes;

export interface ProductsBySuppliersTypes {
  [supplier: string]: (DressTypes | PurseTypes)[];
}
export interface ProductsByCategoryTypes {
  [cateogry: string]: (DressTypes | PurseTypes)[];
}

export interface SearchParamsTypes {
  available: boolean;
  soldOut: boolean;
  availableAndSoldOut: boolean;
  onCategorySearch: string;
  onSupplierSearch: string;
  onColorsSearch: string[];
  onSizeSearch: string[];
  active: boolean;
  inactive: boolean;
}

// NEW ORDER
interface ProfileImage {
  imageName: string;
  uri: string;
}

interface NewBuyerData {
  name: string;
  address: string;
  place: string;
  phone: string;
  phone2: string;
  bankNumber: string;
  profileImage: File | null;
}
interface Buyer {
  name: string;
  address: string;
  place: string;
  phone: string;
  phone2: string;
  bankNumber: string;
  profileImage: ProfileImage;
}

type MongoDBType = 'Dress' | 'Purse';

export interface Product {
  category: string;
  image: ProfileImage;
  itemReference: ProductTypes | null;
  mongoDB_type: MongoDBType;
  name: string;
  price: number;
  selectedColor: string;
  selectedColorId: string;
  selectedSize: string;
  selectedSizeId: string;
  stockType: StockTypes;
}

interface Courier {
  name: string;
  deliveryPrice: number;
}

export interface NewOrderData {
  buyer: NewBuyerData;
  products: Product[];
  productsPrice: number;
  totalPrice: number;
  value: number;
  reservation: boolean;
  packedIndicator: boolean;
  packed: boolean;
  processed: boolean;
  courier: Courier;
  weight: string;
  internalRemark: string;
  deliveryRemark: string;
  orderNotes: string;
  reservationDate: Date | null;
}
export interface RadioButtonOption {
  id: string;
  label: string;
  value: string;
}

export interface OrderTypes {
  _id: string;
  buyer: Buyer;
  courier: CourierTypes;
  products: ProductTypes[];
  productsPrice: number;
  totalPrice: number;
  reservation: boolean;
  packedIndicator: boolean;
  packed: boolean;
  processed: boolean;
  createdAt: string;
  updatedAt: string;
  value: string;
  weight: string;
  internalRemark: string;
  deliveryRemark: string;
  orderNotes: string;
  reservationDate: Date;
}

export interface Permission {
  add: boolean;
  edit: boolean;
  remove: boolean;
}

export interface NewUserTypes {
  username: string;
  password: string;
  role: string;
  permissions: {
    category: Permission;
    color: Permission;
    courier: Permission;
    supplier: Permission;
    order: Permission;
    product: Permission;
  };
}
