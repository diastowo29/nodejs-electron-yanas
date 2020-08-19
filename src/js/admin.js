const remote = require('electron').remote;
var ipcRenderer = require('electron').ipcRenderer;

$('#admin_main_menu').show();
$('#user_menu').hide();
$('#trx_menu').hide();

function getUserList () {
    ipcRenderer.send('getUserList', true);
}

ipcRenderer.on('getUserList', function (event, userList) {
    var userListSelect = document.getElementById('user_list_select');
    var userListHistorySelect = document.getElementById('user_list_history_select');
    for (var i=0; i<userList.length; i++) {
        var option = document.createElement('option');
        option.innerHTML = userList[i].dataValues.idlogin_kartu;
        option.setAttribute('value', userList[i].dataValues.id);

        var pinOption = document.createElement('option');
        pinOption.innerHTML = userList[i].dataValues.idlogin_kartu;
        pinOption.setAttribute('value', userList[i].dataValues.idlogin_kartu);

        var historyOption = document.createElement('option');
        historyOption.innerHTML = userList[i].dataValues.idlogin_kartu;
        historyOption.setAttribute('value', userList[i].dataValues.idlogin_kartu);

        userListHistorySelect.appendChild(historyOption);
        userListSelect.appendChild(option);
    }
})

function userClick () {
    ipcRenderer.send('showUser', true);
}

function parameterClick () {
    ipcRenderer.send('showParameter', true);
}

function TrxClick () {
    $('#admin_main_menu').hide();
    $('#user_menu').hide();
    $('#trx_menu').show();
    ipcRenderer.send('showTrx', true);
}

function openingSaldoClick () {
    $('#openingModal').modal('show');
}

function changePinClick () {
    ipcRenderer.send('userChangePin', false);
}

ipcRenderer.on('userChangePin', function (event, userSession) {
    console.log(userSession)
    var userListPinSelect = document.getElementById('user_list_pin_select');

    var pinOption = document.createElement('option');
    pinOption.innerHTML = userSession.dataValues.idlogin_kartu;
    pinOption.setAttribute('value', userSession.dataValues.idlogin_kartu);
    userListPinSelect.appendChild(pinOption);
    
    $('#pinModal').modal('show');
    $('#error_pin').hide();
    $('#error_pin_match').hide();
})

function historyClick () {
    $('#historyModal').modal('show');
}

function doneCLick () {
    ipcRenderer.send('adminDone', false);
}

ipcRenderer.on('showParameter', function (event, parameter) {
    console.log(parameter)
    if (parameter.length > 0) {
        $('#card_digit').val(parameter[0].dataValues.card_digit);
        $('#max_beras_hari').val(parameter[0].dataValues.max_beras_hari);
        $('#periode_beras').val(parameter[0].dataValues.periode_beras);
        $('#max_beras_periode_l').val(parameter[0].dataValues.max_beras_periode_l);
        $('#max_beras_periode_x').val(parameter[0].dataValues.max_beras_periode_x);
        $('#auto_reload').prop('checked', parameter[0].dataValues.auto_reload);
        $('#auto_reload_day').val(parameter[0].dataValues.auto_reload_day);
        $('#auto_reload_volume').val(parameter[0].dataValues.auto_reload_volume);
    }
    $('#parameterModal').modal('show');
})

ipcRenderer.on('saveParameter', function (event, done) {
    if (done) {
        $('#parameterModal').modal('hide');
    }
})

function doSaveParameter () {
    var parameter = {
        card_digit: $('#card_digit').val(),
        max_beras_hari: $('#max_beras_hari').val(),
        periode_beras: $('#periode_beras').val(),
        max_beras_periode_l: $('#max_beras_periode_l').val(),
        max_beras_periode_x: $('#max_beras_periode_x').val(),
        auto_reload: $('#auto_reload').prop("checked"),
        auto_reload_day: $('#auto_reload_day').val(),
        auto_reload_volume: $('#auto_reload_volume').val()
    }
    ipcRenderer.send('saveParameter', parameter);
}

function showHistory () {
    var userId = $('#user_list_history_select').val();
    var hFrom = $('#history_from').val();
    var hTo = $('#history_to').val();
    ipcRenderer.send('showHistory', userId, hFrom, hTo);
}

ipcRenderer.on('showHistory', function (event, logsFound) {
    if (logsFound.length > 0) {
        var historyTbody = document.getElementById('history_list_tbody');
        $("#history_list_tbody > tr").remove();
        logsFound.forEach(logz => {
            var row = document.createElement('tr');
            var cellId = document.createElement('td');
            var cellDate = document.createElement('td');
            var cellAct = document.createElement('td');

            cellId.innerHTML = logz.dataValues.user_id;
            cellDate.innerHTML = logz.dataValues.createdAt;
            cellAct.innerHTML = logz.dataValues.activity;

            row.appendChild(cellId)
            row.appendChild(cellDate)
            row.appendChild(cellAct)

            historyTbody.appendChild(row);
        });
    } else {
        /* LOGS NOT FOUND */
        var historyTbody = document.getElementById('history_list_tbody');
        $("#history_list_tbody > tr").remove();
        var row = document.createElement('tr');
        var cellId = document.createElement('td');
        var cellDate = document.createElement('td');
        var cellAct = document.createElement('td');

        cellId.innerHTML = '-';
        cellDate.innerHTML = '-';
        cellAct.innerHTML = '-';

        row.appendChild(cellId)
        row.appendChild(cellDate)
        row.appendChild(cellAct)

        historyTbody.appendChild(row);
    }
})

function doNewTrx () {
    $('#trxModal').modal('show');
}

function doSaveTrx () {
    let trx_id = $('#trx_id').val();
    let trx_name = $('#trx_name').val();
    ipcRenderer.send('saveTrx', {
        trx_id: trx_id,
        trx_name: trx_name
    })
}

function doEditTrx (id) {
    ipcRenderer.send('editTrx', id);
}

function doFindTrx () {
    let findParameter = $('#find_input_trx').val();
    ipcRenderer.send('findTrx', findParameter);
}

ipcRenderer.on('editTrx', function (event, trx) {
    $('#trx_id').val(trx[0].dataValues.trx_id);
    $('#trx_name').val(trx[0].dataValues.trx_name);
    $('#trxModal').modal('show');
})

ipcRenderer.on('findTrx', function (event, trxList) {
    populateTrxList(trxList);
})

ipcRenderer.on('saveTrx', function (event, done) {
    if (done) {
        TrxClick();
    }
});

ipcRenderer.on('showTrx', function (event, trxList) {
    populateTrxList(trxList);
});

function doNewUser () {
    $('#user_pin').prop("disabled", false);
    $('#user_repin').prop("disabled", false);
    $('#user_id').val('');
    $('#nama').val('');
    $('#user_pin').val('');
    $('#user_repin').val('');
    $('#user_type').val('');
    $('#kartu_id').val('');
    $('#user_max_beras_h').val('');
    $('#user_max_beras_periode').val('');
    ipcRenderer.send('addingNewUser', true);
    $('#userModal').modal('show');
}

ipcRenderer.on('newUserCard', function(event, idKartu) {
    $('#kartu_id').val(idKartu);
})

function doSaveUser () {
    let idlogin_kartu = $('#user_id').val();
    let nama_kartu = $('#nama').val();
    let pin_kartu = $('#user_pin').val();
    let user_repin = $('#user_repin').val();
    let role_kartu = $('#user_type').val();
    let newUser = {
        id_kartu: '01010101',
        idlogin_kartu: idlogin_kartu,
        nama_kartu: nama_kartu,
        pin_kartu: pin_kartu,
        role_kartu: role_kartu
    }
    ipcRenderer.send('saveUser', newUser);
}

function doFindUser () {
    let findParameter = $('#find_input').val();
    ipcRenderer.send('findUser', findParameter);
}

function doEditUser (id) {
    ipcRenderer.send('editUser', id);
}


function doDeleteUser (id) {
    ipcRenderer.send('deleteUser', id);
}

ipcRenderer.on('findUser', function (event, userList) {
    populateUserList(userList)
});

ipcRenderer.on('deleteUser', function (event, deleted) {
    if (deleted) {
        userClick();
    }
})

ipcRenderer.on('editUser', function (event, userList) {
    $('#user_id').val(userList[0].dataValues.idlogin_kartu);
    $('#nama').val(userList[0].dataValues.nama_kartu);
    $('#user_pin').val(userList[0].dataValues.pin_kartu);
    $('#user_repin').val(userList[0].dataValues.pin_kartu);

    $('#user_pin').prop("disabled", true);
    $('#user_repin').prop("disabled", true);

    $('#user_type').val(userList[0].dataValues.role_kartu);
    $('#kartu_id').val(userList[0].dataValues.id_kartu);
    $('#user_max_beras_h').val(userList[0].dataValues.max_beras_hari);
    $('#user_max_beras_periode').val(userList[0].dataValues.max_beras_periode_l);
    $('#userModal').modal('show');
})

ipcRenderer.on('saveUser', function (event, done) {
    if (done) {
        $('#userModal').modal('hide');
        userClick();
    }
})

ipcRenderer.on('showUser', function (event, userList) {
    populateUserList(userList)
    $('#userListModal').modal('show');
})

function populateTrxList (trxList) {
    var trxListTable = document.getElementById('trx_list_table');
    $("#trx_list_table > tr").remove();
    for(var i=0; i<trxList.length; i++) {
        var row = document.createElement('tr');
        var cellId = document.createElement('td');
        var cellName = document.createElement('td');

        var cellEdit = document.createElement('td');
        var editButton = document.createElement('input');
        editButton.setAttribute('type', 'button')
        editButton.setAttribute('class', 'btn btn-info')
        editButton.setAttribute('name', 'edit')
        editButton.setAttribute('value', 'Edit')
        editButton.setAttribute('onclick', 'doEditTrx(' + trxList[i].dataValues.id + ')')

        var cellDelete = document.createElement('td');
        var deleteButton = document.createElement('input');
        deleteButton.setAttribute('type', 'button')
        deleteButton.setAttribute('class', 'btn btn-warning')
        deleteButton.setAttribute('name', 'delete')
        deleteButton.setAttribute('value', 'Delete')
        deleteButton.setAttribute('onclick', 'doDeleteTrx(' + trxList[i].dataValues.id + ')')

        cellId.innerHTML = trxList[i].dataValues.trx_id;
        cellName.innerHTML = trxList[i].dataValues.trx_name;
        cellEdit.appendChild(editButton);
        cellDelete.appendChild(deleteButton);

        row.appendChild(cellId)
        row.appendChild(cellName)
        row.appendChild(cellEdit)
        row.appendChild(cellDelete)

        trxListTable.appendChild(row);
    }
}

function populateUserList (userList) {
    var userListTable = document.getElementById('user_list_table');
    $("#user_list_table > tr").remove();
    for(var i=0; i<userList.length; i++) {
        var row = document.createElement('tr');
        var cellId = document.createElement('td');
        var cellName = document.createElement('td');
        var cellPin = document.createElement('td');
        var cellRole = document.createElement('td');

        var cellEdit = document.createElement('td');
        var editButton = document.createElement('input');
        editButton.setAttribute('type', 'button')
        editButton.setAttribute('class', 'btn btn-info')
        editButton.setAttribute('name', 'edit')
        editButton.setAttribute('value', 'Edit')
        editButton.setAttribute('onclick', 'doEditUser(' + userList[i].dataValues.id + ')')

        var cellDelete = document.createElement('td');
        var deleteButton = document.createElement('input');
        deleteButton.setAttribute('type', 'button')
        deleteButton.setAttribute('class', 'btn btn-warning')
        deleteButton.setAttribute('name', 'delete')
        deleteButton.setAttribute('value', 'Delete')
        deleteButton.setAttribute('onclick', 'doDeleteUser(' + userList[i].dataValues.id + ')')

        cellId.innerHTML = userList[i].dataValues.idlogin_kartu;
        cellName.innerHTML = userList[i].dataValues.nama_kartu;
        cellPin.innerHTML = userList[i].dataValues.pin_kartu;
        cellRole.innerHTML = userList[i].dataValues.role_kartu;
        cellEdit.appendChild(editButton);
        cellDelete.appendChild(deleteButton);

        row.appendChild(cellId)
        row.appendChild(cellName)
        row.appendChild(cellPin)
        row.appendChild(cellRole)
        row.appendChild(cellEdit)
        row.appendChild(cellDelete)

        userListTable.appendChild(row);
    }
}

function doneAddUser () {
    $('#admin_main_menu').show();
    $('#user_menu').hide();
    $('#trx_menu').hide();
}

function doSaveOpeningSaldo () {
    var userRowId = $('#user_list_select').val();
    var openingSaldo = $('#opening_saldo').val();
    ipcRenderer.send('saveOpeningSaldo', userRowId, openingSaldo);
}

ipcRenderer.on('saveOpeningSaldo', function (event, done) {
    if (done) {
        $('#openingModal').modal('hide');
    }
})

function doSavePin () {
    var userRowId = $('#user_list_pin_select').val();
    var oldPin = $('#old_pin').val();
    var newPin = $('#new_pin').val();
    var retypeNewPin = $('#retype_pin').val();

    if (newPin != retypeNewPin) {
        $('#error_pin_match').show();
    } else {
        ipcRenderer.send('savePin', userRowId, newPin, oldPin)
    }
}

ipcRenderer.on('savePin', function (event, done) {
    if (done) {
        $('#error_pin').hide();
        $('#pinModal').modal('hide');
    } else {
        $('#error_pin').show();
    }
})

getUserList();
