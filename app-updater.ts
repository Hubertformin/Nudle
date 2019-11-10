/*
 // tslint:disable-next-line:max-line-length
 * Copyright (c) 2019. A production of Enchird-Tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 */
import {AppUpdater, autoUpdater, UpdateCheckResult} from 'electron-updater';

export default class NudleUpdater {
  private readonly autoUpdater: AppUpdater;
  constructor(autoDownload = false, allowDowngrade = false) {
    this.autoUpdater = autoUpdater;
    // const log = require('electron-log');
    // log.transports.file.level = 'debug';
    // this.autoUpdater.logger = log;
    this.autoUpdater.autoDownload = autoDownload;
    this.autoUpdater.allowDowngrade = allowDowngrade;
    this.autoUpdater.autoInstallOnAppQuit = true;
  }
  // check for updates
  checkForUpdates(): Promise<UpdateCheckResult> {
    return this.autoUpdater.checkForUpdatesAndNotify();
  }
  // getter
  getUpdater() {
    return this.autoUpdater;
  }
}
