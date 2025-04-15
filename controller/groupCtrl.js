const groupService = require('../service/groupService');


module.exports={
    createGroup : async (req, res) => {
        try {
          const { groupName, members } = req.body;
          const userId = req.user.userId; // from jwt token
          
          if (!groupName || !members || members.length === 0) {
            return res.status(400).json({ message: "Group name and at least one member are required." });
          }
          
          // Create the group via service
          const group = await groupService.createGroup(groupName, userId, members);
          
          return res.status(201).json({ message: "Group created successfully!", group });
        } catch (error) {
          console.error("Error creating group:", error);
          return res.status(500).json({ message: error.message });
        }
      },
      
     
      // Fetch groups for the logged-in user
      getUserGroups : async (req, res) => {
        try {
          const userId = req.user.userId;
          const groups = await groupService.getUserGroups(userId);
          return res.json({ groups });
        } catch (error) {
          console.error("Error fetching user groups:", error);
          return res.status(500).json({ message: "Internal server error" });
        }
      },

      // get all user details of particular group
     getUserDetailsOfTheGroup : async(req,res)=>{
        const userId = req.user.userId;
        const groupId = req.params.id; 

        if(!groupId){
          return res.status(400).json({message :'Group id not received'});
        }

        try{
          const {members,admin} = await groupService.getUserDetailsOfTheGroup(userId,groupId);
          return res.status(200).json({members : members,isAdmin:admin});

        }catch(err){
          console.log(err);
          return res.status(400).json({message:`something went wrong while fetching members of grp`,reason:err.message})
        }

     },

     makeUserAdmin : async(req,res)=>{
       const groupId = req.params.groupId;
       const userId = req.params.userId;

       try{
        const result = await groupService.makeUserAdmin(userId,groupId);
        return res.status(200).json({message:'User has been made admin'})

       }catch(err){
         return res.status(400).json({message:err.message});
       }
     },

     deleteUserFromGroup : async(req,res)=>{
      const groupId = req.params.groupId;
      const userId = req.params.userId;

      try{
       const result = await groupService.deleteUserFromGroup(userId,groupId);
       return res.status(200).json({message:'User has been deleted'})

      }catch(err){
        return res.status(400).json({message:err.message});
      }
    
     },

     addNewMember : async(req,res)=>{
      const { name } = req.body;

      const groupId = req.params.groupId;

      try{

        const result = groupService.addNewMember(name,groupId);
        res.status(200).json({ message: 'Member added successfully' });

      }catch(err){
        console.error(err);
        res.status(500).json(err.message);
      }
     }
}