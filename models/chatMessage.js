const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Group = require('./groups');
const User = require("./user");

const Chats = sequelize.define("chats", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  messages: { type: DataTypes.STRING },
  username:{type: DataTypes.STRING},
  sender_id: { type: DataTypes.INTEGER },
  group_id: { type: DataTypes.INTEGER },
  isFile:{type:DataTypes.BOOLEAN}
 
},{
  timestamps:false
});

User.hasMany(Chats);
Group.hasMany(Chats);
Chats.belongsTo(Group, { foreignKey: 'group_id' });
Chats.belongsTo(User, { foreignKey: 'sender_id' });

module.exports = Chats;
