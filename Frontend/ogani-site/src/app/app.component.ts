import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./template/navbar/navbar.component";
import { NgOptimizedImage } from '@angular/common';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, NavbarComponent, NgOptimizedImage]
})
export class AppComponent {
  title = 'project-plus';

  constructor(private router: Router) {}
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

}
