import express from 'express'

const router = express.Router();

router.get("/signup", (req,resp)=>{
     resp.send("SignUp Endpoint")
})

router.get("/login", (req,resp)=>{
     resp.send("Login Endpoint")
})
router.get("/logout", (req,resp)=>{
     resp.send("Logout Endpoint")
})

export default router;