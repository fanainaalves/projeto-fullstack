import { Component, OnInit, ViewChild } from '@angular/core';
import { Category } from '../category';
import { CategoryService } from '../service/category.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/login/services/login.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit {
  category: Category;
  success: boolean = false;
  errors: string[];
  id: string;

  modalTitle: string = '';
  modalBody: string = '';
  updatedData: string[] = [];


  formTouched: boolean = false;
  areFieldsFilledForCreate: boolean = false;

  imagePreview: string | ArrayBuffer | null = null;
  categories: Category[] = [];
  selectedCategory: Category;
  successMessage: string;
  errorMessage: string;
  originalCategory: Category;

  @ViewChild('categoryform', { static: true }) categoryform: NgForm;


  constructor(
    private service: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
  ) {
    this.category = new Category();
    this.category.registryUser = this.loginService.getUserSession().name;
  }

  ngOnInit(): void {
    let params: Observable<Params> = this.activatedRoute.params;
    params.subscribe((urlParams) => {
      this.id = urlParams['id'];
      if (this.id) {
        this.service.getById(this.id).subscribe(
          (response) => {
            this.originalCategory = response;
            this.category = Object.assign({}, response);
            this.markAllFieldsAsTouched();
            if (this.category.image) {
              this.loadImagePreview(this.category.image);
            }
          },
          (errorResponse) => {
            this.category = new Category();
          }
        );
      }
    });
  }

  onSubmit() {
    if (this.id) {
      if (this.category.registryUser !== this.loginService.getUserSession().name) {
        this.category.registryUser = this.loginService.getUserSession().name;
      }
      this.confirmUpdate(this.category);
    } else {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        this.service.create(this.category, file).subscribe(
          (response) => {
            this.success = true;
            this.errors = null;
            this.category = response;
            this.router.navigate(['/category-form/:id']);
          },
          (errorResponse) => {
            this.success = false;
            this.errors = errorResponse.error;
            console.log(errorResponse.error);
          }
        );
      } else {
        this.errors = ["Por favor selecione um arquivo!"];
      }
    }
  }

  confirmUpdate(category: Category) {
    this.selectedCategory = category;
    this.modalTitle = 'Atualizar Categoria';
    this.modalBody = `Deseja realmente atualizar a categoria<b>${category.name}</b>?`;
    this.updatedData = this.getUpdatedData(this.originalCategory, category);
    if (this.updatedData.length > 0) {
      console.log('Dados atualizados:', this.updatedData);
    }
  }

  get isNameEmpty(): boolean {
    return !this.category.name || this.category.name.trim() === '';
  }

  getUpdatedData(originalCategory: Category, updatedCategory: Category): string[] {
    const updatedData: string[] = [];

    if (originalCategory.name !== updatedCategory.name) {
      updatedData.push(
        `<strong ><span class="text-decoration-line-through text-danger"> ${originalCategory.name}</span></strong> <i class="fa fa-sync-alt"></i> <strong> <span class="text-success"> ${updatedCategory.name}</span></strong>`
      );
    }
    if (originalCategory.type !== updatedCategory.type) {
      updatedData.push(
        `<strong><span class="text-decoration-line-through text-danger">${originalCategory.type}</span></strong> <i class="fa fa-sync-alt"></i> <strong><span class="text-success">${updatedCategory.type}</span></strong>`
      );
    }
    if (originalCategory.image !== updatedCategory.image) {
      updatedData.push(
        `<strong><span class="text-decoration-line-through text-danger">${originalCategory.image}</span></strong> <i class="fa fa-sync-alt"></i> <strong><span class="text-success">${updatedCategory.image}</span></strong>`
      );
    }
    if (updatedData.length === 0) {
      updatedData.push(
        `<strong>Não foi realizada nenhuma modificação</strong>`
      );
    }

    return updatedData;
  }

  checkForChanges(): boolean {
    return (
      JSON.stringify(this.category) !== JSON.stringify(this.originalCategory)
    );
  }

  checkForEmptyFields(): boolean {
    const controls = this.categoryform.controls;
    return !controls['name'].value || !controls['type'].value || !controls['image'].value;
  }

  isFormValid(): boolean {
    const controls = this.categoryform.controls;
    return !controls['name'].valid || !controls['type'].valid || !controls['image'].valid;
  }

  cancelUpdate() {
    window.location.reload();
  }

  markAllFieldsAsTouched() {
    Object.keys(this.categoryform.controls).forEach((field) => {
      const control = this.categoryform.controls[field];
      control.markAsTouched();
      control.markAsDirty();
    });
  }

  onFieldTouched(field: any){
    if((field.invalid || this.categoryform.invalid) && (field.dirty || field.touched)){
      this.formTouched = true;
    }
  }

  public getUserSession(): any {
    return this.loginService.getUserSession();
  }

  confirmDeletion(category: Category) {
    this.selectedCategory = category;
    this.modalTitle = 'Excluir Categoria';
    this.modalBody = `Deseja realmente excluir a categoria <b>${category.name}</b>?`;
  }

  updateCategory() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.service.update(this.category, file).subscribe(
        (response) => {
          this.success = true;
          this.errors = null;
        },
        (errorResponse) => {
          this.errors = ["Erro ao atualizar a categoria!"];
        }
      );
    } else {
      this.service.update(this.category, null).subscribe(
        (response) => {
          this.success = true;
          this.errors = null;
        },
        (errorResponse) => {
          this.errors = ["Erro ao atualizar a categoria!"];
        }
      );
    }
  }

  deleteCategory() {
    this.service.deleteId(this.selectedCategory).subscribe(
      (response) => {
        this.successMessage = 'Categoria excluída com sucesso!';
        window.location.reload();
      },
      (error) => {
        console.error('Erro ao excluir categoria:', error);
        this.errorMessage = 'Erro ao excluir categoria: ' + error.message;
      }
    );
  }

  returnList() {
    this.router.navigate(['/category-list']);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result;
      };
      reader.readAsDataURL(file);
      this.category.image = file.name;
    }
  }

  loadImagePreview(imageUrl: string) {
    this.imagePreview = `../../../assets/img/categories/${imageUrl}`;
  }

}
