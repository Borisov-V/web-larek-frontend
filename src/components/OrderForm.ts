import { Component } from './base/Component';
import { IEvents } from './base/events';

export interface IOrderForm {
	valid: boolean;
	inputValues: Record<string, string>;
	errors: string;
	buttonActive: string;
}

export class OrderForm extends Component<IOrderForm> {
	protected inputs: NodeListOf<HTMLInputElement>;
	protected buttons: NodeListOf<HTMLButtonElement>;
	protected formName: string;
	protected _errors: HTMLElement;
	protected _submit: HTMLButtonElement;
	protected events: IEvents;
	protected container: HTMLFormElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container);

		this.inputs = this.container.querySelectorAll('.form__input');
		this.buttons = this.container.querySelectorAll('button[type=button]');
		this._submit = this.container.querySelector('button[type=submit]');
		this.formName = this.container.getAttribute('name');
		this._errors = this.container.querySelector('.form__errors');
		this.events = events;

		this.container.addEventListener('submit', (event) => {
			event.preventDefault();
			this.events.emit(`${this.formName}:submit`);
		});

		this.container.addEventListener('click', (event: PointerEvent) => {
			const target = event.target as HTMLButtonElement;
			if (target.type === 'button') {
				const buttonName = target.name;
				this.events.emit(`${this.formName}:button`, {buttonName});
			}
		});

		this.container.addEventListener('input', (event: InputEvent) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit(`${this.formName}:input`, {[field]: value});
		});
	}

	protected getInputValues(): Record<string, string> {
		const values: Record<string, string> = {};

		this.inputs.forEach((item) => {
			values[item.name] = item.value;
		})

		return values;
	}

	set inputValues(data: Record<string, string>) {
		this.inputs.forEach(input => {
			input.value = data[input.name];
		})
	}

	set buttonActive(buttonName: string) {
		this.buttons.forEach(button => {
			if (button.name === buttonName) {
				button.classList.add('button_alt-active');
			} else {
				button.classList.remove('button_alt-active');
			}
		})
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	set valid(isValid: boolean) {
		this.setDisable(this._submit, !isValid);
	}

	reset(): void{
		this.container.reset()
		this.buttons.forEach(button => {
			button.classList.remove('button_alt-active');
		})
		this.valid = false;
	}
}
