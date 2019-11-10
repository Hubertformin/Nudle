import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import * as $ from 'jquery';
import {FormBuilder, Validators} from '@angular/forms';
import {SettingsService} from '../../providers/settings.service';
import {DbService} from '../../providers/db.service';
import {AuthService} from '../../providers/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    username: [null, Validators.required],
    password: [null, Validators.required]
  });
  loading: boolean;

  constructor(
    private snackBar: MatSnackBar,
    private config: SettingsService,
    private formBuilder: FormBuilder,
    private db: DbService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // authenticate user....
    $('#loginForm').off().on('submit', (e) => {
      e.preventDefault();
      if (this.loginForm.invalid) {
        this.snackBar.open('Please fill out form', 'cancel', {duration: 2500});
        return;
      }
      // show loading
      this.loading = true;
      // this.router.navigate(['/master/dashboard']);
      this.db.authenticate(this.username.value, this.password.value)
        .then((user) => {
          this.loading = false;
          // if credentials are correct, login user
          if (user) {
            this.authService.login(user);
          } else {
            // if credentials are wrong ..
            this.loading = false;
            this.loginForm.reset(); // resetting form
            this.snackBar.open('Wrong login credentials', 'cancel', {duration: 2500});
          }
        })
        .catch((err) => {
          // TODO: Logger
            console.error(err);
          this.loading = false;
          this.snackBar.open('Unknown error. Please restart application', 'cancel', {duration: 4500});
        });
    });
  }
  // getter for username
  get username() {
    return this.loginForm.get('username');
  }
  // getter for password
  get password() {
    return this.loginForm.get('password');
  }
  // get theme style
  get lightTheme() {
    return this.config.get('lightTheme');
  }
}
