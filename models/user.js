const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');


const User = sequelize.define(
  'users',
  {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,  
        primaryKey: true,     
      },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  
  },
  {
    timestamps:false,
    // Other model options go here
    freezeTableName: true,
  },
);

module.exports =User;