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
      // define association here
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
