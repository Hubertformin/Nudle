import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {MaterialComponentsModuleModule} from '../material-components-module/material-components-module.module';
import {StoreModule} from '@ngrx/store';
import {settingsReducer, authUserReducer} from '../../state/reducers/app.reducer';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {WebviewDirective} from '../../directives/webview.directive';
import {TimeAgoPipe} from '../../pipes/time-ago.pipe';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { RandomColorDirective } from '../../directives/random-color.directive';
import { LocalCurrencyPipe } from '../../pipes/local-currency.pipe';
import {ImagePipe} from '../../pipes/image.pipe';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [WebviewDirective, TimeAgoPipe, RandomColorDirective, LocalCurrencyPipe, ImagePipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    MaterialComponentsModuleModule,
    ScrollingModule,
    StoreModule.forRoot({
      settings: settingsReducer,
      authUser: authUserReducer
    })
  ],
  exports: [
    WebviewDirective,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    TranslateModule,
    MaterialComponentsModuleModule,
    ScrollingModule,
    StoreModule,
    TimeAgoPipe,
    RandomColorDirective,
    LocalCurrencyPipe, ImagePipe
  ]
})
export class SharedModule { }
