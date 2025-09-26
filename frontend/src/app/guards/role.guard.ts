import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const expectedRole = route.data['role'];

    if (expectedRole === 'admin' && this.auth.isAdmin()) {
      return true;
    }

    if (expectedRole === 'user' && this.auth.isUser()) {
      return true;
    }

    return this.router.parseUrl('/login');
  }
}
