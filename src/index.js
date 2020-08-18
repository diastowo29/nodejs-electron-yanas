const { app, BrowserWindow } = require('electron');
const path = require('path');
const ipcMain = require('electron').ipcMain;
const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const { user_table, trx_table, parameter_table, session_table, log_table } = require('./sequelize');

var logged_in_user = '';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

var mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
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


ipcMain.on('doLogin', function (event, userId, userPin) {
  user_table.findOne({
    where: {
      [Op.and]: [
        {
          idlogin_kartu: {
            [Op.eq]: userId
          }
        },
        {
          pin_kartu: {
            [Op.eq]: userPin
          }
        }
      ]
    }
  }).then(user_table_find => {
    if (user_table_find === null) {
      mainWindow.webContents.send('doLogin', false);
    } else {
      logged_in_user = user_table_find.dataValues.idlogin_kartu;
      session_table.create({
        user_id: user_table_find.dataValues.id
      })
      if (user_table_find.dataValues.role_kartu == 'Admin') {
        mainWindow.loadFile(path.join(__dirname, 'admin.html'))
      } else {
        mainWindow.loadFile(path.join(__dirname, 'user.html'))
      }
    }
  })
});

ipcMain.on('doUserIdValidate', function (event, userId) {
  user_table.findAll({
    where: {
      idlogin_kartu: userId
    }
  }).then(user_table_find => {
    if (user_table_find.length > 0) {
      mainWindow.webContents.send('doUserIdValidate', true);
    } else {
      mainWindow.webContents.send('doUserIdValidate', false);
    }
  })
})

ipcMain.on('ambilBeras', function(event, data) {
  // console.log(logged_in_user)
  user_table.findOne({
    where: {
      idlogin_kartu: logged_in_user
    }
  }).then(user_table_find => {
    mainWindow.webContents.send('ambilBeras', user_table_find);
  })
})

ipcMain.on('tarikBeras', function (event, qty) {

  createLog(logged_in_user, 'AMBIL BERAS ' + qty);
})

ipcMain.on('bypassLogin', function (event, data) {
  mainWindow.loadFile(path.join(__dirname, 'user.html'));
  // mainWindow.loadFile(path.join(__dirname, 'admin.html'));
})

ipcMain.on('getUserList', function (event, data) {
  user_table.findAll().then(user_table_all => {
    mainWindow.webContents.send('getUserList', user_table_all);
  })
});

ipcMain.on('saveOpeningSaldo', function (event, userId, openingSaldo) {

  createLog(logged_in_user, 'OPENING SALDO USER: ' + userId)

  user_table.update({
    max_beras: openingSaldo
  }, {
    where: {
      id: userId
    }
  }).then(user_table_update => {
    mainWindow.webContents.send('saveOpeningSaldo', true);
  })
})

ipcMain.on('savePin', function (event, userId, newPin, oldPin) {
  createLog(logged_in_user, 'UBAH PIN')

  user_table.findAll({
    where: {
      [Op.and]: [
        {
          idlogin_kartu: {
            [Op.eq]: userId
          }
        },
        {
          pin_kartu: {
            [Op.eq]: oldPin
          }
        }
      ]
    }
  }).then(user_table_find => {
    if (user_table_find.length > 0) {
      user_table.update({
        pin_kartu: newPin
      }, {
        where: {
          idlogin_kartu: userId
        }
      }).then(user_table_update => {
        mainWindow.webContents.send('savePin', true);
      })
    } else {
      mainWindow.webContents.send('savePin', false);
    }
  })
})

ipcMain.on('adminDone', function (event, data) {
  session_table.destroy({
    truncate: true
  }).then(session_deleted => {
    mainWindow.loadFile(path.join(__dirname, 'index.html'))
  })
});

ipcMain.on('userChangePin', function (event, data) {
  session_table.findAll().then(session_found => {
    user_table.findOne({
      where: {
        id: session_found[0].dataValues.user_id
      }
    }).then(user_found => {
      mainWindow.webContents.send('userChangePin', user_found);
    })
  })
})

ipcMain.on('userCekSaldo', function (event, data) {
  createLog(logged_in_user, 'CEK SALDO');

  session_table.findAll().then(session_found => {
    user_table.findOne({
      where: {
        id: session_found[0].dataValues.user_id
      }
    }).then(user_found => {
      mainWindow.webContents.send('userCekSaldo', user_found);
    })
  })
})

ipcMain.on('showParameter', function (event, data) {
  parameter_table.findAll().then(parameter_table_all => {
    mainWindow.webContents.send('showParameter', parameter_table_all);
  })
})

ipcMain.on('saveParameter', function (event, parameter) {
  
  createLog(logged_in_user, 'UBAH PARAMETER');

  parameter_table.findAll().then(parameter_table_all => {
    if (parameter_table_all.length > 0) {
      let parameterId = parameter_table_all[0].dataValues.id;
      parameter_table.update(
        parameter,
        {
          where: {
            id: parameterId
          }
        }).then(parameter_table_update => {
          mainWindow.webContents.send('saveParameter', true);
        })
    } else {
      parameter_table.create(parameter).then(parameter_table_create => {
        mainWindow.webContents.send('saveParameter', true);
      });
    }
  });
});

ipcMain.on('showTrx', function (event, data) {
  trx_table.findAll().then(trx_table_all => {
    mainWindow.webContents.send('showTrx', trx_table_all);
  });
});

ipcMain.on('saveTrx', function (event, trx) {
  trx_table.create(trx).then(trx_table_create => {
    mainWindow.webContents.send('saveTrx', true);
  });
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

ipcMain.on('editTrx', function (event, id) {
  trx_table.findAll({
    where: {
      id: id
    }
  }).then(trx_table_find => {
    mainWindow.webContents.send('editTrx', trx_table_find);
  })
})

ipcMain.on('findTrx', function (event, parameter) {
  trx_table.findAll({
    where: {
      [Op.or]: [
        {
          trx_id: {
            [Op.like]: '%' + parameter + '%'
          }
        },
        {
          trx_name: {
            [Op.like]: '%' + parameter + '%'
          }
        }
      ]
    }
  }).then(trx_table_find => {
    mainWindow.webContents.send('findTrx', trx_table_find);
  })
})

ipcMain.on('findUser', function (event, parameter) {
  createLog(logged_in_user, 'CARI USER: ' + parameter);
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
  createLog(logged_in_user, 'DELETE USER');
  user_table.destroy({
    where: {
      id: id
    }
  }).then(user_table_delete => {
    mainWindow.webContents.send('deleteUser', true);
  })
})

ipcMain.on('showHistory', function (event, userId, hFrom, hTo) {
  // console.log(userId + hFrom + hTo);
  log_table.findAll({
    where: {
      [Op.and]: [
        {
          user_id: {
            [Op.eq]: userId
          }
        },
        {
          createdAt: {
            [Op.gt]: hFrom,
            [Op.lt]: hTo
          }
        }
      ]
    }
  }).then(log_found => {
    mainWindow.webContents.send('showHistory', log_found)
  })
})

function createLog (user_id, activity) {
  log_table.create({
    user_id: user_id,
    activity: activity
  });
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
