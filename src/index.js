const { app, BrowserWindow } = require('electron');
const path = require('path');
const ipcMain = require('electron').ipcMain;
const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const { user_table } = require('./sequelize');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

var mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


ipcMain.on('do_login', function (event, data) {
  mainWindow.loadFile(path.join(__dirname, 'admin.html'))
});

ipcMain.on('adminDone', function (event, data) {
  mainWindow.loadFile(path.join(__dirname, 'index.html'))
});

ipcMain.on('saveUser', function (event, user) {
  user_table.findAll({
    where: {
      idlogin_kartu: user.idlogin_kartu
    }
  }).then(user_table_find => {
    if (user_table_find.length > 0) {
      user_table.update({
        idlogin_kartu: user.idlogin_kartu,
        nama_kartu: user.nama_kartu,
        pin_kartu: user.pin_kartu,
        role_kartu: user.role_kartu,
      }, {
        where: {
          idlogin_kartu: user.idlogin_kartu
        }
      })
    } else {
      user_table.create(user).then(user_table_create => {
        mainWindow.webContents.send('saveUser', true);
      });
    }
  });
});

ipcMain.on('showUser', function (event, user) {
  user_table.findAll().then(user_table_all => {
    mainWindow.webContents.send('showUser', user_table_all);
  })
})

ipcMain.on('editUser', function (event, id) {
  user_table.findAll({
    where: {
      id: id
    }
  }).then(user_table_find => {
    mainWindow.webContents.send('editUser', user_table_find);
  })
})

ipcMain.on('findUser', function (event, parameter) {
  user_table.findAll({
    where: {
      [Op.or]: [
        {
          nama_kartu: {
            [Op.like]: '%' + parameter + '%'
          }
        },
        {
          idlogin_kartu: {
            [Op.like]: '%' + parameter + '%'
          }
        }
      ]
    }
  }).then(user_table_find => {
    mainWindow.webContents.send('findUser', user_table_find);
  })
})

ipcMain.on('deleteUser', function (event, id) {
  user_table.destroy({
    where: {
      id: id
    }
  }).then(user_table_delete => {
    mainWindow.webContents.send('deleteUser', true);
  })
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
