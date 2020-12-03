'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class skillUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      skillUser.belongsTo(models.Skills, {
        foreignKey: 'skillId',
        as: 'skill'
      })

      skillUser.belongsTo(models.UserDetails, {
        foreignKey: 'userId',
        // as: 'user'
      })
      skillUser.belongsTo(models.Users, {
        foreignKey: 'userId',
        // as: 'user'
      })
    }
  };
  skillUser.init({
    skillId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'skillUser',
  });
  return skillUser;
};