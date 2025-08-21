import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IPage {
  counter: HTMLElement;
  gallery: HTMLElement;
  locked: boolean;
}

export class Page extends Component<IPage> {
  protected _counter: HTMLElement;
  protected _gallery: HTMLElement;
  protected _basket: HTMLButtonElement;
  protected _wrapper: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._counter = this.container.querySelector('.header__basket-counter');
    this._gallery = this.container.querySelector('.gallery');
    this._basket = this.container.querySelector('.header__basket');
    this._wrapper = this.container.querySelector('.page__wrapper');

    this._basket.addEventListener('click', () => {
      events.emit('basket:open');
    })
  }

  set counter (value: unknown) {
    this.setText(this._counter, value);
  }

  set gallery(items: HTMLElement[]) {
    this._gallery.replaceChildren(...items);
  }

  locked(value: boolean) {
    if (value) {
      this._wrapper.classList.add('page__wrapper_locked');
    } else {
      this._wrapper.classList.remove('page__wrapper_locked');
    }
  }
}