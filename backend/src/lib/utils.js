import jwt from 'jsonwebtoken';
import { ENV } from './env.js';

export const generateToken = (userId, resp) => {

     const {JWT_SECRET} = ENV;
     if(!JWT_SECRET) throw new Error("JWT_SECRET is not configured");

     const token = jwt.sign({userId}, JWT_SECRET, {
          expiresIn:"7d",
     });


     resp.cookie('jwt', token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, //miliseconds
          httpOnly: true, // prevent XSS attacks: cross site scripting
          sameSite: 'lax',  // CSRF attacks
          secure: ENV.NODE_ENV === "development" ? false : true,
     });

     return token;
}