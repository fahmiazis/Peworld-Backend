'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ImageProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      ImageProfile.belongsTo(models.Users, {
        foreignKey: 'userId'
      })
    }
  };
  ImageProfile.init({
    avatar: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ImageProfile'
  })
  return ImageProfile
}
