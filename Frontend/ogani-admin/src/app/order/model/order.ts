export class Order {
  id?: string;
  client?: string;
  userId!: string;
  orderItems: OrderItem[] = [];
  paymentInformation!: string;
  orderStatus!: string;
  paymentMethod!: string;
  orderNotes!: string;
  created!: string;
  updated!: string;

  constructor(data: Partial<Order> = {}) {
    Object.assign(this, data);
    if (!this.orderItems) {
      this.orderItems = [];
    }
  }

  formatOrderItems(): string {
    return this.orderItems.map(item => {
      return `Produto: ${item.name}, Descrição: ${item.description}, Quantidade: ${item.quantity}, Preço: ${item.price}`;
    }).join('\n');
  }

  formatOrderItemNames(): string {
    return this.orderItems.map(item => item.name).join('\n');
  }

  formatOrderItemDescriptions(): string {
    return this.orderItems.map(item => item.description).join('\n');
  }

  formatOrderItemQuantities(): string {
    return this.orderItems.map(item => item.quantity.toString()).join('\n');
  }

}

export interface OrderItem {
  idProduct: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  discount: number
}


