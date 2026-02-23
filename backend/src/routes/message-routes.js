import e from "express";
import { getAllContacts, getMessagesByUserId, sendMessage, getChatPartner } from "../controllers/message.controller.js";
import  {protectRoute} from "../middleware/auth.middlware.js";
import { arcjetProtection } from '../middleware/arcjet.middleware.js';


const router  = e.Router();

router.use(arcjetProtection, protectRoute);

router.get('/contacts', getAllContacts);
router.get('/chats' , getChatPartner);
router.get('/:id', getMessagesByUserId);
router.post('/send/:id', sendMessage);

export default router;