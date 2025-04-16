const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Group = require('./groups');


const ArchiveChats = sequelize.define("archivechats", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  messages: { type: DataTypes.STRING },
  username:{type: DataTypes.STRING},
  group_id: { type: DataTypes.INTEGER },
  isFile:{type:DataTypes.BOOLEAN}
 
},{
  timestamps:true
});


Group.hasMany(ArchiveChats);
ArchiveChats.belongsTo(Group, { foreignKey: 'group_id' });


module.exports = ArchiveChats;
