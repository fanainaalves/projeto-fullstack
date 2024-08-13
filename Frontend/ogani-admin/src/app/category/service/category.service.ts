import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Category } from '../category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  private readonly API_Spring = `http://localhost:9003/api/category`;

  create(category: Category, file: File): Observable<Category> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('category',new Blob([JSON.stringify(category)], { type: 'application/json' }));
    return this.http.post<Category>(`${this.API_Spring}/create`, formData);
  }

  update(category: Category, file: File): Observable<Category> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('category',new Blob([JSON.stringify(category)], { type: 'application/json' }));
    return this.http.put<Category>(
      `${this.API_Spring}/${category.id}`,
      formData
    );
  }

  findAll() : Observable<Category[]> {
    return this.http.get<Category[]> ('http://localhost:9003/api/category/findAll');
  }

  findByProduct(): Observable<Category[]> {
    return this.http.get<Category[]>(
      'http://localhost:9003/api/category/findByTypeProduct'
    );
  }

  findByService(): Observable<Category[]> {
    return this.http.get<Category[]>(
      'http://localhost:9003/api/category/findByTypeService'
    );
  }

  getById(id: string): Observable<Category> {
    return this.http.get<any>(
      `http://localhost:9003/api/category/search/${id}`
    );
  }

  deleteId(category: Category): Observable<any> {
    return this.http.delete<any>(
      `http://localhost:9003/api/category/delete/${category.id}`
    );
  }
}
