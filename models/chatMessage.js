const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Group = require('./groups');
const User = require("./user");

const Chats = sequelize.define("chats", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  message: { type: DataTypes.STRING },
  sender_id: { type: DataTypes.INTEGER },
  group_id: { type: DataTypes.INTEGER },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});


Chats.belongsTo(Group, { foreignKey: 'group_id' });
Chats.belongsTo(User, { foreignKey: 'sender_id' });

module.exports = Chats;
