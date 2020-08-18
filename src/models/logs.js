module.exports = (sequelize, type) => {
    return sequelize.define('yanas_log', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: type.STRING(50),
        activity: type.STRING(50)
    })
}