import { TPrice } from '../types';
import { Component } from './base/Component';

export interface ICard {
	title: string;
	price: TPrice;
	button: string;
	image: string;
	description: string;
	category: string;
}

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _category: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = container.querySelector('.card__title');
		this._price = container.querySelector('.card__price');
		this._image = container.querySelector('.card__image');
		this._description = container.querySelector('.card__text');
		this._category = container.querySelector('.card__category');
		this._button = container.querySelector('.card__button');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		if (value) {
			this.setText(this._price, value + ' синапсов');
		} else {
			this.setText(this._price, 'Бесценно');
		}
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: string) {
		this.setText(this._category, value);

		switch (this._category.textContent) {
			case 'софт-скил':
				this._category.classList.add('card__category_soft');
				break;
			case 'хард-скил':
				this._category.classList.add('card__category_hard');
				break;
			case 'кнопка':
				this._category.classList.add('card__category_button');
				break;
			case 'дополнительное':
				this._category.classList.add('card__category_additional');
				break;
			case 'другое':
				this._category.classList.add('card__category_other');
				break;
		}
	}

	set button(value: string) {
		this.setText(this._button, value);
	}

	disableButton(value: boolean) {
		this.setDisable(this._button, value);
	}
}
