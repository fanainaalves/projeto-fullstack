import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Observable } from "rxjs";
import { Service } from '../model/service';
import { ServiceService } from '../service/service.service';
import { Category } from 'src/app/category/category';
import { LoginService } from 'src/app/login/services/login.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})

export class ServiceFormComponent implements OnInit{

  categories: Category[] = [];
  service: Service;
  success: boolean = false;
  errors: string[];
  id: string;
  services: Service[] = [];
  selectedService: Service;
  successMessage: string;
  errorMessage: string;
  imagePreview: string | ArrayBuffer | null = null;
  modalTitle: string = '';
  modalBody: string = '';
  updatedData: string[] = [];
  formTouched: boolean = false;
  areFieldsFilledForCreate: boolean = false;
  originalService: Service;
  @ViewChild('serviceForm', {static:true}) serviceForm: NgForm;

  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
  ) {
    this.service = new Service();
    this.service.registryUser = this.loginService.getUserSession().name;
  }

  ngOnInit(): void {
    let params: Observable<Params> = this.activatedRoute.params;
    params.subscribe((urlParams) => {
      this.id = urlParams["id"];
      if (this.id) {
        this.serviceService.findById(this.id).subscribe(
          (response) => {
            this.originalService = response;
            this.service = Object.assign({}, response);
            this.markAllFieldAsTouched();
            if(this.service.image){
              this.loadImagePreview(this.service.image)
            }
      },
          (errorResponse) => {
            this.service = new Service()
          }
        );
      }
    });
    this.loadCategories();
  }

  loadCategories() {
    this.serviceService.findByTypeService().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (errorReponse) => {
        console.error('', errorReponse);
      }
    )
  };

  deleteService() {
    this.serviceService.delete(this.selectedService)
      .subscribe(
        response => {
          this.successMessage = 'Serviço excluído com sucesso!';
          window.location.reload();
        },
        error => {
          console.error('Erro ao excluir serviço:', error);
          this.errorMessage = 'Erro ao excluir serviço: ' + error.message;
        }
      );
  }

  confirmDeletion(service: Service) {
    this.selectedService = service;
    this.modalTitle = 'Excluir Serviço';
    this.modalBody = `Deseja realmente excluir o serviço <b>${service.name}</b>?`;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result;
      };
      reader.readAsDataURL(file);
      this.service.image = file.name;
    }
  }

  loadImagePreview(imageUrl: string){
    this.imagePreview = `/assets/img/service/${imageUrl}`;
  }

  public getUserSession(): any {
    return this.loginService.getUserSession();
  }

  returnList() {
    this.router.navigate(["/service-list"]);
  }

  onSubmit() {
    if (this.id) {
      if (this.service.registryUser !== this.loginService.getUserSession().name) {
        this.service.registryUser = this.loginService.getUserSession().name;
      }
      this.confirmUpdate(this.service);
    } else {

      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0]
        this.serviceService.create(this.service, file).subscribe(
          (response) => {
            this.success = true;
            this.errors = null;
            this.service = response;
            this.router.navigate(['/service-form:id']);
          },
          (errorResponse) => {
            this.success = false;
            this.errors = errorResponse.error;
            console.log(errorResponse.error);
          }
        );
      } else {
        this.errors = ["Por favor, selecione um arquivo!"]
      }
    }
  }

  updateService(){
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0]
        this.serviceService.update(this.service, file).subscribe(
          (response) => {
            this.success = true;
            this.errors = null;
          },
          (errorResponse) => {
            this.errors = ["Erro ao atualizar o serviço!"];
          }
        );
      } else {
        this.serviceService.update(this.service, null).subscribe(
          (response) => {
            this.success = true;
            this.errors = null;
          },
          (errorResponse) => {
            this.errors = ["Erro ao atualizar o serviço!"];
          }
        );
      }
  }

  confirmUpdate(service: Service){
    this.selectedService= service;
    this.modalTitle = 'Atualizar Serviço';
    this.modalBody = `Deseja realmente atualizar o serviço <b>${service.name}</b>?`;
    this.updatedData = this.getUpdatedData(this.originalService, service);
    if(this.updatedData.length > 0){
      console.log('Dados atualizados: ', this.updatedData);
    }
  }

  get isNameEmpty(): boolean{
    return !this.service.name || this.service.name.trim() === '';
  }

  getUpdatedData(originalService: Service, updatedService: Service): string[]{
    const updatedData: string[] = [];

    if(originalService.name !== updatedService.name){
      updatedData.push(
        `<strong><span class="text-decoration-line-through text-danger">${originalService.name}</span></strong>
        <i class="fa fa-sync-alt"></i>
        <strong><span class="text-success">${updatedService.name}</span></strong>`
      );
    }

    if(originalService.email !== updatedService.email){
      updatedData.push(
        `<strong><span class="text-decoration-line-through text-danger">${originalService.email}</span></strong>
        <i class="fa fa-sync-alt"></i>
        <strong><span class="text-success">${updatedService.email}</span></strong>`
      );
    }

    if(originalService.idCategory !== updatedService.idCategory){
      updatedData.push(
        `<strong><span class="text-decoration-line-through text-danger">${originalService.idCategory}</span></strong>
        <i class="fa fa-sync-alt"></i>
        <strong><span class="text-success">${updatedService.idCategory}</span></strong>`
      );
    }

    if(originalService.status !== updatedService.status){
      updatedData.push(
        `<strong><span class="text-decoration-line-through text-danger">${originalService.status}</span></strong>
        <i class="fa fa-sync-alt"></i>
        <strong><span class="text-success">${updatedService.status}</span></strong>`
      );
    }

    if(originalService.description !== updatedService.description){
      updatedData.push(
        `<strong><span class="text-decoration-line-through text-danger">${originalService.description}</span></strong>
        <i class="fa fa-sync-alt"></i>
        <strong><span class="text-success">${updatedService.description}</span></strong>`
      );
    }

    if(originalService.price !== updatedService.price){
      updatedData.push(
        `<strong><span class="text-decoration-line-through text-danger">${originalService.price}</span></strong>
        <i class="fa fa-sync-alt"></i>
        <strong><span class="text-success">${updatedService.price}</span></strong>`
      );
    }

    if(originalService.runtime !== updatedService.runtime){
      updatedData.push(
        `<strong><span class="text-decoration-line-through text-danger">${originalService.runtime}</span></strong>
        <i class="fa fa-sync-alt"></i>
        <strong><span class="text-success">${updatedService.runtime}</span></strong>`
      );
    }

    if(originalService.term !== updatedService.term){
      updatedData.push(
        `<strong><span class="text-decoration-line-through text-danger">${originalService.term}</span></strong>
        <i class="fa fa-sync-alt"></i>
        <strong><span class="text-success">${updatedService.term}</span></strong>`
      );
    }

    if(originalService.registryUser !== updatedService.registryUser){
      updatedData.push(
        `<strong><span class="text-decoration-line-through text-danger">${originalService.registryUser}</span></strong>
        <i class="fa fa-sync-alt"></i>
        <strong><span class="text-success">${updatedService.registryUser}</span></strong>`
      );
    }

    if(originalService.image !== updatedService.image){
      updatedData.push(
        `<strong><span class="text-decoration-line-through text-danger">${originalService.image}</span></strong>
        <i class="fa fa-sync-alt"></i>
        <strong><span class="text-success">${updatedService.image}</span></strong>`
      );
    }

    if(updatedData.length === 0){
      updatedData.push(`<strong>Não foi realizada nenhuma modificação</strong>`);
    }

    return updatedData;
  }

  checkForChanges(): boolean {
    return JSON.stringify(this.service) !== JSON.stringify(this.originalService);
  }

  checkForEmptyFields(): boolean {
    const controls = this.serviceForm.controls;
    return !controls['name'].value || !controls['email'].value ||
    !controls['idCategory'].value || !controls['status'].value || !controls['description'].value ||
    !controls['price'].value || !controls['runtime'].value || !controls['term'].value
    || !controls['registryUser'].value || !controls['image'].value;
  }

  isFormatValid(): boolean {
    const controls = this.serviceForm.controls;
    return !controls['name'].valid || !controls['email'].valid ||
    !controls['idCategory'].valid || !controls['status'].valid || !controls['description'].valid ||
    !controls['price'].valid || !controls['runtime'].valid || !controls['term'].valid
    || !controls['registryUser'].valid || !controls['image'].valid;
  }

  cancelUpdate(){
    window.location.reload();
  }

  markAllFieldAsTouched(){
    Object.keys(this.serviceForm.controls).forEach(field => {
      const control = this.serviceForm.controls[field];
      control.markAsTouched();
      control.markAsDirty();
    });
  }

  onFieldTouched(field: any){
    if((field.invalid || this.serviceForm.invalid) && (field.dirty || field.touched)){
      this.formTouched = true;
    }
  }

  ngAfterViewInit(): void {
    this.applyBootstrapValidation();
  }
  private applyBootstrapValidation(): void {
    const forms = document.querySelectorAll('.needs-validation');
    Array.prototype.slice.call(forms)
      .forEach((form: HTMLFormElement) => {
        form.addEventListener('submit', (event: Event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
  }

}
