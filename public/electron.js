const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron')
const execa = require('execa')
const isDev = require('electron-is-dev')
const { autoUpdater } = require("electron-updater")
const fs = require("fs")
const path = require("path")

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
    const sbMigGuiVersion = '0.0.1'
    dialog.showMessageBoxSync({
        type: 'error',
        title: "sb-mig GUI Version",
        message: `${sbMigGuiVersion}`
    })
}


function createMenu() {
    const menuTemplate = [
        { role: 'appMenu' },
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

function createWindow () {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    },
  })

  win.loadURL(isDev ? `http://localhost:3000` : `file://${path.join(__dirname, "../build/index.html")}`)
  // win.loadFile('./build/index.html')
}

app.whenReady().then(() => {
    createWindow()
    createMenu()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', () => {
  console.log("dirrname: ", __dirname)
  console.log("process.cwd(): ", process.cwd())
  console.log("app.getAppPath(): ", app.getAppPath())
  autoUpdater.checkForUpdatesAndNotify();
})

ipcMain.handle("get-app-path", () => {
   console.log("invoked from startup useEffect: ", app.getAppPath())
})


app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


ipcMain.handle('perform-action', (event, ...args) => {
  console.log("##### perform-action #####")
  console.log("event: ")
  console.log(event)
  console.log("args")
  console.log(args)
})