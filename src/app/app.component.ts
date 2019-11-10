import 'reflect-metadata';

import {Component, OnDestroy, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery';
import {SettingsService} from './providers/settings.service';
import {ElectronService} from './providers/electron.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  company_name: string;
  constructor(public electronService: ElectronService,
    private translate: TranslateService, private config: SettingsService) {
    // Set applications default language-config..
    translate.setDefaultLang(this.config.get('language'));
    // console.log('environment', environment);
    // create database connection.

    if (electronService.isElectron) {
      console.log('Mode electron');
    } else {
      console.log('Mode web');
    }
    // activate workers
    // const syncworker = new Worker('workers/sync.worker');
  }
  // oninit
  ngOnInit(): void {
    console.clear();
    console.log('app init');
    // when application is online
    window.addEventListener('online', (event) => {
      // console.log(event);
    });
    window.addEventListener('offline', (event) => {
      // console.log(event);
    });
    // setting theme
    $('body').removeClass().addClass(this.config.get('theme'));
    // document.body.classList.add('dark-pink-theme');
    /*if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker('./workers/db.worker', { type: 'module' });
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }*/
  }

  ngOnDestroy(): void {
    console.log('Main app was destroyed!');
  }
}
