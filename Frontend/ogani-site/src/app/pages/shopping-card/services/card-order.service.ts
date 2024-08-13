import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../order/model/order';

@Injectable({
  providedIn: 'root'
})
export class CardOrderService {

  constructor(private http: HttpClient) {}

  saveOrder(order: Order): Observable<Order> {
    return this.http.post<any>('http://localhost:9007/api/orders', order);

  }


}
