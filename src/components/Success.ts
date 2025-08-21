import { TSuccess } from "../types";
import { Component } from "./base/Component"
import { IEvents } from "./base/events";

interface ISuccess extends TSuccess {
  title: string;
  button: string;
  total: number;
}

export class Success extends Component<ISuccess> {
  protected _title: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _total: HTMLElement;
  protected _events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._title = this.container.querySelector('.order-success__title');
    this._total = this.container.querySelector('.order-success__description');
    this._button = this.container.querySelector('.order-success__close');

    this._button.addEventListener('click', () => {
      events.emit('success:close');
    })
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set total(value: number) {
    const text = `Списано ${value} синапсов`
    this.setText(this._total, text);
  }
  
  set button(value: string) {
    this.setText(this._button, value);
  }
}