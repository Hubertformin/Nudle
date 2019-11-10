"use strict";
exports.__esModule = true;
/*
 * Copyright (c) 2019. A production of Enchird-Tech, all rights reserved, no part of the project should be reproduced without prior concern of authorized personnel.
 */
var fs = require("fs");
var models_1 = require("../models");
var electron_util_1 = require("electron-util");
var Directories = /** @class */ (function () {
    function Directories() {
    }
    /**
     * @method
     * @name initialize
     * */
    Directories.initialize = function () {
        // console.log('Home directory: ' + Directories.HOME_DIR);
        if (electron_util_1.is.development) {
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
            fs.writeFileSync(this.RESOURCE_DIR + 'locales.json', JSON.stringify(['CM', 'NG', 'CF', 'TD', 'CG', 'GA', 'GQ']));
        }
    };
    /**
     * Create folders
     * */
    Directories.createFolder = function (dirName) {
        if (!fs.existsSync(dirName)) {
            try {
                fs.mkdirSync(dirName);
            }
            catch (e) {
                console.error(e);
            }
        }
    };
    /**
     * Create files sync
     * */
    Directories.writeFileSync = function (fileName, data) {
        try {
            fs.writeFileSync(fileName, data, { encoding: 'utf8' });
        }
        catch (e) {
            console.error(e);
        }
    };
    /**
     * Create files async
     * */
    Directories.writeFile = function (fileName, data, encoding) {
        if (encoding === void 0) { encoding = 'utf8'; }
        return new Promise(function (resolve, reject) {
            fs.writeFile(fileName, data, { encoding: encoding }, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };
    /**
     * @method
     * @name getAppConfig
     * */
    Directories.getAppConfig = function () {
        try {
            return JSON.parse(fs.readFileSync(this.SETTINGS_PATH, { encoding: 'utf8' }));
        }
        catch (e) {
            console.error(e);
            this.setAppConfig(new models_1.AppSettings());
            return new models_1.AppSettings();
        }
    };
    /**
     * @method
     * @name setAppConfig
     * */
    Directories.setAppConfig = function (config) {
        try {
            fs.writeFileSync(this.SETTINGS_PATH, JSON.stringify(config), { encoding: 'utf8' });
            return true;
        }
        catch (e) {
            return false;
        }
    };
    /**
     * @method
     * @name getSupportedLocales
     * */
    Directories.getSupportedLocales = function () {
        return JSON.parse(fs.readFileSync(this.RESOURCE_DIR + 'locales.json').toString());
    };
    // public static readonly DESKTOP_DIR = process.env.HOMEPATH + '/Desktop';
    Directories.HOME_DIR = process.env.APPDATA;
    Directories.ENTERPRISE_DIR = Directories.HOME_DIR + '/Enchird';
    Directories.APP_DATA_DIR = Directories.ENTERPRISE_DIR + '/Nudle';
    // development env
    Directories.BIN_DIR = (electron_util_1.is.development) ? process.cwd() + '/bin' : Directories.APP_DATA_DIR + '/bin';
    Directories.RESOURCE_DIR = (electron_util_1.is.development) ? process.cwd() + '/bin/.res' : Directories.BIN_DIR + '/.res';
    Directories.USERS_RES_DIR = (electron_util_1.is.development) ? process.cwd() + '/bin/.res/users' : Directories.RESOURCE_DIR + '/users';
    Directories.SETTINGS_PATH = (electron_util_1.is.development) ? process.cwd() + '/bin/.cfg' : Directories.BIN_DIR + '/.cfg';
    Directories.DATABASE_PATH = (electron_util_1.is.development) ? process.cwd() + '/bin/database.db' : Directories.BIN_DIR + '/_nudle.db';
    return Directories;
}());
exports.Directories = Directories;
