'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Message.belongsTo(models.Users, { foreignKey: 'sender', as: 'senderInfo' })
      Message.belongsTo(models.Users, { foreignKey: 'recipient', as: 'recipientInfo' })
    }
  };
  Message.init({
    sender: DataTypes.INTEGER,
    recipient: DataTypes.INTEGER,
    content: DataTypes.STRING,
    isLatest: DataTypes.BOOLEAN,
    isRead: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Message'
  })
  return Message
}
