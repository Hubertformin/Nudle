import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../../../providers/settings.service';
import {MatRadioChange} from '@angular/material';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-start-up',
  templateUrl: './start-up-config.component.html',
  styleUrls: ['./start-up-config.component.scss']
})
export class StartUpConfigComponent implements OnInit {
  startUpValue = new FormControl('');

  constructor(private config: SettingsService) { }

  ngOnInit() {
    this.startUpValue.patchValue(this.config.get('startup_url'));
  }

  onStartUpSelect($event: MatRadioChange) {
    this.config.set('startup_url', $event.value);
  }
}
