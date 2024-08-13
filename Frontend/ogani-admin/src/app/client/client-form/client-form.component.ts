import { Component, OnInit, ViewChild } from "@angular/core";
import { ClientService } from "../service/client.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Observable } from "rxjs";
import { Client } from "../model/client";
import { LoginService } from "src/app/login/services/login.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-form",
  templateUrl: "./client-form.component.html",
  styleUrls: ["./client-form.component.css"],
})
export class ClientFormComponent implements OnInit {

  client: Client;

  formTouched: boolean = false;
  areFieldsFilledForCreate: boolean = false;

  success: boolean = false;
  errors: string[];
  id: string;
  modalTitle: string = '';
  modalBody: string = '';
  updatedData: string[] = [];

  clients: Client[] = [];
  selectedClient: Client;
  successMessage: string;
  errorMessage: string;
  originalClient: Client;

  @ViewChild('clientform', { static: true }) clientform: NgForm;

  constructor(
    private service: ClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService
  ) {
    this.client = new Client();
    this.client.registryUser = this.loginService.getUserSession().name;
  }

  ngOnInit(): void {
    let params: Observable<Params> = this.activatedRoute.params;
    params.subscribe((urlParams) => {
      this.id = urlParams["id"];
      if (this.id) {
        this.service.getById(this.id).subscribe(
          (response) => {
            console.log('Cliente do banco de dados:', response);
            this.originalClient = response;
            this.client = Object.assign({}, response);
            this.markAllFieldsAsTouched();
          },
          (errorResponse) => {
            this.client = new Client();
          }
        );
      }
    });
  }

  markAllFieldsAsTouched() {
    Object.keys(this.clientform.controls).forEach(field => {
      const control = this.clientform.controls[field];
      control.markAsTouched();
      control.markAsDirty(); // !validação
    });
  }

  onFieldTouched(field: any) {
    if ((field.invalid || this.clientform.invalid) && (field.dirty || field.touched)) {
      this.formTouched = true;
    }
  }

  public getUserSession(): any {
    return this.loginService.getUserSession();
  }

  returnList() {
    this.router.navigate(["/client-list"]);
  }

  onSubmit() {
    if (this.id) {
      if (this.client.registryUser !== this.loginService.getUserSession().name) {
          this.client.registryUser = this.loginService.getUserSession().name;
      }
      this.confirmUpdate(this.client);
    } else {
      this.service.save(this.client).subscribe(
        (response) => {
          this.success = true;
          this.errors = null;
          this.client = response;
          this.router.navigate(['/client-form:id']); 
        },
        (errorResponse) => {
          this.success = false;
          this.errors = errorResponse.error;
          console.log(errorResponse.error);
        }
      );
    }
  }

  confirmUpdate(client: Client) {
    this.selectedClient = client;
    this.modalTitle = 'Atualizar Cliente';
    this.modalBody = `Deseja realmente atualizar o cliente <b>${client.name}</b>?`;

    this.updatedData = this.getUpdatedData(this.originalClient, client);
    if (this.updatedData.length > 0) {
        console.log('Dados atualizados:', this.updatedData);
    }
  }

  get isNameEmpty(): boolean {
    return !this.client.name || this.client.name.trim() === '';
  }

  getUpdatedData(originalClient: Client, updatedClient: Client): string[] {
    const updatedData: string[] = [];

    if (originalClient.name !== updatedClient.name) {
        updatedData.push(`<strong ><span class="text-decoration-line-through text-danger"> ${originalClient.name}</span></strong> <i class="fa fa-sync-alt"></i> <strong> <span class="text-success"> ${updatedClient.name}</span></strong>`);
    }
    if (originalClient.email !== updatedClient.email) {
        updatedData.push(`<strong><span class="text-decoration-line-through text-danger">${originalClient.email}</span></strong> <i class="fa fa-sync-alt"></i> <strong><span class="text-success">${updatedClient.email}</span></strong>`);
    }
    if (originalClient.cel !== updatedClient.cel) {
        updatedData.push(`<strong><span class="text-decoration-line-through text-danger">${originalClient.cel}</span></strong> <i class="fa fa-sync-alt"></i> <strong><span class="text-success">${updatedClient.cel}</span></strong>`);
    }
    if (originalClient.cpf !== updatedClient.cpf) {
        updatedData.push(`<strong><span class="text-decoration-line-through text-danger">${originalClient.cpf}</span></strong> <i class="fa fa-sync-alt"></i> <strong><span class="text-success">${updatedClient.cpf}</span></strong>`);
    }
    if (updatedData.length === 0) {
      updatedData.push(`<strong>Não foi realizada nenhuma modificação</strong>`);
  }

    return updatedData;
  }

  checkForChanges(): boolean {
    return JSON.stringify(this.client) !== JSON.stringify(this.originalClient);
  }


  checkForEmptyFields(): boolean {
    const controls = this.clientform.controls;
    return !controls['name'].value || !controls['email'].value || !controls['cel'].value || !controls['cpf'].value;
  }

  isFormValid(): boolean {
    const controls = this.clientform.controls;
    return controls['name'].valid && controls['email'].valid && controls['cel'].valid && controls['cpf'].valid;
  }

  cancelUpdate() {
    window.location.reload();
  }

  confirmDeletion(client : Client) {
    this.selectedClient = client;
    this.modalTitle = 'Excluir Cliente';
    this.modalBody = `Deseja realmente excluir o cliente <b>${client.name}</b>?`;
  }

  updateClient() {
    if (this.selectedClient) {
      this.service.update(this.selectedClient).subscribe(
        (response) => {
          this.success = true;
          this.errors = null;
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
        (errorResponse) => {
          this.errors = ["Erro ao Atualizar Cliente"];
        }
      );
    }
  }

  deleteClient() {
    this.modalBody = `Cliente ${this.client.name} excluído!!`;
    this.service.deleteId(this.selectedClient)
      .subscribe(
        response => {
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
        error => {
          console.error('Erro ao excluir', error);
          this.errorMessage = 'Erro ao excluir' + error.message;
        }
      );
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
