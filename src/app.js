import express from 'express'
import cookieParser from 'cookie-parser'
import cors from "cors"

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());

app.use(express.static("public"))
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// routes import
import userRouter from './routes/user.routes.js'


// routes decl
app.use("/api/v1/users",userRouter)


export {app}
