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
    }
}