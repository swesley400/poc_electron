const { app, Tray, Menu } = require('electron');
const path = require('path');

function configureTray() {
  const tray = new Tray(path.join(__dirname, 'icon/grastro.ico'));

  if (process.platform === 'win32') {
    tray.on('click', () => {
      console.log("Hello Word");
    });
  }

  const menu = Menu.buildFromTemplate([
    {
      label: 'Exit',
      click() {
        app.quit();
      }
    },
    {
      label: 'Help',
      click() {
        null;
      }
    }
  ]);

  tray.setToolTip('Zscan PDF service');
  tray.setContextMenu(menu);
}

module.exports = configureTray;
