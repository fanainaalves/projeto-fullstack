import { Category } from './category';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  standalone: true
})
export class SearchFilterPipe implements PipeTransform {

  transform(categories: Category[], searchValue: any): Category[] {
    if(!categories) {
      return categories;
    } else {
      return categories.filter(category => category.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()));
    }
  }
}
