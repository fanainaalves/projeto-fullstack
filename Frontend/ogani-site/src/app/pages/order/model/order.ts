export class Order {
  id?: string;
  client?: string;
  userId!: string;
  orderItems: OrderItem[];
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
}

export interface OrderItem {
  idProduct: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  discount: number;
}
