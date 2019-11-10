import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../../../providers/settings.service';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-about',
  templateUrl: './about-config.component.html',
  styleUrls: ['./about-config.component.scss']
})
export class AboutConfigComponent implements OnInit {
  aboutIcon = faInfoCircle;

  constructor(private config: SettingsService) { }

  ngOnInit() {
  }
  get AppConfig() {
    return this.config.AppConfig;
  }

}
