import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../../../providers/settings.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy-config.component.html',
  styleUrls: ['./privacy-config.component.scss']
})
export class PrivacyConfigComponent implements OnInit {
  usage_feedback: boolean;
  access_location: boolean;

  constructor(public config: SettingsService) { }

  ngOnInit() {
    this.usage_feedback = this.config.get('usage_feedback');
    this.access_location = this.config.get('access_location');
  }

  onChange() {
    this.config.setKeys({usage_feedback: this.usage_feedback, access_location: this.access_location});
  }
}
