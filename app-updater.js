"use strict";
exports.__esModule = true;
/*
 // tslint:disable-next-line:max-line-length
 * Copyright (c) 2019. A production of Enchird-Tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 */
var electron_updater_1 = require("electron-updater");
var NudleUpdater = /** @class */ (function () {
    function NudleUpdater(autoDownload, allowDowngrade) {
        if (autoDownload === void 0) { autoDownload = false; }
        if (allowDowngrade === void 0) { allowDowngrade = false; }
        this.autoUpdater = electron_updater_1.autoUpdater;
        // const log = require('electron-log');
        // log.transports.file.level = 'debug';
        // this.autoUpdater.logger = log;
        this.autoUpdater.autoDownload = autoDownload;
        this.autoUpdater.allowDowngrade = allowDowngrade;
        this.autoUpdater.autoInstallOnAppQuit = true;
    }
    // check for updates
    NudleUpdater.prototype.checkForUpdates = function () {
        return this.autoUpdater.checkForUpdatesAndNotify();
    };
    // getter
    NudleUpdater.prototype.getUpdater = function () {
        return this.autoUpdater;
    };
    return NudleUpdater;
}());
exports["default"] = NudleUpdater;
