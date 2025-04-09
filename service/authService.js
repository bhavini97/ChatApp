const User = require("../models/user");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = {
  // add user to user table (if not exist)
  addSignUpUser: async (name, email, phone, password) => {
    const t = await db.transaction();

    try {
      // Encrypt password
      const hashedPassword = await bcrypt.hash(password, 10);

      // this will ensure that email and phone are unqiue for each user
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { phone }],
        },
      });

      if (existingUser) {
        throw new Error("User already exists with this email or phone");
      }

      const res = await User.create(
        {
          username: name,
          email: email,
          phone: phone,
          password: hashedPassword,
        },
        { transaction: t }
      );
      
      await t.commit();
      return res;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  loginUser: async(email,password)=>{
    
   if(!email || !password){
      throw new Error('email and password required for login in')
   }
   try{

      // finding user in database
      const user = await User.findOne({ where: { email } });
   
     if (!user) {
       throw new Error("User not found");
     }

     //MATCHING password with stored encrypted password
     const match = await bcrypt.compare(password,user.password);
   
     if(!match){
      throw new Error('Invalid Password');
     }
     
     // generate jwt token for client
     const token = jwt.sign({userId : user.id},process.env.JWT_TOKEN)
     return token;

   }catch(err){
      throw err;
   }
}
};
