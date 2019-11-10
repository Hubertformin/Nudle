import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileConfigComponent } from './@components/profile-config/profile-config.component';
import { SubscriptionConfigComponent } from './@components/subscription-config/subscription-config.component';
import { AppearanceConfigComponent } from './@components/appearance-config/appearance-config.component';
import { LanguageConfigComponent } from './@components/language-config/language-config.component';
import { InvoicesConfigComponent } from './@components/invoices-config/invoices-config.component';
// import { ReportsConfigComponent } from './@components/reports-config/reports-config.component';
import { PrinterConfigComponent } from './@components/printer-config/printer-config.component';
import { StartUpConfigComponent } from './@components/start-up-config/start-up-config.component';
import { PrivacyConfigComponent } from './@components/privacy-config/privacy-config.component';
import { AboutConfigComponent } from './@components/about-config/about-config.component';
import {SharedModule} from '../../../modules/shared/shared.module';
import {SettingsComponent} from './settings.component';
import {SettingsRoutingModule} from './settings-routing.module';


@NgModule({
  declarations: [
    SettingsComponent,
    ProfileConfigComponent,
    SubscriptionConfigComponent,
    AppearanceConfigComponent,
    LanguageConfigComponent,
    InvoicesConfigComponent,
    // ReportsConfigComponent,
    PrinterConfigComponent,
    StartUpConfigComponent,
    PrivacyConfigComponent,
    AboutConfigComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
