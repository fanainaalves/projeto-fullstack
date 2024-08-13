import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order } from '../model/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  findByUserId(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`http://localhost:9007/api/orders/user/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  saveOrder(sessionData: any): Observable<any> {
    return this.http.post<any>('http://localhost:9007/api/orders', sessionData).pipe(
      catchError(this.handleError)
    );
  }

  findById(id: string): Observable<Order> {
    return this.http.get<Order>(`http://localhost:9007/api/orders/getId/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.put<any>(`http://localhost:9007/api/orders/${orderId}`, { orderStatus: status }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro no servidor:', error);
    return throwError('Ocorreu um erro na comunicação com o servidor. Tente novamente mais tarde.');
  }
}
