import express from 'express'
import { signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup)

router.get("/login", (req,resp)=>{
     resp.send("Login Endpoint")
})
router.get("/logout", (req,resp)=>{
     resp.send("Logout Endpoint")
})

export default router;