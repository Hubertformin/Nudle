/*
 * Copyright (c) 2019. A production of Enchird-Tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 */
import * as fs from 'fs';
import {AppSettings, SettingsModel} from '../models';
import {is} from 'electron-util';

export class Directories {
  // public static readonly DESKTOP_DIR = process.env.HOMEPATH + '/Desktop';
  private static readonly HOME_DIR = process.env.APPDATA;
  public static readonly ENTERPRISE_DIR = Directories.HOME_DIR + '/Enchird';
  public static readonly APP_DATA_DIR = Directories.ENTERPRISE_DIR + '/Nudle';
  // development env
  public static readonly BIN_DIR = (is.development) ? process.cwd() + '/bin' : Directories.APP_DATA_DIR + '/bin';
  public static readonly RESOURCE_DIR = (is.development) ? process.cwd() + '/bin/.res' : Directories.BIN_DIR + '/.res';
  public static readonly USERS_RES_DIR = (is.development) ? process.cwd() + '/bin/.res/users' : Directories.RESOURCE_DIR + '/users';
  public static readonly SETTINGS_PATH = (is.development) ? process.cwd() + '/bin/.cfg' : Directories.BIN_DIR + '/.cfg';
  public static readonly DATABASE_PATH = (is.development) ? process.cwd() + '/bin/database.db' : Directories.BIN_DIR + '/_nudle.db';
  /**
   * @method
   * @name initialize
   * */
  static initialize() {
    // console.log('Home directory: ' + Directories.HOME_DIR);
    if (is.development) {
        // create if not exist enterprise folder
        this.createFolder(this.ENTERPRISE_DIR);
        // create if not exist App data folder.
        this.createFolder(this.APP_DATA_DIR);
    }
    // create if not exist binaries folder.
    this.createFolder(this.BIN_DIR);
    // create if not exist resource folder.
    this.createFolder(this.RESOURCE_DIR);
    // users resources
    this.createFolder(this.USERS_RES_DIR);
    // create settings file...
    // this.createFile(this.SETTINGS_PATH, JSON.stringify(new AppSettings()));
    // create locals
    if (!fs.existsSync(this.RESOURCE_DIR + 'locales.json')) {
      fs.writeFileSync(this.RESOURCE_DIR + 'locales.json', JSON.stringify(
        ['CM', 'NG', 'CF', 'TD', 'CG', 'GA', 'GQ']
      ));
    }
  }
  /**
   * Create folders
   * */
  static createFolder(dirName: string) {
    if (!fs.existsSync(dirName)) {
      try {
        fs.mkdirSync(dirName);
      } catch (e) {
        console.error(e);
      }
    }
  }
  /**
   * Create files sync
   * */
  static writeFileSync(fileName: string, data: string) {
    try {
      fs.writeFileSync(fileName, data, {encoding: 'utf8'});
    } catch (e) {
      console.error(e);
    }
  }
  /**
   * Create files async
   * */
  static writeFile(fileName: string, data: any, encoding = 'utf8'): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fs.writeFile(fileName, data, {encoding}, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  /**
   * @method
   * @name getAppConfig
   * */
  static getAppConfig(): SettingsModel {
    try {
      return  JSON.parse(fs.readFileSync(this.SETTINGS_PATH, {encoding: 'utf8'}));
    } catch (e) {
      console.error(e);
      this.setAppConfig(new AppSettings());
      return new AppSettings();
    }
  }
  /**
   * @method
   * @name setAppConfig
   * */
  static setAppConfig(config: SettingsModel) {
    try {
      fs.writeFileSync(this.SETTINGS_PATH, JSON.stringify(config), {encoding: 'utf8'});
      return true;
    } catch (e) {
      return false;
    }
  }
  /**
   * @method
   * @name getSupportedLocales
   * */
  static getSupportedLocales(): string[] {
    return JSON.parse(fs.readFileSync(this.RESOURCE_DIR + 'locales.json').toString());
  }
}
