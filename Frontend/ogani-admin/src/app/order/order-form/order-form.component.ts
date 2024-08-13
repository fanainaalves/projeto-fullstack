import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Order } from '../model/order';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
})
export class OrderFormComponent implements OnInit {
  order: Order;
  orderItems: any[];

  success: boolean = false;
  errors: string[];
  id: string;

  orders: Order[] = [];
  selectedClient: Order;
  successMessage: string;
  errorMessage: string;

  editingEnabled: boolean = true;

  constructor(
    private service: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.order = new Order();
  }

    ngOnInit(): void {
    let params: Observable<Params> = this.activatedRoute.params;
    params.subscribe((urlParams) => {
      this.id = urlParams['id'];
      if (this.id) {
        this.service.getById(this.id).subscribe(
          (response) => (this.order = response),
          (errorResponse) => (this.order = new Order())
        );
      }
    });
  }

  returnList() {
    this.router.navigate(['/order-list']);
  }

  convertOrderItemsToObject(orderItemsString: string): any {
    try {
      return JSON.parse(orderItemsString);
    } catch (error) {
      console.error("Erro ao converter orderItems para objeto:", error);
      return null;
    }
  }

  onSubmit() {
    // Verifica se 'id' está presente para determinar se é uma atualização ou uma criação
    if (this.id) {
      this.service.update(this.order).subscribe(
        (response) => {
          this.success = true;
          this.errors = null;
        },
        (errorResponse) => {
          this.errors = ['Erro ao Atualizar Cliente'];
        }
      );
    } else {
      this.service.save(this.order).subscribe(
        (response) => {
          this.success = true;
          this.errors = null;
          this.order = response;
        },
        (errorResponse) => {
          this.success = false;
          this.errors = errorResponse.error;
          console.log(errorResponse.error);
        }
      );
    }
  }


  // Método para converter a string de orderItems em um array JSON válido
  convertOrderItemsToArray(orderItemsString: string): any[] {
    try {
      const jsonArrayString = `[${orderItemsString}]`;
      return JSON.parse(jsonArrayString);
    } catch (error) {
      console.error("Erro ao converter orderItems para array:", error);
      return [];
    }
  }

  // Método para formatar os itens do pedido
  formatOrderItems(): string {
    let formattedItems = '';

    if (Array.isArray(this.order.orderItems)) {
      this.order.orderItems.forEach((item: any, index: number) => {
        formattedItems += `${item.name} Quant: ${item.quantity} R$ ${item.price.toFixed(2)}\n`;
      });
    } else if (typeof this.order.orderItems === 'string') {
      this.order.orderItems = this.convertOrderItemsToArray(this.order.orderItems);
      this.order.orderItems.forEach((item: any, index: number) => {
        formattedItems += `${item.name} Quant: ${item.quantity} R$ ${item.price.toFixed(2)}\n`;
      });
    } else {
      console.error("orderItems não é uma array:", this.order.orderItems);
    }

    console.log(formattedItems);

    return formattedItems;
  }

  confirmDeletion(client: Order) {
    this.selectedClient = client;
  }

  deleteOrder() {
    this.service.deleteId(this.selectedClient).subscribe(
      (response) => {
        this.successMessage = 'Cliente excluído com sucesso!';
        // Recarregar a página
        window.location.reload();
      },
      (error) => {
        console.error('Erro ao excluir cliente:', error);
        this.errorMessage = 'Erro ao excluir cliente: ' + error.message;
      }
    );
  }

  getTotalOrderPrice(): number {
    if (!this.order || !Array.isArray(this.order.orderItems)) {
      return 0;
    }
    return this.order.orderItems.reduce(
      (total: number, item: any) => total + (item.price - (item.price * (item.discount / 100))) * item.quantity,

      0
    );
  }

  getDiscount() {
    if (!this.order || !Array.isArray(this.order.orderItems)) {
      return 0;
    }
}

}
