import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login/services/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  selectedLink: string;

  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    this.selectedLink = '';
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

  onLinkClick(link: string): void {
    this.selectedLink = link;
  }
}
