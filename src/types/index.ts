interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: TPrice;
}

interface IProductItemsData {
  items: IProductItem[];
  preview: string | null;
  setItems(items: IProductItem[]): void;
  getItems(): IProductItem[];
  getItem(itemId: string): IProductItem;
}

interface IBasketData {
  items: IProductItem[];
  setItem(item: IProductItem): void;
  getItems(): IProductItem[];
  getItemsCount(): number;
  deleteItem(itemId: string): void;
  deleteAll(): void;
  getTotalPrice(): TPrice;
}

interface IOrder {
  payment: 'online' | 'offline';
  email: string;
  phone: string;
  address: string;
  total: TPrice;
  items: TOrderProductItem[];
  getOrder?(): IOrder;
}

type TPrice = number;

type TMainPageProductItem = Pick<IProductItem, 'category' | 'image' | 'title' | 'price'>;

type TBasketProductItem = Pick<IProductItem, 'title' | 'price'>;

type TOrderProductItem = Pick<IProductItem, 'id'>;

type TOrderAddress = Pick<IOrder, 'payment' | 'address'>;

type TOrderContacts = Pick<IOrder, 'phone' | 'email'>;

type TOrderSuccess = Pick<IOrder, 'total'>;