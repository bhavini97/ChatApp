const Chat = require('../models/chatMessage');
const {Sequelize,Op} = require('sequelize');

module.exports={
    addChatsToTable : async(message,userId,group_id,username)=>{
          console.log(group_id)
        try{
            const result = await Chat.create({
                messages : message,
                username:username,
                sender_id : userId,
                group_id : group_id
            });
        return result;

        }catch(err){
            console.log(err)
           throw new Error('Something went wron while adding msgs to table');
        }
    },

    getUserChat : async(afterId,group_id)=>{

        try{
    

      const userChats = await  Chat.findAll({
        where: { 
          group_id:group_id,
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