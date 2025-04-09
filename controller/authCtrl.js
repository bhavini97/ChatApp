const authService = require('../service/authService');

module.exports={
    addUser: async(req,res)=>{
        const {name,email,phone,password} = req.body;

        if(!name || !email || !phone || !password){
            return res.status(400).json({message:'All fields are required'});
        }
        try{
            const result = await authService.addSignUpUser(name,email,phone,password);
            return res.status(200).json({message:'User added successfully',result})

        }catch(err){
            console.log('error occured while adding user',err)
            return res.status(400).json({message:err.message})
        }
    }
}