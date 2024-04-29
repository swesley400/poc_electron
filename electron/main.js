const { app, ipcMain } = require('electron');
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
const configureTray = require('./tray');
const backend = require('../src/app');
const websocket = require('../src/websocket/pdf');

websocket();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.on('ready', () => {
  configureTray();

  ipcMain.on('teste', (event, title) => {
    console.log(title)
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })
});
