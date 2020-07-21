module.exports = (sequelize, type) => {
    return sequelize.define('yanas_parameter', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        card_digit: type.INTEGER,
        max_beras_hari: type.INTEGER,
        periode_beras: type.INTEGER,
        max_beras_periode_l: type.INTEGER,
        max_beras_periode_x: type.INTEGER,
        auto_reload: type.BOOLEAN,
        auto_reload_day: type.INTEGER,
        auto_reload_volume: type.INTEGER
    })
}