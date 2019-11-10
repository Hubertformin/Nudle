import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  faShoppingBag,
  faCartArrowDown,
  faUtensils,
  faChalkboardTeacher, faCogs,
  faBoxes, faUser, faUsersCog, faBars,
  faChevronDown, faChartLine, faCashRegister, faArrowUp, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

import {SettingsService} from '../../providers/settings.service';
import {AuthService} from '../../providers/auth.service';
import {UpdateCheckResult} from 'electron-updater';
import * as $ from 'jquery';
import {ElectronService} from '../../providers/electron.service';
// import {ResizeEvent} from 'angular-resizable-element';

interface DownloadProgress {
  percent: number;
  bytesPerSecond: number;
  transferred: number;
  total: number;
}

@Component({
  selector: 'app-master-root',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit, AfterViewInit {
  // icons
  invoiceIcon = faCashRegister;
  recordedInvoices = faCartArrowDown;
  faShoppingBag = faShoppingBag;
  faUtensils = faUtensils;
  faBoxes = faBoxes;
  faUser = faUser;
  faUserCog = faUsersCog;
  faCompanyIcon = faChalkboardTeacher;
  settings = faCogs;
  navBarMenu = faBars;
  faCheveronDown = faChevronDown;
  reportsIcon = faChartLine;
  //
  progress;
  // side-bar
  sideNavExpanded = true;
  events: any[] = [];
  online: boolean;
  // for updates =============
  updatesDownloadProgress: DownloadProgress;
  updateIcon = faArrowUp;
  updateCheck: UpdateCheckResult;
  downloadingUpdates = false;
  updatesDownloaded = false;
  checkIcon = faCheckCircle;

  constructor(private config: SettingsService,
              private translate: TranslateService, private authService: AuthService,
              private electron: ElectronService, private ref: ChangeDetectorRef
  ) {
    // Set applications default language-config..
    // translate.setDefaultLang(this.config.get('language'));
    // console.log('environment', environment);
  }
  ngOnInit(): void {
    this.online = window.navigator.onLine;
    window.addEventListener('online', (event) => {
      this.online = true;
    });
    window.addEventListener('offline', (event) => {
      this.online = false;
    });
  }

  ngAfterViewInit(): void {
    // check for updates after 2 mins of app init
    setTimeout(() => {
      this.electron.ipcRenderer.send('check-for-updates');
      // if updates are available
      this.electron.ipcRenderer.on('updates-available', (event, arg) => {
        // response containing update object
        this.updateCheck = JSON.parse(arg);
        console.log(this.updateCheck);
        this.ref.detectChanges();
        this.openDialog('#updateModal'); // open update modal
        this.downloadUpdatesBg(false); // whether to download updates in foreground or background
      });
    }, 4000);
    // listen for download progress
    this.electron.ipcRenderer.on('updates-download-progress', (evt, arg) => {
      // download object
      this.updatesDownloadProgress = JSON.parse(arg);
      this.ref.detectChanges();
      console.log(this.updatesDownloadProgress);
    });
    // listen for download complete
    this.electron.ipcRenderer.on('updates-downloaded', (evt, arg) => {
      this.downloadingUpdates = false;
      this.updatesDownloaded = true;
      console.log(arg);
      this.downloadUpdatesBg(false);
      this.ref.detectChanges();
    });
  }
  // open modal
  openDialog(id) {
    $(id).fadeIn('fast');
  }
  // toggle side nav
  toggleSideNav() {
    this.sideNavExpanded = !this.sideNavExpanded;
  }
  // get company name
  get companyName() {
    return this.config.get('company_name');
  }
  get lightTheme() {
    return this.config.get('lightTheme');
  }
  get authUser() {
    return this.authService.getAuthUser();
  }

  // compute speed form B/s
  getSpeed(bytes: number) {
    if (bytes >= 1000000000) {
      return (bytes / 1000000000).toFixed(1) + ' GB/s';
    }
    if (bytes >= 1000000) {
      return (bytes / 1000000).toFixed(1) + ' MB/s';
    }
    if (bytes >= 1000) {
      return (bytes / 1000).toFixed(1) + ' KB/s';
    }
    if (bytes < 1000) {
      return bytes.toFixed(1) + ' B/s';
    }
  }

  // onResizeEnd(event: ResizeEvent): void {
  //   console.log('Element was resized', event);
  // }
  logOut() {
    this.authService.logOut();
  }

  downloadUpdate(b: boolean) {
    this.downloadingUpdates = true;
    this.electron.ipcRenderer.send('download-updates');
    this.ref.detectChanges();
  }

  closeUpdateModal(cancelUpdate: boolean) {
    $('#updateModal').fadeOut('fast');
  }

  installUpdates() {
    this.electron.ipcRenderer.send('install-updates');
  }

  downloadUpdatesBg(background: boolean) {
    const update_b = $('#backgroundDownloadUpdates');
    if (background) {
      this.closeUpdateModal(false);
      update_b.fadeIn('fast');
    } else {
      this.openDialog('#updateModal');
      update_b.fadeOut('fast');
    }
  }
}
