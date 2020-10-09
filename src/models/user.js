module.exports = (sequelize, type) => {
    return sequelize.define('yanas_user', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        id_kartu: type.STRING(100),
        nomor_ktp: type.STRING(100),
        idlogin_kartu: type.STRING(100),
        nama_kartu: type.STRING(100),
        pin_kartu: type.STRING(100),
        role_kartu: type.STRING(100),
        max_beras: {
          type: type.INTEGER,
          defaultValue: 0
        },
        daily_counter: {
          type: type.INTEGER,
          defaultValue: 0
        },
        period_counter: {
          type: type.INTEGER,
          defaultValue: 0
        },
        max_beras_hari: {
          type: type.INTEGER,
          defaultValue: 0
        },
        max_beras_periode_l: {
          type: type.INTEGER,
          defaultValue: 0
        },
        max_beras_periode_x: {
          type: type.INTEGER,
          defaultValue: 0
        },
    });
}