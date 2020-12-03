'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Experience extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Experience.init({
    jobDesk: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    company: DataTypes.STRING,
    description: DataTypes.STRING,
    year: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Experience',
  });
  return Experience;
};