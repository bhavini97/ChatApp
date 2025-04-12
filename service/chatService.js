const Chat = require('../models/chatMessage');
const {Sequelize,Op} = require('sequelize');

module.exports={
    addChatsToTable : async(message,userId)=>{
        
        try{
            const result = await Chat.create({
                userId : userId,
                messages : message
            });
        return result;

        }catch(err){
            console.log(err)
           throw new Error('Something went wron while adding msgs to table');
        }
    },

    getUserChat : async(userId,afterId)=>{

        try{
    

      const userChats = await  Chat.findAll({
        where: {
          userId: userId, 
          id: { [Op.gt]: afterId }
        },
        order: [['id', 'ASC']]
      });
            return userChats;  
        }catch(err){
            throw new Error('couldn`t fetch user chats from table');
        }

    }
}