module.exports = (sequelize, type) => {
    return sequelize.define('yanas_user', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        id_kartu: type.STRING(100),
        idlogin_kartu: type.STRING(100),
        nama_kartu: type.STRING(100),
        pin_kartu: type.STRING(100),
        role_kartu: type.STRING(100),
        max_beras: type.INTEGER,
        daily_counter: type.INTEGER
    });
}