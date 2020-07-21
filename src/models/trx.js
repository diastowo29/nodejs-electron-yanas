module.exports = (sequelize, type) => {
    return sequelize.define('yanas_trx', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        trx_id: type.STRING(100),
        trx_name: type.STRING(100)
    })
}