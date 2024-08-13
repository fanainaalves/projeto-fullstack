import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, DEFAULT_CURRENCY_CODE, LOCALE_ID, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

import { Order } from './model/order';
import { OrderManagementService } from './service/order-management.service';
import { OrderService } from './service/order.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    NgxPaginationModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    CurrencyPipe,
  ],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'], // Corrigido aqui
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  ordersReversed: Order[] = [];
  searchValue: any;
  userIdSession: string | null = null;
  currentPage = 1;
  itemsPerPage = 6;

  public valor: number = 1;

  constructor(
    private orderService: OrderService,
    private router: Router,
    public route: ActivatedRoute,
    private orderManagementService: OrderManagementService
  ) {}

  ngOnInit(): void {
    const sessionData = this.orderManagementService.getUserSession();

    if (sessionData && sessionData.userId) {
      this.userIdSession = sessionData.userId;
      console.log('UserId encontrado:', this.userIdSession);
      this.findByUserId(this.userIdSession);
    } else {
      console.log('Nenhum userId encontrado na sessão');
    }
  }

  findByUserId(userId: string): void {
    this.orderService.findByUserId(userId).subscribe(
      (response: Order[]) => {
        if (response && response.length > 0) {
          this.orders = response;
          this.ordersReversed = [...this.orders].reverse();
          this.valor = this.orders.length;
        } else {
          console.log(
            'Nenhuma ordem encontrada para o usuário com o ID:',
            userId
          );
        }
      },
      (error) => {
        console.error('Erro ao buscar ordens:', error);
      }
    );
  }

  detailOrder() {
    this.router.navigateByUrl('/detail-order');
  }

  aumentarValor() {
    this.valor++;
  }
}
