import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../../../providers/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-config.component.html',
  styleUrls: ['./profile-config.component.scss']
})
export class ProfileConfigComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }
  get current_user() {
    return this.auth.getAuthUser();
  }

}
