const chat = require('../service/chatService');

module.exports ={
    addChatsToTable : async(req,res)=>{

        const message = req.body.message;
        const userId = req.user.userId;
        
        if(!message){
            return res.status(404).json({message:`didn't received msg from frontend`})
        }
        if(!userId){
            return res.status(404).json({message:`didn't received user id from req.header`})
        }
        try{
          const result = await chat.addChatsToTable(message,userId);
          return res.status(200).json({message: `Successfully added chat message`})
        }catch(err){
            console.log(err)
           return res.status(500).json({message: err.message});
        }
    },

    getUserChat : async(req,res)=>{

        const userId = req.user.userId;
        if(!userId){
            return res.status(400).json({message:'UserId not found for fetching user chat'})
        }
        const afterId = parseInt(req.query.after);
        const id = !isNaN(afterId) ? afterId : 0; // if the after id is undefined then it will send 0
        try{
           const result = await chat.getUserChat(userId,id);

           return res.status(200).json({message:'chats received',chats: result})
        }catch(err){
           console.log(err);
           return res.status(500).json({message:err.message})
        }
    }
}