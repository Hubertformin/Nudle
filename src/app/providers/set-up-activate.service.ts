/*
 * Copyright (c) 2019. A production of Enchird-Tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 */
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {SettingsService} from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class SetUpActivateService implements CanActivate {
  constructor(private config: SettingsService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // get users,
    if (!this.config.getAllConfig().applicationConfigured) {
      this.router.navigate(['/set-up']);
      return false;
    }
    return true;
  }
}
