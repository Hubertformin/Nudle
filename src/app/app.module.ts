import 'reflect-metadata';
import '../polyfills';

import {LOCALE_ID, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';

import { LoginComponent } from './views/login/login.component';
import { SetUpComponent } from './views/set-up/set-up.component';
import {SharedModule} from './modules/shared/shared.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PromptPasswordDialogComponent} from './providers/prompt-password.service';
import {MasterModule} from './views/master/master.module';
import {HttpClientModule} from '@angular/common/http';
import {CompleteSaleDialogComponent} from './providers/sale-dialog.service';
import {ExportMenuReportsComponent} from './providers/export.service';
import {IConfig, NgxMaskModule} from 'ngx-mask';


export let options: Partial<IConfig> | (() => Partial<IConfig>) = {};
@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        SetUpComponent,
        PromptPasswordDialogComponent,
        CompleteSaleDialogComponent,
        ExportMenuReportsComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        HttpClientModule,
        AppRoutingModule,
        MasterModule,
        NgxMaskModule.forRoot(options),
    ],
    bootstrap: [AppComponent],
    entryComponents: [PromptPasswordDialogComponent, CompleteSaleDialogComponent, ExportMenuReportsComponent],
    providers: [
        {provide: LOCALE_ID, useValue: 'en-GB'}
    ]
})
export class AppModule { }
