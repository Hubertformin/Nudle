import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../../../providers/settings.service';
import * as locale from 'countrycitystatejson';
import {TranslateService} from '@ngx-translate/core';
import {Directories} from '../../../../../../../api/modules/directories-module';

@Component({
  selector: 'app-language',
  templateUrl: './language-config.component.html',
  styleUrls: ['./language-config.component.scss']
})
export class LanguageConfigComponent implements OnInit {
  supportedLocales: any[];
  selectedCountry: any;
  statesModel;
  cityModel;
  currencyModel;

  constructor(private config: SettingsService, private translate: TranslateService) { }

  ngOnInit() {
    // cameroon and nigeria supported for now..
    // this.supportedLocales = [locale.getCountryByShort('CM'), locale.getCountryByShort('NG')];
    this.supportedLocales = Directories.getSupportedLocales().map(lc => locale.getCountryByShort(lc));
    if (this.company_country !== '') {
      this.countrySelected(this.company_country);
    }
    if (this.country_state !== '') {
      this.stateSelected(this.country_state);
    }
  }
  /**
   * Getters
   * */
  get language() {
    return this.config.get('language');
  }
  get company_country() {
    return this.config.get('company_country');
  }
  get country_state() {
    return this.config.get('company_state');
  }
  get country_city() {
    return this.config.get('company_city');
  }
  get country_currency() {
    return this.config.get('company_currency');
  }
  get country_phone() {
    return this.config.get('company_phone');
  }
  /**
   * @default Regional and language-config settings*/
  languageChange(lang) {
    this.config.set('language', lang);
    this.translate.setDefaultLang(lang);
  }
  // country selected
  countrySelected(e) {
    this.selectedCountry = this.supportedLocales.find((el: any) => {
      return el.name === e;
    });
    this.statesModel = Object.keys(this.selectedCountry.states); // get array of states form country-state data
    this.currencyModel = this.selectedCountry.currency; // get currency from country-state data
    // set the following config if the country select is modified...
    this.config.set('company_country', e);
    this.config.set('company_currency', this.selectedCountry.currency);
    this.config.set('country_phone', this.selectedCountry.phone);
  }

  stateSelected(value) {
    this.cityModel = this.selectedCountry.states[value];
    this.config.set('company_state', value);
  }
  citySelected(value) {
    this.config.set('company_city', value);
  }
  setCurrency(value) {
    this.config.set('company_currency', value);
  }

}
