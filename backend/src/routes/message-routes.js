import e from "express";

const router  = e.Router();

router.get('/send', (req,resp)=>{
     resp.send("Send Message Endpoint");
})

export default router;