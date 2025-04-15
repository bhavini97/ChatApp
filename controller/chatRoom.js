const chat = require('../service/chatService');
const uploadToS3 = require('../config/S3');

module.exports ={
    addChatsToTable : async(req,res)=>{

        const message = req.body.message;
        const userId = req.user.userId;
        const name = req.user.name;
        const group_id = req.query.groupId;
        
        if(!message){
            return res.status(404).json({message:`didn't received msg from frontend`})
        }
        if(!userId){
            return res.status(404).json({message:`didn't received user id from req.header`})
        }
        try{
          const result = await chat.addChatsToTable(message,userId,group_id,name);
          const io = req.app.get("io"); //  Access socket.io instance
          io.to(`group-${group_id}`).emit("receiveMessage", {
       groupId: parseInt(result.group_id),
      username: name,
      messages: message,
      id: result.id
    });

          return res.status(200).json({ message: result });
        }catch(err){
            console.log(err)
           return res.status(500).json({message: err.message});
        }
    },

    getUserChat : async(req,res)=>{

        const afterId = parseInt(req.query.after);
        const groupid = req.query.groupId;
        const id = !isNaN(afterId) ? afterId : 0; // if the after id is undefined then it will send 0
        try{
           const result = await chat.getUserChat(id,groupid);

           return res.status(200).json({message:'chats received',chats: result})
        }catch(err){
           console.log(err);
           return res.status(500).json({message:err.message})
        }
    },

    uploadFile : async (req, res) => {
        try {
          const file = req.file;
          const groupId = req.body.groupId;
          const userId = req.user.userId;
          const name = req.user.name;
      
          if (!file) return res.status(400).json({ message: "No file received" });
      
          const fileUrl = await uploadToS3(file.buffer, file.originalname);
      
          // Save file as chat message (optional)
          const savedMessage = await chat.addChatsToTable(fileUrl,userId,groupId,name,true);
            
          // Emit to group
          const io = req.app.get("io");
          io.to(`group-${groupId}`).emit("receiveMessage", {
            groupId: parseInt(groupId),
            username: name,
            messages: fileUrl,
            isFile: true,
            id: savedMessage.id
          });
      
          return res.status(200).json({ fileUrl });
      
        } catch (err) {
          console.error("Upload failed", err);
          return res.status(500).json({ message: "Upload failed" });
        }
      }
}