import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import e from "express";
import dotenv from 'dotenv';
import path from "path";
import authRoutes from "./routes/auth-routes.js";
import messageRoutes from "./routes/message-routes.js";
import { connectDB } from "./lib/db.js";


dotenv.config();
const app = e();
const _dirname = path.resolve();
const PORT = process.env.PORT || 5000 ;

app.use(e.json()) // req.body

app.use('/api/auth/',authRoutes);
app.use('/api/message', messageRoutes);

// make deployment ready 
if(process.env.NODE_ENV === 'production'){
     app.use(e.static(path.join(_dirname, "../frontend/dist")));

     app.get("*", (req,resp)=>{
          resp.sendFile(path.join(_dirname, "../frontend/dist/index.html"));
     })
}


app.listen(PORT,()=> {
     console.log("Server is running on port:" + PORT);
     connectDB();
});






