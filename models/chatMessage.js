const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Group = require('./groups');


const Chats = sequelize.define("chats", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  messages: { type: DataTypes.STRING },
  username:{type: DataTypes.STRING},
  group_id: { type: DataTypes.INTEGER },
  isFile:{type:DataTypes.BOOLEAN}
 
},{
  timestamps:true
});


Group.hasMany(Chats);
Chats.belongsTo(Group, { foreignKey: 'group_id' });


module.exports = Chats;
