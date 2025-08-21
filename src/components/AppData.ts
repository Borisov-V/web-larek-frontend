import { IProductItem, IProductItemsData, IBasketData, IOrderData, TPrice, TPayment, TFormErrors, IBasketOrder } from "../types";
import { IEvents } from "./base/events";

export class ProductItemsData implements IProductItemsData {
  items: IProductItem[];
  preview: string | null;
  protected events: IEvents;

  constructor(events: IEvents){
    this.items = [];
    this.preview = null;
    this.events = events;
  }

  setItems(items: IProductItem[]): void {
    this.items = items;
    this.events.emit('items:changed');
  }

  getItems(): IProductItem[] {
    return this.items;
  }

  getItem(itemId: string): IProductItem {
    return this.items.find(item => {
      if (item.id === itemId) return true;
  })
  }

  setPreview(item: IProductItem): void {
    this.preview = item.id;
    this.events.emit('preview:changed');
  }
}

export class BasketData implements IBasketData {
  items: IProductItem[];
  events: IEvents;

  constructor(events: IEvents) {
    this.items = [];
    this.events = events;
  }

  addItem(item: IProductItem): void {
    if (!this.items.includes(item)) {
      this.items.push(item);
      this.events.emit('basket:changed');
    }
  }

  hasItem(item: IProductItem): boolean {
    return this.items.includes(item);
  }

  getItems(): IProductItem[] {
    return this.items;
  }

  getItemsCount(): number {
    return this.items.length;
  }

  deleteItem(itemId: string): void {
    this.items = this.items.filter(item => {
      return item.id !== itemId;
    })

    this.events.emit('basket:changed');
  }

  reset(): void {
    this.items = [];

    this.events.emit('basket:changed');
  }

  getTotalPrice(): TPrice {
    return this.items.reduce((total, item) => {
      return item.price + total;
    }, 0)
  }

  getOrder(): IBasketOrder {
    const items = this.getItems().map(item => {
      return item.id;
    })

    return {
      items: items,
      total: this.getTotalPrice(),
    }
  }
}


export class OrderData implements IOrderData {
  protected _payment: TPayment;
  protected _email: string;
  protected _phone: string;
  protected _address: string;
  formErrors: TFormErrors;
  events: IEvents;

  constructor(events: IEvents) {
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
    this.formErrors = {};
    this.events = events;
  }

  set payment(value: TPayment) {
    this._payment = value;
    this.events.emit('order:changed');
  }

  get payment() {
    return this._payment;
  }

  set email(value:string) {
    this._email = value;
    this.events.emit('order:changed');
  }

  get email() {
    return this._email;
  }

  set phone(value: string) {
    this._phone = value;
    this.events.emit('order:changed');
  }

  get phone() {
    return this._phone;
  }

  set address(value: string) {
    this._address = value;
    this.events.emit('order:changed');
  }

  get address() {
    return this._address;
  }

  private validateAddress(errors: typeof this.formErrors) {
      if (this._payment === null) {
        errors.payment = 'Необходимо выбрать способ оплаты';
      }
      if (this._address === '') {
        errors.address = 'Необходимо указать адрес';
      }
  }

  private validateContacts(errors: typeof this.formErrors) {
      if (this._email === '') {
        errors.email = 'Необходимо указать Email';
      }
      if (this._phone === '') {
        errors.phone = 'Необходимо указать телефон';
      }
  }

  validateOrder(formName: string): boolean {
    const errors: typeof this.formErrors = {};

    if (formName === 'address') {
      this.validateAddress(errors);
    }

    if (formName === 'contacts') {
      this.validateContacts(errors);
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;

  }

  setData(data: Partial<IOrderData>) {
    Object.assign(this, data);
  }

  getOrder(): IOrderData {
    return {
      payment: this._payment,
      address: this._address,
      email: this._email,
      phone: this._phone,
    }
  }

  reset(): void {
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
    this.formErrors = {};
  }
}