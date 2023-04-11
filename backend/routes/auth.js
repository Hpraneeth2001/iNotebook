const express=require('express');
const User=require('../models/User');
const router=express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken');
const fetchuser=require('../middleware/login');
//ROUTE 1:create a User using: POST "/api/auth/createuser" . No login required
const JWT_SECRET="Praneethisagoodb$oy";
router.post('/createuser',[
    body('name','Enter a Valid name').isLength({ min: 3 }),
    body('email','Enter a Valid email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({ min: 5 })
], async (req,res)=>{ 
    let success=false
    //If there are errors return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    //check whether the user with this email exists already
    try{
    let user=await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({success,error:"Sorry a user with this email already exists"});
    }
    const salt=await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt);
    //create a new user
   user= await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
      })
      
//       .then(user => res.json(user))
//       .catch(err=>{console.log(err)
//     res.json({
//         error:"Please enter a unique email",message: err.message
//     })})
const data={
    user:{
        id:user.id
    }
}
const authtoken=jwt.sign(data,JWT_SECRET);
success=true
res.json({success,authtoken});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
},)
//ROUTE 2: Authenticate a user using post "api/auth/login". No login required
router.post('/login',[
    body('email','Enter a Valid email').isEmail(),
    body('password','Password entered is incorrect').exists(),
], async (req,res)=>{ 
    let success=false
    //If there are errors return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    //check whether the user with this email exists or not
    const {email,password}=req.body;
    try{
    let user=await User.findOne({email});
    if(!user){
        return res.status(400).json({success,error:"Please try to login with correct credentials"});
    }
    const passwordCompare=await bcrypt.compare(password,user.password);
    if(!passwordCompare)
    {
        return res.status(400).json({success,error:"Please try to login with correct credentials"});
    }
const data={
    user:{
        id:user.id
    }
}
const authtoken=jwt.sign(data,JWT_SECRET);
success=true
res.json({success,authtoken});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
//ROUTE 3: Get logged in user details using Post "api/auth/getuser".Login required
router.post('/getuser',fetchuser, async (req,res)=>{
    try{
        userId=req.user.id;
        const user=await User.findById(userId).select("-password");
         res.send(user);
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})
module.exports=router