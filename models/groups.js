const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');
const User = require('../models/user');
const UsersAndGroups = require('./UserAndGroups');

const Groups = sequelize.define('groups',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,  
        primaryKey: true,     
      },
    groupName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    admin:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

User.belongsToMany(Groups, {
    through: UsersAndGroups,
    foreignKey: 'user_id',
    otherKey: 'group_id'
  });
  
Groups.belongsToMany(User, {
    through: UsersAndGroups,
    foreignKey: 'group_id',
    otherKey: 'user_id'
  });
module.exports = Groups;