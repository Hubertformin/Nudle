import {app, BrowserWindow, screen, ipcMain, Menu} from 'electron';
import * as path from 'path';
import * as url from 'url';
import {Directories} from './api/modules/directories-module';
import NudleUpdater from './app-updater';
import {PrinterAction} from './api/actions';
const {is} = require('electron-util');


let win;
let splashWin;
// let serve;
// const args = process.argv.slice(1);
// serve = args.some(val => val === '--serve');
// setting enviromental variables
// process.env.GOOGLE_API_KEY = 'AIzaSyC8K2tIvm1xfjrFiiyrYULA-hSPje9xFHk';


/**
 * @function createAppWindow
 * */
function createAppWindow() {

  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    icon: 'assets/icon.png',
    show: false,
    title: 'Nudle',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (is.development) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  if (is.development) {
    win.webContents.openDevTools();
    // console.log(win.webContents.getPrinters());
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

}
/*
* @function createSplashWindow
* */
function createSplashScreen() {

  splashWin = new BrowserWindow({
    width: 640,
    height: 400,
    icon: 'assets/icon.png',
    title: 'Nudle',
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  splashWin.center();

  splashWin.loadURL(url.format({
    pathname: path.join(__dirname, 'splash-screen/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  splashWin.webContents.on('did-finish-load', (event) => {
    console.log('finished');
    splashWin.show();
  });
}

try {
  // creating binaries directories if they don't exist
  Directories.initialize();
  // initialize db
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
 // app.on('ready', createAppWindow);
  // menu
  const template = [
    // { role: 'appMenu' }
    ...(process.platform === 'darwin' ? [{
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        is.macos ? { role: 'close' } : { role: 'quit' }
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(is.macos ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startspeaking' },
              { role: 'stopspeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(is.macos ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://enchirdentity.com/nudle');
          }
        },
        {label: 'Check for updates'}
      ]
    }
  ];
// @ts-ignore
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  app.on('ready', () => {
    // splash screen
    // createSplashScreen();
        // the create application window
        createAppWindow();
        // maximize window
        win.maximize();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createAppWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}

// check for updates on request from render process
const nudleUpdater = new NudleUpdater(false, true);
// check for updates
ipcMain.on('check-for-updates', (event, arg) => {
  nudleUpdater.checkForUpdates();
  // const data: UpdateCheckResult = {
  //   updateInfo: {
  //     version: '2019.0.2',
  //     releaseDate: new Date().toISOString(),
  //     releaseName: 'Nudle 2019',
  //     releaseNotes: 'Fixed recurrent update files | Introducing preview with google sheets | Demographic maps with plotter',
  //     path: '',
  //     files: null,
  //     sha512: null
  //   },
  //   versionInfo: undefined
  // };
  // win.webContents.send('updates-available', JSON.stringify(data));
});

// if update available
nudleUpdater.getUpdater().on('update-available', (evt) => {
  win.webContents.send('update-available', JSON.stringify(event));
  console.log(evt);
});
// if no updates available
nudleUpdater.getUpdater().on('updates-not-available', (evt) => {
  win.webContents.send('update-available', JSON.stringify(event));
  console.log(evt);
});

// if download of updates has been enabled, download update
nudleUpdater.getUpdater().on('download-progress', (progress) => {
  console.log(progress);
  win.webContents.send('updates-download-progress',  JSON.stringify(progress));
});

//  when download complete
nudleUpdater.getUpdater().on('update-downloaded', (evt) => {
  win.webContents.send('update-downloaded', evt);
});

// download updates
ipcMain.on('download-updates', (evt) => {
  // 1. production
  nudleUpdater.getUpdater().downloadUpdate();
  // 2. simulation
  /*const downloadProgress = {percent: 0, bytesPerSecond: 0, transferred: 0, total: 500};
  const interval = setInterval(() => {
    if (downloadProgress.percent < 100) {
      downloadProgress.percent += 1;
      downloadProgress.transferred += 5;
      downloadProgress.bytesPerSecond = (1000000 - (Math.random() * 1000000));
      win.webContents.send('download-progress', JSON.stringify(downloadProgress));
      // set progress bar
      win.setProgressBar(downloadProgress.percent / 100);
    } else {
      win.webContents.send('updates-downloaded', evt);
      clearInterval(interval);
      win.setProgressBar(-1);
      return;
    }
  }, 500);*/
});

// install updates
ipcMain.on('install-updates', (evt) => {
  nudleUpdater.getUpdater().quitAndInstall();
  console.log('quit app and update');
});

/*===================================================================================
=====================================================================================
*/

// icp listener functions
ipcMain.on('get-printers', (event, arg) => {
  event.returnValue = JSON.stringify(win.webContents.getPrinters());
});
// print order
ipcMain.on('print-sale', (event, arg) => {
  PrinterAction.printSale(JSON.parse(arg)).then((abc) => {
    // alert(abc);
}).catch(er => console.error(er));
});

// main process
