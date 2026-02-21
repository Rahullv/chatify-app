
import User from "../models/User.js"
import bcrypt from 'bcryptjs';
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import 'dotenv/config';
import { ENV } from "../lib/env.js";

export const signup=async (req,resp)=>{
     const {fullName,email,password} = req.body;

     try {
          if(!fullName || !email || !password){
               return resp.status(400).json({message:"All fields are required"});
          }

          if(password.length < 6){
               resp.status(400).json({message:"Password must be atleast 6 characters"});
          }

          // check if emails valid: regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if(!emailRegex.test(email)){
               return resp.status(400).json({message:"Invalid email format"});
          }

          const user = await User.findOne({email});
          if(user) return resp.status(400).json({message:"Email already exists"});

          //123456 => $jfjfbuehf_3jn(password hashing)
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password,salt);

          const newUser = new User({
               fullName,
               email,
               password:hashedPassword
          });

          if(newUser){
               // generateToken(newUser._id,resp);
               // await newUser.save();

               // Persist user first ,then issue auht cookie
               const savedUser = await newUser.save();
               generateToken(savedUser._id, resp);

               resp.status(201).json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic,
               });

          // todo: send a welcome email to user 
          try {
               await sendWelcomeEmail(email,fullName,ENV.CLIENT_URL)
          } catch (error) {
               console.error("Failed to send welcone email:",error);
          }

          }else{
               resp.status(400).json({message:"Invalid user data"});
          }

     } catch (error) {
          console.log("Error in SignUp Conyroller", error);
          resp.status(500).json({message:"Internal server error"});
     }
} 