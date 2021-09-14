const {app, BrowserWindow, ipcMain, Menu, dialog, protocol} = require('electron')
const execa = require('execa')
const isDev = require('electron-is-dev')
const {autoUpdater} = require("electron-updater")
const fs = require("fs")
const path = require("path")
const package = require('../package.json')

function getSbMigVersionInDialog() {
  const sbMigVersion = execa.commandSync('sb-mig version', {
    shell: true
  })

  dialog.showMessageBoxSync({
    type: 'error',
    title: "sb-mig Version",
    message: `${sbMigVersion.stdout}`
  })
}

function getGUISbMigVersionInDialog() {
  dialog.showMessageBoxSync({
    type: 'error',
    title: "sb-mig GUI Version",
    message: `${package.version}`
  })
}

function createMenu() {
  const menuTemplate = [
    {role: 'appMenu'},
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          click: () => {
            console.log("you clicked Open!")
          }
        }
      ],
    },
    {
      label: 'Versions',
      submenu: [
        {
          label: 'GUI Version',
          click: () => {
            getGUISbMigVersionInDialog()
            console.log("You use GUID sb-mig version x.x.x")
          }
        },
        {
          label: 'sb-mig Version',
          click: () => {
            getSbMigVersionInDialog()
          }
        }
      ],
    }
  ]

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    title: "sb-mig GUI",
    webPreferences: {
      // Set the path of an additional "preload" script that can be used to
      // communicate between node-land and browser-land.
      preload: path.join(__dirname, "preload.js"),
      devTools: true,
    },
  })

  mainWindow.loadURL(isDev ? `http://localhost:3000` : `file://${path.join(__dirname, "../build/index.html")}`)

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  console.log("dirrname: ", __dirname)
  console.log("process.cwd(): ", process.cwd())
  console.log("app.getAppPath(): ", app.getAppPath())
  autoUpdater.checkForUpdatesAndNotify();
}

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
      "file",
      (request, callback) => {
        const url = request.url.substr(8);
        callback({ path: path.normalize(`${__dirname}/${url}`) });
      },
      (error) => {
        if (error) console.error("Failed to register protocol");
      }
  );
}

app.whenReady().then(() => {
  createWindow()
  createMenu()

  setupLocalFilesNormalizerProxy();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  // Quit when all windows are closed, except on macOS.
  // There, it's common for applications and their menu bar to stay active until
  // the user quits  explicitly with Cmd + Q.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


require('./test')