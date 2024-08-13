import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { NgForm } from "@angular/forms";
import { PaymentServiceService } from "../service/payment-service.service";
import { Payment } from '../payments-model/payment';
import { LoginService } from 'src/app/login/services/login.service';
import { Observable } from 'rxjs';
import { StatusPayment } from "../payments-model/status";
import { Method } from "../payments-model/method";

@Component({
  selector: "app-payments-form",
  templateUrl: "./payments-form.component.html",
  styleUrls: ["./payments-form.component.css"],
})
export class PaymentsFormComponent implements OnInit {
  payment: Payment; // Renomeado de 'user' para 'payment'

  formTouched: boolean = false;
  areFieldsFilledForCreate: boolean = false;

  success: boolean = false;
  errors: string[];
  id: string;
  modalTitle: string = '';
  modalBody: string = '';
  updatedData: string[] = [];

  payments: Payment[] = []; // Renomeado de 'users' para 'payments'
  selectedPayment: Payment;
  successMessage: string;
  errorMessage: string;
  originalPayment: Payment;

  statusPayment:StatusPayment[] = [];
  methods: Method[] = [];

  @ViewChild('paymentform', { static: true }) paymentform: NgForm | undefined; // Renomeado de 'userform' para 'paymentform'

  constructor(
    private service: PaymentServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    ){
      this.payment = new Payment();
      this.payment.idUser = this.loginService.getUserSession().id;
    }

  ngOnInit(): void {
    let params: Observable<Params> = this.activatedRoute.params;
    params.subscribe((urlParams) => {
      this.id = urlParams["id"];
      if (this.id) {
        this.service.getById(this.id).subscribe(
          (response) => {
            console.log('Pagamento do banco de dados:', response);
            this.originalPayment = response;
            this.payment = Object.assign({}, response);
            this.markAllFieldsAsTouched();
          },
          (errorResponse) => {
            this.payment = new Payment();
          }
        );
      }
    });

    this.findStatus();
    this.findMethod();
  }

  markAllFieldsAsTouched() {
    Object.keys(this.paymentform.controls).forEach(field => {
      const control = this.paymentform.controls[field];
      control.markAsTouched();
      control.markAsDirty();
    });
  }

  onFieldTouched(field: any) {
    if ((field.invalid || this.paymentform.invalid) && (field.dirty || field.touched)) {
      this.formTouched = true;
    }
  }

  public getUserSession(): any {
    return this.loginService.getUserSession();
  }

  returnList() {
    this.router.navigate(["/payment/list"]);
  }

  onSubmit() {
    if (this.id) {
      if (this.payment.idUser !== this.loginService.getUserSession().id) {
          this.payment.idUser = this.loginService.getUserSession().id;
    }
      this.confirmUpdate(this.payment);
    } else {
      this.service.save(this.payment).subscribe(
        (response) => {
          this.success = true;
          this.errors = null;
          this.payment = response;
          this.router.navigate(['/payment/form:id']); // Renomeado de '/user-form:id' para '/payment-form:id'
        },
        (errorResponse) => {
          this.success = false;
          this.errors = errorResponse.error;
          console.log(errorResponse.error);
        }
      );
    }
  }

  confirmUpdate(payment: Payment) { // Renomeado de 'user' para 'payment'
    this.selectedPayment = payment;
    this.modalTitle = 'Atualizar Pagamento';
    this.modalBody = `Deseja realmente atualizar o pagamento <b>${payment.value}</b>?`;

    this.updatedData = this.getUpdatedData(this.originalPayment, payment);
    if (this.updatedData.length > 0) {
        console.log('Dados atualizados:', this.updatedData);

    }
  }

  get isNameEmpty(): boolean {
    return !this.payment.id || this.payment.id.trim() === '';
  }

  getUpdatedData(originalPayment: Payment, updatedPayment: Payment): string[] { // Renomeado de 'user' para 'payment'
    const updatedData: string[] = [];

    if (originalPayment.paymentMethod !== updatedPayment.paymentMethod) {
        updatedData.push(`<strong ><span class="text-decoration-line-through text-danger"> ${originalPayment.paymentMethod}</span></strong> <i class="fa fa-sync-alt"></i> <strong> <span class="text-success"> ${updatedPayment.paymentMethod}</span></strong>`);
    }
    if (originalPayment.status !== updatedPayment.status) {
      updatedData.push(`<strong ><span class="text-decoration-line-through text-danger"> ${originalPayment.status}</span></strong> <i class="fa fa-sync-alt"></i> <strong> <span class="text-success"> ${updatedPayment.status}</span></strong>`);
    }
    if (originalPayment.value !== updatedPayment.value) {
      updatedData.push(`<strong ><span class="text-decoration-line-through text-danger">Senha Antiga: ***</span></strong> <i class="fa fa-sync-alt"></i> <strong> <span class="text-success">Senha Atual ***</span></strong>`);
    }
    if (updatedData.length === 0) {
      updatedData.push(`<strong>Não foi realizada nenhuma modificação</strong>`);
  }

    return updatedData;
  }

  checkForChanges(): boolean {
    return JSON.stringify(this.payment) !== JSON.stringify(this.originalPayment);
  }

  checkForEmptyFields(): boolean {
    const controls = this.paymentform.controls;
    return !controls['name'].value || !controls['username'].value || !controls['password'].value ||!controls['email'].value;
  }

  isFormValid(): boolean {
    return this.paymentform !== undefined && this.paymentform.valid;
  }

  cancelUpdate() {
    window.location.reload();
  }

   confirmDeletion(payment : Payment) { // Renomeado de 'user' para 'payment'
    this.selectedPayment = payment;
    this.modalTitle = 'Excluir Pagamento';
    this.modalBody = `Deseja realmente excluir o pagamento <b>${payment.id}</b>?`;
  }

  updatePayment() { // Renomeado de 'updateUser' para 'updatePayment'
    if (this.selectedPayment) {
      this.service.update(this.selectedPayment).subscribe(
        (response) => {
          this.success = true;
          this.errors = null;
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        (errorResponse) => {
          this.errors = ["Erro ao Atualizar Pagamento"];
        }
      );
    }
  }

  deletePayment() {
    this.modalBody = `Pagamento ${this.payment.id} excluído!!`;
    this.service.deleteId(this.selectedPayment)
      .subscribe(
          response => {
            setTimeout(() => {

              window.location.reload();
            }, 3000);
          },
          error => {
            console.error('Erro ao excluir pagamento:', error);
            this.errorMessage = 'Erro ao excluir pagamento: ' + error.message;
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

  findStatus(){
    this.service
      .findAllStatusPayment()
      .subscribe( response =>{
       return this.statusPayment = response
      });
  }
  findMethod(){
    this.service
      .findAllMetodPayment()
      .subscribe( response => {
      return this.methods = response
      });
  }
}
