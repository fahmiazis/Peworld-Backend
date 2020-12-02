'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Portfolio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Portfolio.hasOne(models.ImagePortfolio, {
        as: 'picture',
        foreignKey: 'portFolioId'
      })
    }
  };
  Portfolio.init({
    name: DataTypes.STRING,
    linkApp: DataTypes.STRING,
    description: DataTypes.STRING,
    github: DataTypes.STRING,
    workplace: DataTypes.STRING,
    type: DataTypes.ENUM('web', 'mobile'),
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Portfolio'
  })
  return Portfolio
}
