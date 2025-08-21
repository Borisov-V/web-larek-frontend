export interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: TPrice;
}

export interface IProductItemsData {
  items: IProductItem[];
  preview: string | null;
  setItems(items: IProductItem[]): void;
  getItems(): IProductItem[];
  getItem(itemId: string): IProductItem;
  setPreview(item: IProductItem): void;
}

export interface IBasketData {
  items: IProductItem[];
  addItem(item: IProductItem): void;
  getItems(): IProductItem[];
  getItemsCount(): number;
  deleteItem(itemId: string): void;
  reset(): void;
  getTotalPrice(): TPrice;
}

export interface IOrderData {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrderResponse {
  id: string;
  total: TPrice;
}

export interface IBasketOrder {
  total: TPrice;
  items: TOrderProductItem[];
}

export type TPrice = number;

export type TBasketProductItem = Pick<IProductItem, 'title' | 'price'>;

export type TOrderProductItem = string;

export type TOrderAddress = Pick<IOrderData, 'payment' | 'address'>;

export type TOrderContacts = Pick<IOrderData, 'phone' | 'email'>;

export type TPayment = 'card' | 'cash' | null;

export type TOrder = TOrderAddress & TOrderContacts & IBasketOrder;

export type TFormErrors = Partial<Record<keyof TOrderAddress | keyof TOrderContacts, string>>

export type TSuccess = Pick<IOrderResponse, 'total'>;