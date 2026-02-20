import e from "express";
import dotenv from 'dotenv';
import path from "path";
import authRoutes from "./routes/auth-routes.js";
import messageRoutes from "./routes/message-routes.js";

dotenv.config();
const app = e();
const _dirname = path.resolve();
const PORT = process.env.PORT || 3200 ;

app.use('/api/auth/',authRoutes);
app.use('/api/message', messageRoutes);

// make deployment ready 
if(process.env.NODE_ENV === 'production'){
     app.use(e.static(path.join(_dirname, "../frontend/dist")));

     app.get("*", (req,resp)=>{
          resp.send(path.join(_dirname, "../frontend/dist/index.html"));
     })
}

app.listen(PORT,()=> console.log("Server is running on port:" + PORT));
