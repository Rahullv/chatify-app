import express from 'express'
import { login, logout, signup, updateProfile, } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middlware.js';

const router = express.Router();

router.post("/signup", signup)

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, (req,resp) => resp.status(200).json(req.user));

export default router;