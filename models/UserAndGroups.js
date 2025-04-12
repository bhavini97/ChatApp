const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');


const UsersAndGroups = sequelize.define('users_and_groups', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER },
    group_id: { type: DataTypes.INTEGER },
    is_admin: { type: DataTypes.BOOLEAN, defaultValue: false }
  });

module.exports = UsersAndGroups;