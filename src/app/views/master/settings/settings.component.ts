import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../providers/settings.service';
import {
  faChartLine,
  faInfoCircle,
  faLanguage,
  faLock,
  faMoneyCheck,
  faPalette,
  faPowerOff,
  faPrint, faShoppingBasket,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  userIcon = faUser;
  subscriptionIcon = faMoneyCheck;
  appearanceIcon = faPalette;
  privacyIcon = faLock;
  startUpIcon = faPowerOff;
  aboutIcon = faInfoCircle;
  printerIcon = faPrint;
  languageIcon = faLanguage;
  invoiceIcon = faShoppingBasket;
  reportsIcon = faChartLine;
  //
  activeScreen: string;


  constructor(private config: SettingsService, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeScreen = 'Profile';
    this.activeRoute.paramMap.subscribe((params: any) => {
      this.activeScreen = params.params.view ? params.params.view : 'Profile';
    });
    console.log(this.config.getAllConfig());
  }
}
