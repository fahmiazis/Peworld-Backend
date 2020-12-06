'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Users.hasOne(models.UserDetails, {
        foreignKey: 'userId'
        // as: 'recruiter'
      })
      Users.hasOne(models.Company, {
        foreignKey: 'userId'
      })

      Users.hasOne(models.ImageProfile, {
        foreignKey: 'userId',
        as: 'companyAvatar'
      })

      Users.hasOne(models.ImageProfile, {
        as: 'profileAvatar',
        foreignKey: 'userId'
      })

      Users.hasMany(models.Portfolio, {
        as: 'portofolio',
        foreignKey: 'userId'
      })

      Users.hasMany(models.skillUser, {
        as: 'skills',
        foreignKey: 'userId'
      })

      Users.hasMany(models.Experience, {
        as: 'experience',
        foreignKey: 'userId'
      })
    }
  };
  Users.init({
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Email already used'
      }
    },
    password: DataTypes.STRING,
    roleId: DataTypes.INTEGER,
    resetCode: DataTypes.STRING,
    deviceToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users'
  })
  return Users
}
