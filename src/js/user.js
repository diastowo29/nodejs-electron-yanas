const remote = require('electron').remote;
var ipcRenderer = require('electron').ipcRenderer;

var USER_MAX_BERAS = 0;

$('#user_beras_menu').hide();
function ambilBeras () {
    ipcRenderer.send('ambilBeras', true);
}

ipcRenderer.on('ambilBeras', function (event, data) {
    console.log(data)
    USER_MAX_BERAS = data.dataValues.max_beras;
    $('#saldo_info').text('Saldo anda: ' + USER_MAX_BERAS + ' Liter')
	$('#user_main_menu').hide();
	$('#user_beras_menu').show();
})

function tarikBeras (qty) {
    console.log(USER_MAX_BERAS)
    console.log(qty)

    if (USER_MAX_BERAS < qty) {
        alert('Saldo anda tidak cukup');
    } else {
        ipcRenderer.send('tarikBeras', qty);
    }
}

ipcRenderer.on('tarikBerasDone', function(event, berasDone) {
    if (berasDone) {
        berasSelesai();
    }
})

function berasSelesai () {
	$('#user_main_menu').show();
	$('#user_beras_menu').hide();
}

function ubahPin () {
    ipcRenderer.send('userChangePin', false);
    $('#old_pin').val('');
    $('#new_pin').val('');
    $('#retype_pin').val('');
}

ipcRenderer.on('userChangePin', function (event, userSession) {
    $('#id_pin').val(userSession.dataValues.idlogin_kartu);
    
    $('#ubahPinModal').modal('show');
    $('#error_pin').hide();
    $('#error_pin_match').hide();
})

function doSavePin () {
    $('#error_pin').hide();
    $('#error_pin_match').hide();
    var userRowId = $('#id_pin').val();
    var oldPin = $('#old_pin').val();
    var newPin = $('#new_pin').val();
    var retypeNewPin = $('#retype_pin').val();
    $("#osk-container").hide()

    if (newPin != retypeNewPin) {
        $('#error_pin_match').show();
    } else {
        ipcRenderer.send('savePin', userRowId, newPin, oldPin)
    }
}

ipcRenderer.on('savePin', function (event, done) {
    if (done) {
        $('#error_pin').hide();
        $('#ubahPinModal').modal('hide');
    } else {
        $('#error_pin').show();
    }
})

function cekSaldo () {
    ipcRenderer.send('userCekSaldo', true);
}

ipcRenderer.on('userCekSaldo', function (event, userSession) {
    $('#user_saldo').text('Saldo anda: ' + userSession.dataValues.max_beras + ' Liter')
    $('#cekSaldoModal').modal('show');
})

function userSelesai() {
    ipcRenderer.send('adminDone', false);
}