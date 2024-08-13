import { CommonModule, CurrencyPipe, NgIf, registerLocaleData } from '@angular/common';
import { Component, DEFAULT_CURRENCY_CODE, LOCALE_ID, HostListener  } from '@angular/core';
import { CartService } from '../../pages/shopping-card/services/cart.service';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import localePt from '@angular/common/locales/pt';
import { LoginService } from '../../pages/login/services/login.service';

registerLocaleData(localePt)
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule , NgIf],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    CurrencyPipe
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {

  constructor(private router: Router, private cartService: CartService, private loginService: LoginService, private route: ActivatedRoute) {}

  hideComponent(): boolean {
    const url = this.router.url;
    const patterns = [
      /^\/login$/,
      /^\/signup$/,
      /^\/home$/,
      /^\/*$/,
      /^\/product$/,
      /^\/checkout$/,
      /^\/details$/,
      /^\/service$/,
      /^\/shopping-card$/,
      /^\/payment$/,
      /^\/category$/,
      /^\/order$/,
      /^\/order-detail\/[^/]+$/,
      /^\/orders\/[^/]+$/,
      /^\/service-details\/[^/]+$/,
      /^\/details\/[^/]+$/,
      /^\/product\/[^/]+$/,
      /^\/product;idCategory=[^/]+$/
    ];
    for (let pattern of patterns) {
      if (pattern.test(url)) {
        return false;
      }
    }

    return true;
  }

  getContador():number{
   return this.cartService.getCartSession().totalCart;
  }
  getValor():number{
    return this.cartService.valorTotal;

  }

  ngOnInit(){
  }

  public getUserSession(): any {
    return this.loginService.getUserSession();
  }

  public isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

}
