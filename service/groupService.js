const Group = require('../models/groups');
const User = require('../models/user');
const UserGroup = require('../models/UserAndGroups');
const sequelize = require('../config/db');

module.exports={
      
    createGroup : async (groupName, adminId, members) => {
        // Start a transaction (for atomicity)
        const transaction = await sequelize.transaction();
      
        try {
          // Create a new group
          const group = await Group.create({
            groupName: groupName,
            admin: adminId,
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
      
            if (user) {
              await UserGroup.create({
                user_id: user.id,
                group_id: group.id
              }, { transaction });
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
    };