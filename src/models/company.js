'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Company.belongsTo(models.Users, {
        foreignKey: 'userId'
      })
      Company.hasOne(models.ImageProfile, {
        foreignKey: 'userId',
        as: 'companyAvatar'
      })
    }
  };
  Company.init({
    name: {
      type: DataTypes.STRING
    },
    jobDesk: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Phone number already used'
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Email already used'
      }
    },
    description: DataTypes.STRING,
    instagram: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Already exist'
      }
    },
    linkedin: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Already exist'
      }
    },
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Company'
  })
  return Company
}
