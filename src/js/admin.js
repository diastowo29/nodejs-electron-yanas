const remote = require('electron').remote
var ipcRenderer = require('electron').ipcRenderer;

$('#admin_main_menu').hide()
$('#user_menu').show()

console.log('hola')


function userClick () {
    $('#admin_main_menu').hide()
    $('#user_menu').show()
    ipcRenderer.send('showUser', true);
}

function parameterClick () {
	
}

function TrxClick () {
	
}

function saldoClick () {
	
}

function changePinClick () {
	
}

function historyClick () {
	
}

function doneCLick () {
    ipcRenderer.send('adminDone', false);
}

function doNewUser () {
    console.log('newUser')
    $('#myModal').modal('show');
}

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
})

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
    $('#user_type').val(userList[0].dataValues.role_kartu);
    $('#myModal').modal('show');
})

ipcRenderer.on('saveUser', function (event, done) {
    if (done) {
        $('#myModal').modal('hide');
        userClick();
    }
})

ipcRenderer.on('showUser', function (event, userList) {
    populateUserList(userList)
})

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
    $('#admin_main_menu').show()
    $('#user_menu').hide()
}
