const User = require('../models/user')
const bcrypt = require('bcrypt');
const db = require('../config/db')

module.exports={
   // add user to user table (if not exist)
    addSignUpUser: async(name,email,phone,password)=>{
       const t = await db.transaction();

      try{
         // Encrypt password
        const hashedPassword = await bcrypt.hash(password,10);

        const [res,created] = await User.findOrCreate({
           where:{email}, //this will ensure that only user with unquie email can be created
           defaults:{username : name,email,phone,password: hashedPassword},
           transaction :t
        })
        if(!created){
         throw new Error('user already exists')
        }
        await t.commit();
        return res
      }catch(err){
         await t.rollback();
         throw err;
      }
   },

}

