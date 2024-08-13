import { Component, OnInit } from '@angular/core';
import { Category } from '../category';
import { CategoryService } from '../service/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  totalLength: any;
  page: number = 1;

  searchValue: string;

  categories: Category[] = [];
  selectedCategory: Category;
  successMessage: string;
  errorMessage: string;

  constructor(private service: CategoryService,
    private router: Router) { }

  ngOnInit(): void {
    this.service
    .findAll()
    .subscribe( response => this.categories = response);
  }

  transformType(category: Category) {
    const product: string = "Produto";
    const service: string = "Serviço";
    if( category.type === 1 ) {
      category.type.toString();
      return service;
    } else if ( category.type === 2 ) {
      category.type.toString();
      return product;
    } else {
      return "Categoria";
    }
  }

}
