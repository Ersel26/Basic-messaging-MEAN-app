import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { ApiService } from './service/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthUserGuard implements CanActivate {
  
  constructor(
    private _router : Router,
    private _apiService : ApiService
  ) {}

  canActivate() : boolean {
    if(this._apiService.isUserLoggedIn()) {
      return true;
    } else {
      this._router.navigate(['/login']);
      return false;
    }
  }
  
}
