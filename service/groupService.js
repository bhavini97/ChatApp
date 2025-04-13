const Group = require('../models/groups');
const User = require('../models/user');
const UserGroup = require('../models/UserAndGroups');
const sequelize = require('../config/db');

module.exports={
      
  // this will create a new grp
    createGroup : async (groupName, adminId, members) => {
      
      console.log('inside createGroup fumction service')
        const transaction = await sequelize.transaction();
      
        try {
          // Create a new group
          const group = await Group.create({
            groupName: groupName
          }, { transaction });
      
        
          // Add creator to the group (they must always be added)
          await UserGroup.create({
            user_id: adminId,
            group_id: group.id,
            is_admin: true
          }, { transaction });
      
          // Add other members to the group
          for (let phone of members) {
            const user = await User.findOne({ where: { phone } });
            
            if(!user){
                throw new Error(`User with contact no : ${phone} doesn't exist `)
            }
      
            const [userGroup, created] = await UserGroup.findOrCreate({
              where: {
                user_id: user.id,
                group_id: group.id
              },
              defaults: {
                user_id: user.id,
                group_id: group.id
              },
              transaction
            });
            if (!created) {
              throw new Error(`User with contact no: ${phone} is already a member of the group.`);
            }
          }
      
          // Commit transaction
          await transaction.commit();
          return group;
        } catch (error) {
          await transaction.rollback(); // Rollback in case of any failure
          throw error;
        }
      },
      
      // Get all groups for a specific user
      getUserGroups : async (userId) => {
        return Group.findAll({
          include: {
            model: User,
            where: { id: userId },
            through: { attributes: [] }, // Ignore the join table columns
          }
        });
      },


    // this will fetch deatils of all the user in the particular grp
    getUserDetailsOfTheGroup : async(userId,groupId)=>{
         
      let admin = false;
      try{

        // this is to find if the current user is admin or not
        const adminRecord = await UserGroup.findOne({
          where:{
            user_id: userId,
            group_id: groupId
          }
        })
        if (!adminRecord) {
          throw new Error( 'User not part of the group');
        }
        if(adminRecord.is_admin) admin = true ;

        const members = await User.findAll({
          include:[
            {
            model: Group,
            where: { id: groupId },
            through: {
              attributes: [],
            },
          },
          ]
        })
        
        return {members,admin};

      }catch(err){
        throw err
      }

    },

    makeUserAdmin:async(userId,groupId)=>{
      
      try{
      
        const updated = await UserGroup.update(
          { is_admin: true },
          { where: { user_id: userId, group_id: groupId } }
        );
        if (!updated[0]) throw new Error ('User not in group' );

       return updated;
      }catch(err){
         throw err;
      }
    },

    deleteUserFromGroup : async(userId,groupId)=>{
         
      try{
        const result = await UserGroup.destroy({
          where: { user_id: userId, group_id: groupId }
        });
        if (!result) throw new Error( 'User not found in group' );
        return result;
      }catch(err){
        throw err;
      }
    },

    addNewMember : async(phone,groupId)=>{
    
      try{
        const newUser = await User.findOne({ where: { phone } });

    if (!newUser) throw new Error ( 'User not found' );

    const [userGroup, created] = await UserGroup.findOrCreate({
      where: { user_id: newUser.id, group_id: groupId }
    });

    if (!created) throw new Error ( 'User already in group' );

    return created;

      }catch(err){
        throw err;
      }
    }

    };