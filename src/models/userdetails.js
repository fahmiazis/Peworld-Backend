'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserDetails.init({
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    jobTitle: DataTypes.STRING,
    workplace: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    domicile: DataTypes.STRING,
    github: DataTypes.STRING,
    instagram: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserDetails',
  });
  return UserDetails;
};