require("dotenv").config();
require(".config/database ").connect(); 
const express=require('express');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken'); 
const auth=require('.middleware/auth')

const User=require('./model/user')

const cookieparser=require('cookie-parser')

const app=express();
app.use(express.json());
app.use(cookieparser());


app.get('/',(req,res)=>{
    res.send("<h1>hello </h1>")
})


app.post('/register',async (req,res)=>{//we only want new users and to check whether whether he/she is there by checking the email
   try {
    const {firstname,lastname,email,password}=req.body;
    if(!(email && firstname && lastname && password)){//checks whethere any field is empty or not  
        res.status(400).send('All fields required')
    }

    const existinguser=await User.findOne({email});//returns a promise 
    if(existinguser){
       res.status(401).send("user already exists ");
    }

    const myencpassword=await bcrypt.hash(password,10)
    const user=await user.create({//async call as it is a databse operation
        firstname,
        lastname,
        email:email.tolowercase(),
        password:myencpassword

    })
const token=jwt.sign({user_id:user._id,email},
process.env.SECRET_KEY,
{
    expiresin:"2h"
}

)

user.token=token 

res.status(201).json(user);

    
   } catch (error) {
    console.log(error);
   }
})


app.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;

        if(!(email && password)){
            res.status(400).send("field is empty");

        }


        const user=await User.findOne({email})
;

if(!user){
    res.status(400).json("you are not registered ");}

    if(user && (await bcrypt.compare(password.user.password))){
        const token=jwt.sign({user_id:user._id,email},
            process.env.SECRET_KEY,
            {
                expiresin:"2h"
            }
            
            )
            user.token=token
            user.password=undefined
            //res.status(200).json(user)
             //by using cookies

             const options={
                expires:new Date(
                    Date.now()+3*24*60*60*1000
                ),
                httpOnly:true,
             }
             res.status(200).cookie('token',token,options).json(
                {
                    success:true,
                    token,
                    user
                }
             )
    }
    res.status(400).send("emai or password is incorrect ")

    }catch(error){
        console.log(error);
    }
})


app.get('/dashboard',auth,(req,res)=>{
    res.send("welcome to dashboard")
})
module.exports=app