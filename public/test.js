const {ipcMain} = require('electron');

ipcMain.handle('perform-action', (event, ...args) => {
  console.log("##### perform-action #####")
  console.log("event: ")
  console.log(event)
  console.log("args")
  console.log(args)
})