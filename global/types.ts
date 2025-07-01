export interface ColorTypes {
  _id?: string;
  name: string;
  colorCode: string;
}
export interface CategoryTypes {
  _id?: string;
  name: string;
  stockType: string;
}
export interface SupplierTypes {
  _id?: string;
  name: string;
}
export interface CourierTypes {
  _id: string;
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
  stockType: string;
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
  stockType: string;
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
