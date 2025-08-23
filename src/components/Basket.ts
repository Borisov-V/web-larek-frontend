import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IBasketView {
	total: HTMLElement;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _items: HTMLElement[];
	events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this._list = this.container.querySelector('.basket__list');
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
		this.items = [];

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('basket:submit');
			});
		}
	}

	protected indexing(): void{
		const indexList = Array.from(
			this._list.querySelectorAll('.basket__item-index')
		);

		if (indexList.length) {
			indexList.forEach((item: HTMLElement, index) => {
				this.setText(item, index + 1);
			});
		}
	}

	handleScrollStyles(){
		const scrollVisible = this._list.clientHeight < this._list.scrollHeight;

		if (scrollVisible) {
			this._list.classList.add('basket__list-scroll');
		} else {
			this._list.classList.add('basket__list-scroll');
		}
	}

	set items(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
		this.indexing();

    if (items.length) {
      this.setDisable(this._button, false);
    } else {
      this.setDisable(this._button, true);
    }
	}

	set total(value: number) {
		this.setText(this._total, value + ' синапсов');
	}
}
