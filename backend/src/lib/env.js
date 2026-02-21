import 'dotenv/config';

export const ENV = {
     PORT:process.env.PORT,
     MONGO_URI:process.env.MONGO_URI,
     JWT_SECRET:process.env.JWT_SECRET,
     CLIENT_URL:process.env.CLIENT_URL,
     RESEND_API_KEY:process.env.RESEND_API_KEY,
     EMAIL_FROM:process.env.EMAIL_FROM,
     EMAIL_FROM_NAME:process.env.EMAIL_FROM_NAME,
}


// PORT=3000
// MONGO_URI=mongodb://localhost:27017/

// NODE_ENV=development
// JWT_SECRET=mmykeyh

// RESEND_API_KEY=re_L8DbRZdr_Q7TpCzduGRPHC6V9Xg6DNRTC

// EMAIL_FROM=onboarding@resend.dev
// EMAIL_FROM_NAME=Chatify

// CLIENT_URL=http://localhost:5173
