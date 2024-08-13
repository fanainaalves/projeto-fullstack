import { Injectable } from '@angular/core';

import { Order } from '../../order/model/order';
import { CardOrderService } from './card-order.service';

@Injectable({
  providedIn: 'root',
})
export class CartManagementService {
  constructor(private cardOrderService: CardOrderService) {}

  pullDataSessionStorage(): {
    userName: string | null;
    userId: string | null;
    orderData: any[];
  } {
    const sessionUserString: string | null =
      sessionStorage.getItem('session_user');
      console.log(sessionUserString);

    const cartItemsString: string | null =
      sessionStorage.getItem('session_card');
      console.log(cartItemsString);

    if (!cartItemsString) {
      console.log('O carrinho está vazio.');
      return { userName: null, userId: null, orderData: [] };
    }

    const userData = JSON.parse(sessionUserString || '{}');
    const userName = userData.name || '';
    const userId = userData.id || '';
    const product = cartItemsString


    const orderData = JSON.parse(cartItemsString || '');
    const productData = orderData.products.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      discount: product.discount
    }));

    return { userName, userId, orderData: productData };
  }

  checkout(sessionData: any, userName: any, userId: any) {
    if (!userName) {
      console.error('Nome do usuário não encontrado.');
      return;
    }

    const randomNotes = Math.floor(Math.random() * 4) + 3;

    const order: Order = {
      client: userName,
      userId: userId,
      orderItems: [],
      paymentInformation: 'Pedido Pagamento Efetuado',
      orderStatus: '2',
      paymentMethod: '',
      orderNotes: randomNotes.toString(),
      created: '',
      updated: '',
    };

    if (sessionData.orderItems) {
      order.orderItems = sessionData.orderItems.map((item: any) => ({
        idProduct: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount,

      }));
    }

    console.log('Pedido a ser enviado:', order);

    this.cardOrderService.saveOrder(order).subscribe(
      (response) => {
        console.log('Pedido salvo com sucesso:', response);

      },
      (error) => {
        console.error('Erro ao salvar pedido:', error);
      }
    );
  }
}
