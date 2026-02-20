import e from "express";
import dotenv from 'dotenv';
import authRoutes from "./routes/auth-routes.js";
import messageRoutes from "./routes/message-routes.js";

dotenv.config();
const app = e();
const PORT = process.env.PORT || 3200 ;

app.use('/api/auth/',authRoutes);
app.use('/api/message', messageRoutes);


app.listen(PORT,()=> console.log("Server is running on port:" + PORT));
