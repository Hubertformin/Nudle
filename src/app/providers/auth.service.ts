import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import * as AuthActions from '../state/actions/auth.actions';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {StaffEntity} from '../data-access/entities';
import {SettingsService} from './settings.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUserOb$: Observable<StaffEntity>;
  private authUser: StaffEntity;

  constructor(private store: Store<AppState>, private router: Router, private sanitizer: DomSanitizer, private config: SettingsService) {
    this.authUserOb$ = this.store.select('authUser');
    this.authUserOb$.subscribe((data) => {
      this.authUser = data;
    });
  }

  public login(user: StaffEntity) {
    this.store.dispatch(new AuthActions.SetAuthUser(user));
    sessionStorage.setItem('authUser', JSON.stringify(user));
    this.router.navigate(['/master/' + this.config.get('startup_url')]);
  }

  public logOut() {
    this.store.dispatch(new AuthActions.ClearAuthUser());
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  public getAuthUser() {
    return this.authUser;
  }

  isAuthenticated() {
    return sessionStorage.getItem('authUser');
  }
}
