import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import { app,server } from "./socket/socket.js";
import path from "path"

dotenv.config();

const PORT= process.env.PORT || 7000;

const __dirname=path.resolve()
console.log(__dirname)
connectDB()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const corsOptions={
    origin: [
        "https://instagram-liart-zeta.vercel.app",
        "http://localhost:5173"
      ],
      credentials: true,         
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"],
}
app.use(cors(corsOptions))

import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js"
import messageRoutes from "./routes/message.routes.js"
import limiter from "./middlewares/rateLimit.js";
app.use(limiter)

app.use("/api/v1/user",userRoutes)
app.use("/api/v1/post",postRoutes)
app.use("/api/v1/message",messageRoutes)


app.get("/",(req,res)=>{
    res.send({
        activeStatus:true,
        error:false
    })
})


server.listen(PORT,(err)=>{
    if(err) throw new err;
    console.log(`server is running on ${PORT}`);
})