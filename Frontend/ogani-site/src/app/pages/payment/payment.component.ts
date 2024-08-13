import { CommonModule, NgIf, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';

import { LoginService } from '../login/services/login.service';
import { Cart } from '../shopping-card/model/cart';
import { CartManagementService } from '../shopping-card/services/cart-management.service';
import { CartService } from '../shopping-card/services/cart.service';
import { AppModule } from './../../app.module';
import { Payment } from './model/payment';
import { ServicesPayment } from './services/services.service';

registerLocaleData(localePt);

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    AppModule,
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent {
  constructor(
    private service: ServicesPayment,
    private cartService: CartService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private cartManagementService: CartManagementService
  ) {
    this.form = this.fb.group({
      ccnome: ['', [Validators.required]],
      ccnumero: ['', [Validators.required]],
      ccexpiracao: ['', [Validators.required]],
      cccvv: ['', [Validators.required]],
      idUser: [this.userLoginId, [Validators.required]],
      value: [this.totalCart, [Validators.required]],
      paymentMethod: [this.methods],
      status: [this.statusPaid],
    });
  }

  methods: string;
  statusPaid: string;
  timeoutId: any;
  qrCodeInputValue = 'PIX';
  qrCodeImg: any;
  cart: Cart = new Cart();
  form: FormGroup;
  selectedPaymentMethod: string = '';
  isLoading: boolean = true;
  btnlg: boolean = true;

  var = (this.cart.products = this.cartService.cart.products);

  get idproductmethod(): string[] {
    let identities = this.var.map((p) => p.id);
    return identities;
  }

  payments: Payment[] = [];

  get totalCart(): number {
    let total = this.cart.products.reduce((sum, product) => {
      return sum + (product.price * (1 - product.discount / 100) * product.quantity);
    }, 0);
    return Number(total.toFixed(2));
  }

  selectedMethod(method: string) {
    this.selectedPaymentMethod = method;
    this.methods = this.selectedPaymentMethod;
  }

  cancelSubmit(event: Event) {
    event.preventDefault();
  }

  onSubmit(event: Event) {
    this.cancelSubmit(event);
    if (this.methods == 'tiket') {
      this.statusPaid = '2';

      if (this.statusPaid == '2') {
        this.form.get('status')?.setValue('2');
        this.createForm();
      }
    } else {
      this.statusPaid = '1';
      if (this.statusPaid == '1') {
        this.form.get('status')?.setValue('1');
        this.createForm();
      }
    }

  }

  cancel(event: Event) {
    this.cancelSubmit(event);
    clearTimeout(this.timeoutId);
    this.statusPaid = '3';
  }

  geraQrCode(qrCodeInputValue: string, event: Event) {
    this.cancelSubmit(event);
    this.isLoading = true;
    this.btnlg = false;
    this.service.getQrCode(qrCodeInputValue).subscribe((res: Blob) => {
      let objectURL = URL.createObjectURL(res);
      this.qrCodeImg = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.isLoading = false;
    });
  }

  createForm() {
    const payment = this.form.value;
    this.service.create(payment).subscribe(() => {
      this.router.navigate(['/shopping-card']);
    });
  }

  get userLoginId() {
    return this.loginService.getUserSession().id;
  }

  ngOnInit() {
    this.service.list().subscribe((payment: Payment[]) => {
      this.payments = payment as Payment[];
    });
  }

  //order component

  createOrder() {
    const { userName, userId, orderData } =
      this.cartManagementService.pullDataSessionStorage();
    this.cartManagementService.checkout(
      { orderItems: orderData },
      userName,
      userId
    );
    this.cartService.removeCart();
  }

  reload(){
    this.cartService.removeCart();
  }
}
