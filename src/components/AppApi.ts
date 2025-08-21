import {Api, ApiListResponse} from './base/api'
import { IProductItem, TOrder, IOrderResponse } from '../types'

export interface IAppApi {
  getItems(): Promise<IProductItem[]>;
  orderItems(order: TOrder): Promise<IOrderResponse>;
}

export class AppApi extends Api implements IAppApi {
  readonly cdn: string;

  constructor(cdn:string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getItems(): Promise<IProductItem[]> {
    return this.get('/product').then((data: ApiListResponse<IProductItem>) => {
      return data.items.map(item => {
        const image = item.image.replace(/\.svg$/, '.png');
        return {
          ...item,
          image: this.cdn + image
        }

      });
    })
  }

  orderItems(order: TOrder): Promise<IOrderResponse> {
    return this.post('/order', order).then((data: IOrderResponse) => {
      return data;
    })
  }
}