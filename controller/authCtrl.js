const authService = require('../service/authService');

module.exports={
    addUser: async(req,res)=>{
        const {name,email,phone,password} = req.body;

        if(!name || !email || !phone || !password){
<<<<<<< HEAD
            return res.status(400).json({message:'All fields are required for signUp'});
=======
            return res.status(400).json({message:'All fields are required'});
>>>>>>> ce50632971f3148601644953e4e797b6ad7e9ef0
        }
        try{
            const result = await authService.addSignUpUser(name,email,phone,password);
            return res.status(200).json({message:'User added successfully',result})

        }catch(err){
            console.log('error occured while adding user',err)
            return res.status(400).json({message:err.message})
        }
<<<<<<< HEAD
    },

    loginUser: async(req,res)=>{
       const {email,password} = req.body;

       if(!email || !password){
        return res.status(400).json({message:'Email and password required for login'});
       }

       try{
        const token = await authService.loginUser(email,password);
        return res.status(200).json({message:'Login successful',token})

       }catch(err){
        console.log('error occured while logging',err)
        if(err.message =='User not found')
          return res.status(404).json({message:err.message})
        else
        return res.status(401).json({message:err.message})
       }
=======
>>>>>>> ce50632971f3148601644953e4e797b6ad7e9ef0
    }
}