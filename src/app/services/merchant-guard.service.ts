import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtClientService } from './jwt-client.service';

@Injectable({
  providedIn: 'root'
})
export class MerchantGuardService {

  constructor(private router: Router, private jwtService: JwtClientService) { }

  canLoad(): boolean {
    let token = localStorage.getItem('token');
    
    if (token && this.jwtService.getRole(token) == 'ROLE_MERCHANT' && !this.jwtService.isTokenExpired(token)) {
      return true;
    }
    this.router.navigate(['user', 'login']);
    return false;
  }
}
