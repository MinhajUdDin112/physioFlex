const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require("uuid");
const nodemailMailGun = require("nodemailer-mailgun-transport")
const randomstring = require('randomstring');
const jwtServices = require("../utils/jwtServices");
const authIdServices = require("../utils/authIdServices")

const securepassword = async(password)=>{
    try {
        const  passwordHashed = await bcrypt.hash(password,10)
        return passwordHashed
    } catch (error) {
        console.log(error)
    }
}

// email send
const sendResetPasswordMail = async(name,email,token)=>{
    const auth ={
        auth: {
            api_key: 'cff7b865d1cd38139458dbf1fe98f169-cc9b2d04-03fc84dc',
            domain: 'sandbox3f5c2cf0417c41f186751fdf4cd1cbd4.mailgun.org',
        },
    }
    try {
        const transporter = nodemailer.createTransport(nodemailMailGun(auth));
        const text = `<h1>Hi ${name}, Here is ur reset password otp: ${token}</h1>`
        
          const mailOption={
            from:'Excited User <mailgun@sandbox-123.mailgun.org>',
            to :email,
            subject:"for reset password",
            html: `<html><body> ${text}</body></html>`,
          }
          transporter.sendMail(mailOption,function(error,info){
            if(error){
                console.log(error);
            }else{
                console.log("mail has been sent:- ",info.message)
            }
          })
    } catch (error) {
        console.log(error)
    }
}


// Registering a new User
const registerUser = async (req,res)=>{
    {
        let {
            firstName,lastName,email,password,cpassword
        } = req.body;
        console.log("ss")
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(req.body.password,salt)
        req.body.password = hashedPass

        const hashedCPass = await bcrypt.hash(req.body.cpassword,salt)
        req.body.cpassword = hashedCPass

        if(hashedPass != hashedCPass){
        return res.status(400).json({message:"password and cpassword not mathched"})
        }
    
        const newUser = new userModel(req.body)
    try {
        // addition new
        const oldUser = await userModel.findOne({ email });
    
        if (oldUser)
          return res.status(400).json({ message: "User already exists" });
    
        // changed
        const result = await newUser.save();
        if (result) {
            console.log("khan")
            const uuid = uuidv4();
            const refreshToken = jwtServices.create({ uuid, type: "admin" });
            const accessToken = jwtServices.create(
              { userId: result._id, type: "admin" },
              "5m"
            );
            authIdServices.add(result._id, uuid);
            return res.status(201).send({
              msg: "User Registered Successfully",
              data: result,
              refreshToken,
              accessToken,
            });
          } else {
            return res.status(400).send({ msg: "User Not Registered!" });
          }
        //return res.status(200).send({ user, token });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
        
      }
}

// login User

 const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await userModel.findOne({ email: email });
        console.log(user)
        if (user) {
          const validity = await bcrypt.compare(password, user.password);
          if (!validity) {
            res.status(400).json("wrong password");
          } else {
            const uuid = uuidv4();
            console.log("uuid", uuid);
            const refreshToken = jwtServices.create({ uuid, type: "admin" });
            const accessToken = jwtServices.create(
                { userId: user._id, type: "admin" },
                "5m"
            );
            authIdServices.add(user._id, uuid);
            await userModel.findOneAndUpdate(
                { _id: user._id },
                { token: accessToken },
                { new: true }
            );
            (user.token = accessToken), (user.refreshToken = refreshToken);
            res.status(200).send({msg:"logged in", data:user})
          }
        } else {
          res.status(404).json("User not found");
        }
      } catch (err) {
        console.log(err)
        res.status(500).send(err);
      }
}

const refreshTok = (res,req)=>{
    try {
        if (req.cookies?.jwt) {
  
            // Destructuring refreshToken from cookie
            const refreshToken = req.cookies.jwt;
      
            // Verifying refresh token
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, 
            (err, decoded) => {
                if (err) {
      
                    // Wrong Refesh Token
                    return res.status(406).json({ message: 'Unauthorized' });
                }
                else {
                    // Correct token we send a new access token
                    const accessToken = jwt.sign({
                        
                    }, process.env.JWTKEY, {
                        expiresIn: '10m'
                    });
                    return res.json({ accessToken });
                }
            })
        } else {
            return res.status(406).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

// forget password

const forgetPassword = async(req, res) => {
    try {
        const email =req.body.email
        const userData = await userModel.findOne({email:email});

        if(userData){
            const randomOtp = Math.floor((Math.random()*10000+1))
            const data = await userModel.updateOne({email:email}, {$set:{token:randomOtp}})
            console.log(randomOtp)
            sendResetPasswordMail(userData.name,userData.email,randomOtp)
            res.status(200).json({success:true,message:'plz check ur email and reset password'})
        }else{
            res.status(200).json({success:true,message:'email not exist'})
        }

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const resetpassword = async(req,res)=>{
    try {
        const token = req.body.token;
        console.log(token)
        const tokenData = await userModel.findOne({token:token});

        if(tokenData){
            const password = req.body.password
            const newPassword = await securepassword(password)
            const userData = await userModel.findByIdAndUpdate({_id:tokenData._id},{$set:{password:newPassword,token:''},new:true})
            res.status(200).json({msg:'reset successfull',data:userData})
        }else{
            res.status(200).json({success:true,message:'wrong otp'})
        }

    } catch (error) {
        res.status(400).send({success:false,message:error.message})
        console.log(error);
    }
}

module.exports = {registerUser,loginUser,refreshTok, forgetPassword,resetpassword}