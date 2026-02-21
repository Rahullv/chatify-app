import jwt from 'jsonwebtoken';

export const generateToken = (userId, resp) => {
     const token = jwt.sign({userId}, process.env.JWT_SECRET, {
          expiresIn:"7d",
     });


     resp.cookie('jwt', token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, //miliseconds
          httpOnly: true, // prevent XSS attacks: cross site scripting
          sameSite: 'strict',  // CSRF attacks
          secure: process.env.NODE_ENV === "development" ? false : true,
     });

     return token;
}