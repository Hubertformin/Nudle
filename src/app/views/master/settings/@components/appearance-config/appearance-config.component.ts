import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../../../providers/settings.service';
import * as $ from 'jquery';
import {faCheckSquare} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance-config.component.html',
  styleUrls: ['./appearance-config.component.scss']
})
export class AppearanceConfigComponent implements OnInit {
  checkIcon = faCheckSquare;

  constructor(public config: SettingsService) { }

  ngOnInit() {
  }
  /**
   * Getters*/
  get theme() {
    return this.config.get('theme');
  }

  // change theme
  changeTheme($event: MouseEvent, theme: string, lightTheme: boolean) {
    this.config.setTheme(theme, lightTheme);
    $('.theme-box').removeClass('active');
    $($event.target).addClass('active');
  }
}
