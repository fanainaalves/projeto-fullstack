import { Injectable } from '@angular/core';
import { Product } from '../model/product';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/category/category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly API_Spring = `http://localhost:9006/api/products`;

  constructor( private http: HttpClient ) { }

  // create( product: Product ) : Observable<Product> {
  //   return this.http.post<Product>('http://localhost:9006/api/products', product);
  // }


  create(product: Product, file: File): Observable<Product> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));

    return this.http.post<Product>(`${this.API_Spring}/create`, formData);
  }


  update( product: Product, file: File ) : Observable<Product> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));

    return this.http.put<Product>(`${this.API_Spring}/${product.id}`, formData);

    //return this.http.put<Product>(`http://localhost:9006/api/products/${product.id}`, product);
  }

  // upload( product: Product ) : Observable<any> {
  //   return this.http.post<Product>(`http://localhost:9006/api/products/file${product.id}`, product);
  // }

  findAll() : Observable<Product[]> {
    return this.http.get<Product[]> ('http://localhost:9006/api/products');
  }

  getById( id: string ) : Observable<Product> {
    return this.http.get<any> (`http://localhost:9006/api/products/getId/${id}`);
  }

  findByIdCategory(idCategory: String): Observable<Product[]>{
    return this.http.get<Product[]> (`http://localhost:9006/api/products/findByIdCategory/${idCategory}`);
  }

  findByDiscount(): Observable<Product[]>{
    return this.http.get<Product[]> ('http://localhost:9006/api/products/findByDiscount/');
  }


  findByTypeProduct() : Observable<Category[]> {
    return this.http.get<Category[]> ('http://localhost:9003/api/category/findByTypeProduct');
  }

  deleteId( product : Product ) : Observable<any> {
    return this.http.delete<any>(`http://localhost:9006/api/products/${product.id}`);
  }


}
