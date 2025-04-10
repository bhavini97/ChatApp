const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');
const User = require('./user');


const Chats = sequelize.define(
  'chats',
  {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,  
        primaryKey: true,     
      },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    messages:{
        type:DataTypes.STRING,
        allowNull:false,
    }
    
  
  },
  {
    // Other model options go here
    freezeTableName: true,
  },
);

User.hasMany(Chats);
Chats.belongsTo(User);


module.exports =Chats;