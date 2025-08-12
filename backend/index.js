import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/connectdb.js";
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route.js";
import cors from "cors"
import userRouter from "./routes/user.route.js";
const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
const port = process.env.PORT || 8080;


app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.get("/", (req, res) => {
  res.send("Hello from backend");
})


app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
  connectDb();
})

