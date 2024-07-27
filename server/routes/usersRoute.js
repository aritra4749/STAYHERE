const express = require("express");
const router= express.Router()
const User=require('../models/user')
router.post("/register",async(req,res)=>{
    const newuser=new User(req.body)
    try{
        const user=await newuser.save()
        res.send("User registered successfully")
    }catch(error)
    {
        return res.status(400).json({error})
    }
})
router.post("/login",async(req,res)=>{
    const {email,password}=req.body
    

    try{
        const user=await User.findOne({email:email,password:password})
        if(user){
            const temp={
                name:user.name,email:user.email,isAdmin:user.isAdmin,_id:user._id
            }
        res.send(temp)
        }
        else{
            return res.status(400).json({message:'Login failed'})
        }
    }catch(error)
    {
        return res.status(400).json({error})
    }
})

router.post("/getallusers", async (req, res) => { // Make sure to use the POST method if that's what you want
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        return res.status(400).json({ error });
    }
});
module.exports=router