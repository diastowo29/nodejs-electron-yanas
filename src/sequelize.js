const Sequelize = require('sequelize')
const userModel = require('./models/user')
const trxModel = require('./models/trx')
const parameterModel = require('./models/parameter')
const sessionModel = require('./models/sessions')
const logModel = require('./models/logs')

var sequelize_db;

if (process.env.DATABASE_URL === undefined) {
	sequelize_db = new Sequelize('yanas_db', 'root', '', {
	  host: 'localhost',
	  dialect: 'mysql'
	});
} else {
	sequelize_db = new Sequelize(process.env.DATABASE_URL, {
	  dialectOptions: {
	    ssl: {
	      require: true,
	      rejectUnauthorized: false,
	    },
	    keepAlive: true,        
	  },      
	  ssl: true
	})
}


const user_table = userModel(sequelize_db, Sequelize)
const trx_table = trxModel(sequelize_db, Sequelize)
const parameter_table = parameterModel(sequelize_db, Sequelize)
const session_table = sessionModel(sequelize_db, Sequelize)
const log_table = logModel(sequelize_db, Sequelize)

sequelize_db.sync({ force: true } /* { alter: true } */)
  .then(() => {
    console.log(`Database & tables created!`);
    seedingTable();
})

function seedingTable () {
    user_table.create({
        id_kartu: '01010101',
        idlogin_kartu: 'admin',
        nama_kartu: 'admin',
        pin_kartu: '123456',
        role_kartu: 'Admin',
        max_beras: 100,
        max_beras_hari: 3,
        max_beras_periode_l: 100,
        max_beras_periode_x: 100,
        daily_counter: 0
    }).then(user_table_create => {
    	console.log('USER CREATED')
    })

    user_table.create({
        id_kartu: '23232323',
        idlogin_kartu: 'daffa29',
        nama_kartu: 'Daffa',
        pin_kartu: '292929',
        role_kartu: 'User',
        max_beras: 100,
        max_beras_hari: 3,
        max_beras_periode_l: 100,
        max_beras_periode_x: 100,
        daily_counter: 0
    }).then(user_table_create => {
    	console.log('USER CREATED')
    })

    parameter_table.create({
        card_digit: 5,
        periode_beras: 7,
        auto_reload: true,
        auto_reload_day: 5,
        auto_reload_volume: 8
    }).then(parameter_table_create => {
    	console.log('PARAMETER CREATED');
    })

    session_table.destroy({
      truncate: true
    })
}

module.exports = {
    user_table,
    trx_table,
    parameter_table,
    session_table,
    log_table
}