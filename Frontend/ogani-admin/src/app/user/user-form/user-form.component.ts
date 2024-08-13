import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../service/user.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/login/services/login.service';
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  user: User;

  formTouched: boolean = false;
  areFieldsFilledForCreate: boolean = false;

  success: boolean = false;
  errors: string[];
  id: string;
  modalTitle: string = '';
  modalBody: string = '';
  updatedData: string[] = [];

  users: User[] = [];
  selectedUser: User;
  successMessage: string;
  errorMessage: string;
  originalUser: User;

  @ViewChild('userform', { static: true }) userform: NgForm;

  constructor(
    private service: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    ){
      this.user = new User();
      this.user.registryUser = this.loginService.getUserSession().name;
    }


  ngOnInit(): void {
    let params: Observable<Params> = this.activatedRoute.params;
    params.subscribe((urlParams) => {
      this.id = urlParams["id"];
      if (this.id) {
        this.service.getById(this.id).subscribe(
          (response) => {
            console.log('Usuário do banco de dados:', response);
            this.originalUser = response;
            this.user = Object.assign({}, response);
            this.markAllFieldsAsTouched();
          },
          (errorResponse) => {
            this.user = new User();
          }
        );
      }
    });
  }

  markAllFieldsAsTouched() {
    Object.keys(this.userform.controls).forEach(field => {
      const control = this.userform.controls[field];
      control.markAsTouched();
      control.markAsDirty(); // !validação
    });
  }

  onFieldTouched(field: any) {
    if ((field.invalid || this.userform.invalid) && (field.dirty || field.touched)) {
      this.formTouched = true;
    }
  }

  public getUserSession(): any {
    return this.loginService.getUserSession();
  }

  returnList() {
    this.router.navigate(["/user-list"]);
  }

  onSubmit() {
    if (this.id) {
      if (this.user.registryUser !== this.loginService.getUserSession().name) {
          this.user.registryUser = this.loginService.getUserSession().name;
    }
      this.confirmUpdate(this.user);
    } else {
      this.service.save(this.user).subscribe(
        (response) => {
          this.success = true;
          this.errors = null;
          this.user = response;
          this.router.navigate(['/user-form:id']);
        },
        (errorResponse) => {
          this.success = false;
          this.errors = errorResponse.error;
          console.log(errorResponse.error);
        }
      );
    }
  }

  confirmUpdate(user : User) {
    this.selectedUser= user;
    this.modalTitle = 'Atualizar Usuário';
    this.modalBody = `Deseja realmente atualizar o usuário <b>${user.name}</b>?`;

    this.updatedData = this.getUpdatedData(this.originalUser, user);
    if (this.updatedData.length > 0) {
        console.log('Dados atualizados:', this.updatedData);
    }
  }

  get isNameEmpty(): boolean {
    return !this.user.name || this.user.name.trim() === '';
  }

  getUpdatedData(originalUser: User, updatedUser: User): string[] {
    const updatedData: string[] = [];

    if (originalUser.name !== updatedUser.name) {
        updatedData.push(`<strong ><span class="text-decoration-line-through text-danger"> ${originalUser.name}</span></strong> <i class="fa fa-sync-alt"></i> <strong> <span class="text-success"> ${updatedUser.name}</span></strong>`);
    }
    if (originalUser.username !== updatedUser.username) {
      updatedData.push(`<strong ><span class="text-decoration-line-through text-danger"> ${originalUser.username}</span></strong> <i class="fa fa-sync-alt"></i> <strong> <span class="text-success"> ${updatedUser.username}</span></strong>`);
    }
    if (originalUser.password !== updatedUser.password) {
      updatedData.push(`<strong ><span class="text-decoration-line-through text-danger">Senha Antiga: ***</span></strong> <i class="fa fa-sync-alt"></i> <strong> <span class="text-success">Senha Atual ***</span></strong>`);
    }
    if (originalUser.email !== updatedUser.email) {
        updatedData.push(`<strong><span class="text-decoration-line-through text-danger">${originalUser.email}</span></strong> <i class="fa fa-sync-alt"></i> <strong><span class="text-success">${updatedUser.email}</span></strong>`);
    }
    if (updatedData.length === 0) {
      updatedData.push(`<strong>Não foi realizada nenhuma modificação</strong>`);
  }

    return updatedData;
  }

  checkForChanges(): boolean {
    return JSON.stringify(this.user) !== JSON.stringify(this.originalUser);
  }

  checkForEmptyFields(): boolean {
    const controls = this.userform.controls;
    return !controls['name'].value || !controls['username'].value || !controls['password'].value ||!controls['email'].value;
  }

  isPasswordValid(): boolean {
    return !this.user.password || (this.user.password.length >= 6 && this.user.password.length <= 8);
 }

  isFormValid(): boolean {
    const controls = this.userform.controls;
    return controls['name'].valid && controls['username'].valid && controls['password'].valid && controls['email'].valid;
  }

  cancelUpdate() {
    window.location.reload();
  }

   confirmDeletion(user : User) {
    this.selectedUser= user;
    this.modalTitle = 'Excluir Usuário';
    this.modalBody = `Deseja realmente excluir o usuário <b>${user.name}</b>?`;
  }

  updateUser() {
    if (this.selectedUser) {
      this.service.update(this.selectedUser).subscribe(
        (response) => {
          this.success = true;
          this.errors = null;
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
        (errorResponse) => {
          this.errors = ["Erro ao Atualizar Usuário"];
        }
      );
    }
  }

  deleteUser() {
    this.modalBody = `User ${this.user.name} excluído!!`;
    this.service.deleteId(this.selectedUser)
      .subscribe(
          response => {
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          },
          error => {
            console.error('Erro ao excluir usuário:', error);
            this.errorMessage = 'Erro ao excluir usuário: ' + error.message;
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
