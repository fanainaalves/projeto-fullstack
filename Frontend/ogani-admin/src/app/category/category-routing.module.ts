import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';

const routes: Routes = [
  { path: 'category-list', component: CategoryListComponent  },
  { path: 'category-form', component: CategoryFormComponent },
  { path: 'category-form/:id', component: CategoryFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CategoryRoutingModule{}
