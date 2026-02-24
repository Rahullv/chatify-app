
import e from "express";
import path from "path";
import authRoutes from "./routes/auth-routes.js";
import messageRoutes from "./routes/message-routes.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = e();
const _dirname = path.resolve();
const PORT = ENV.PORT || 5000 ;

app.use(e.json()) // req.body
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true}));
app.use(cookieParser());

app.use('/api/auth/',authRoutes);
app.use('/api/message', messageRoutes);

// make deployment ready 
if(ENV.NODE_ENV === 'production'){
     app.use(e.static(path.join(_dirname, "../frontend/dist")));

     app.get("*", (req,resp)=>{
          resp.sendFile(path.join(_dirname, "../frontend/dist/index.html"));
     })
}

app.listen(PORT,()=> {
     console.log("Server is running on port:" + PORT);
     connectDB();
});






