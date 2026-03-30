import express from 'express'
import { checkAuth, login, logout, signup, updateProfile, } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middlware.js';
import { arcjetProtection } from '../middleware/arcjet.middleware.js';

const router = express.Router();

router.get("/test", arcjetProtection, (req,res) => {
     res.status(200).json({message: "Test route"})
})

router.use(arcjetProtection);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", checkAuth);

export default router;