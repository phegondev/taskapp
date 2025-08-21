import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private readonly apiService: ApiService, private router: Router){}

  get isAuthenticated():boolean{
    return this.apiService.isAthenticated();
  }
  
  handleLogout():void{
    const isLogout = window.confirm("Are you sure you want to logout?");
    if (isLogout) {
      this.apiService.logout();
      this.router.navigate(['/login'])
    }
  }

}
