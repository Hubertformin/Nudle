import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SettingsModel } from '../../../api/models';
import { AppState } from '../state/app.state';
import * as SettingsActions from '../state/actions/settings.actions';
import * as fs from 'fs';
import * as $ from 'jquery';
import {Directories} from '../../../api/modules/directories-module';

interface Author {
  name: string;
  email: string;
}
interface Config {
  name: string;
  version: string;
  description: string;
  homepage: string;
  author: Author;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings: Observable<SettingsModel>;
  private config: SettingsModel;
  private readonly app: Config;
  // private titleBar = new Titlebar({
  //   backgroundColor: Color.fromHex('#FFF')
  // });

  constructor(private store: Store<AppState>) {
    this.settings = this.store.select('settings');
    this.settings.subscribe((data: SettingsModel) => {
      this.config = data;
    });
    // getting app config
    try {
      this.app = JSON.parse(fs.readFileSync('package.json', {encoding: 'utf-8'}));
    } catch (e) {
      this.app = {name: 'nudle', version: 'recent', description: '', homepage: 'https://silverslopes.com/nudle',
        author: {name: 'Silverslopes', email: 'support@silverslopes.com'}};
    }
  }
  // get all settings
  getAllConfig(): SettingsModel {
    return this.config;
  }
  // get specific settings
  get<T>(key: string): T {
    return this.config[key];
  }
  // set key
  set(key: string, value: any) {
    this.config[key] = value;
    this.store.dispatch(new SettingsActions.UpdateSettings(this.config));
    this.save(); // save settings to file;
  }
  setKeys(obj: SettingsModel) {
    const keys = Object.keys(obj);
    keys.forEach((k, i) => {
      this.config[k] = Object.values(obj)[i];
    });
    this.store.dispatch(new SettingsActions.UpdateSettings(this.config));
    this.save(); // save settings to file;
  }
  // reset settings
  reset() {
    this.store.dispatch(new SettingsActions.ResetSettings());
    this.save(); // save settings to file;
  }
  // private save settings
   save() {
    Directories.setAppConfig(this.config);
  }
  // set application's theme...
  setTheme(theme: string, lightTheme: boolean) {
    $('body').removeClass().addClass(theme);
    this.setKeys({theme, lightTheme});
    // theme is dark theme
    /*if (lightTheme) {
      this.titleBar.updateBackground(Color.fromHex('#FFF'));
    } else {
      this.titleBar.updateBackground(new Color(new RGBA(0, 0, 0, .7)));
    }*/
  }
  // get application info from package.json
  get AppConfig(): Config {
    return this.app;
  }
}
