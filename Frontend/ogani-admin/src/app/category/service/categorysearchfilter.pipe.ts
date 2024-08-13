import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../category';

@Pipe({
  name: 'searchfilter'
})
export class CategorySearchfilterPipe implements PipeTransform {

  transform(categories: Category[], searchValue: string): Category[] {

    if(!categories || !searchValue) {
      return categories;
    } else {
      return categories.filter(category => category.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()));
    }
  }
}
