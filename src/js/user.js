const remote = require('electron').remote;
var ipcRenderer = require('electron').ipcRenderer;

$('#user_beras_menu').hide();
function ambilBeras () {
    ipcRenderer.send('ambilBeras', true);
}

ipcRenderer.on('ambilBeras', function (event, data) {
	$('#user_main_menu').hide();
	$('#user_beras_menu').show();
})

function berasSelesai () {
	$('#user_main_menu').show();
	$('#user_beras_menu').hide();
}

function ubahPin () {
    $('#ubahPinModal').modal('show');
}

function cekSaldo () {
    ipcRenderer.send('getUserInfo', true);
    $('#cekSaldoModal').modal('show');
}

function userSelesai() {
    ipcRenderer.send('adminDone', false);
}

// ipcRenderer.on('getUserInfo', function)