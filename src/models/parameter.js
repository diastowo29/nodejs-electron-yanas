module.exports = (sequelize, type) => {
    return sequelize.define('yanas_parameter', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        periode_beras: type.INTEGER,
        auto_reload: type.BOOLEAN,
        auto_reload_day: type.INTEGER,
        auto_reload_volume: type.INTEGER
    })
}