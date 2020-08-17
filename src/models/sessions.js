module.exports = (sequelize, type) => {
    return sequelize.define('yanas_sessions', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: type.INTEGER
    })
}