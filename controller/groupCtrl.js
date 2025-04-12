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
          return res.status(500).json({ message: "Internal server error" });
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
}