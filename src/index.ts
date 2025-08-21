import './scss/styles.scss';

import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { IOrderResponse, IProductItem, TOrderAddress, TOrderContacts, TPayment } from './types';
import { TOrder } from './types';
import { ProductItemsData, BasketData, OrderData } from './components/AppData';
import { Modal } from './components/Modal';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { Basket } from './components/Basket';
import { OrderForm } from './components/OrderForm';
import { Success } from './components/Success';

const api = new AppApi(CDN_URL, API_URL);
const events = new EventEmitter();

const productItemsData = new ProductItemsData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const formAddressTemplate = ensureElement<HTMLTemplateElement>('#order');
const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(ensureElement<HTMLElement>('.page'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const formAddress = new OrderForm(cloneTemplate(formAddressTemplate), events);
const formContacts = new OrderForm(cloneTemplate(formContactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

events.on('items:changed', () => {
	page.gallery = productItemsData.getItems().map((item: IProductItem) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick() {
				events.emit('card:open', item);
			},
		});

		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('card:open', (item: IProductItem) => {
	productItemsData.setPreview(item);
});

events.on('preview:changed', () => {
  const previewItem = productItemsData.getItem(productItemsData.preview);
	const hasItem = Boolean(basketData.hasItem(previewItem));

	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick() {
      if (!basketData.hasItem(previewItem)) {
        events.emit('card:select');
        card.button = 'Убрать';
      } else {
        events.emit('card:unselect', previewItem);
        card.button = 'В корзину';
      }
		},
	});

	modal.render({
		content: card.render({
			title: previewItem.title,
			image: previewItem.image,
			category: previewItem.category,
			price: previewItem.price,
			description: previewItem.description,
			button: hasItem ? 'Убрать' : 'В корзину',
		}),
	});
});

events.on('card:select', () => {
	const previewItem = productItemsData.getItem(productItemsData.preview);
	basketData.addItem(previewItem);
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('basket:changed', () => {
	page.counter = basketData.getItemsCount();

	basket.items = basketData.getItems().map((item) => {
		const cardBasket = new Card(cloneTemplate(cardBasketTemplate), {
			onClick() {
				events.emit('card:unselect', item);
			},
		});

		return cardBasket.render({
			title: item.title,
			price: item.price,
		});
	});

	basket.total = basketData.getTotalPrice();

  if (basketData.getItemsCount() < 1) {
    orderData.reset();
    formAddress.reset();
    formContacts.reset();
  }
});

events.on('card:unselect', (item: IProductItem) => {
	basketData.deleteItem(item.id);
});

events.on('basket:submit', () => {
  modal.render({
    content: formAddress.render()
  })
})

events.on('address:button', (data: Record<string, TPayment>) => {
  const payment = data.buttonName;
  orderData.payment = payment;
  
  formAddress.valid = orderData.validateOrder('address');
  formAddress.errors = Object.values(orderData.formErrors).join('; ');
})

events.on('address:input', (data: TOrderAddress) => {
  orderData.setData(data);
  
  formAddress.valid = orderData.validateOrder('address');
  formAddress.errors = Object.values(orderData.formErrors).join('; ');
})

events.on('address:submit', () => {
  modal.render({
    content: formContacts.render()
  })
})

events.on('contacts:input', (data: TOrderContacts) => {
  orderData.setData(data);
  
  formContacts.valid = orderData.validateOrder('contacts');
  formContacts.errors = Object.values(orderData.formErrors).join('; ');
})

events.on('contacts:submit', () => {
  const order: TOrder = {
    ...orderData.getOrder(),
    ...basketData.getOrder()
  }

  api.orderItems(order).then((data: IOrderResponse) => {
    events.emit('order:success', data);
  })
})

events.on('order:success', (data: IOrderResponse) => {
  modal.render({
    content: success.render({
      total: data.total
    })
  })

  orderData.reset();
  basketData.reset();
  formAddress.reset();
  formContacts.reset();
})

events.on('success:close', () => {
  modal.close();
})

events.on('order:changed', () => {
  formAddress.buttonActive = orderData.payment;
  formAddress.inputValues = {
    payment: orderData.payment,
    address: orderData.address
  }
  formContacts.inputValues = {
    email: orderData.email,
    phone: orderData.phone
  }
})

events.on('modal:open', () => {
	page.locked(true);
});

events.on('modal:closed', () => {
	page.locked(false);
});

api
	.getItems()
	.then((items) => {
		productItemsData.setItems(items);
	})
	.catch((err) => {
		console.error(err);
	});
