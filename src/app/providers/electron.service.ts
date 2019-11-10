import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, dialog, DesktopCapturer, CrashReporter, nativeImage, Shell} from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  dialog: typeof dialog;
  fs: typeof fs;
  path: typeof path;
  private _electron;
  private readonly electron;
  /**
   * determines if SPA is running in Electron
   */
  readonly isElectron: boolean;
  readonly process: any;
  readonly shell: Shell;
  readonly isMacOS: boolean;
  readonly isWindows: boolean;
  readonly isLinux: boolean;
  readonly isX86: boolean;
  readonly isX64: boolean;
  readonly isArm: boolean;
  readonly desktopCapturer: DesktopCapturer;
  readonly clipboard: Clipboard;
  readonly crashReporter: CrashReporter;
  readonly nativeImage: typeof nativeImage;
  readonly screen: Screen;

  constructor() {
    this.isElectron = process.type === 'renderer';
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = require('electron').ipcRenderer;
      this.webFrame = require('electron').webFrame;
      this.shell = require('electron').shell;
      this.remote = require('electron').remote;

      this.childProcess = require('child_process');
      this.fs = require('fs');
      this.path = require('fs');
      this.dialog =  remote.dialog;

      this.isMacOS = process.platform === 'darwin';
      this.isWindows = process.platform === 'win32';
      // this.isX86 = false;
      // this.isX64 = false;
      // this.isArm = false;
    }
  }
}
