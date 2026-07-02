require('dotenv').config()
const express=require("express")
const cors=require("cors");
const { pool } = require('./db/db');
const multer=require("multer");
const path=require("path");
const { UploadOnCloudinary } = require("./utils/cloudinary");
const cookieParser = require("cookie-parser");
const { GenerateAccessToken } = require('./Auth/jwt');
const app=express()
const allowedOrigins = [
  "http://localhost:5173",  // Vite
  "https://rentra-mern-frontend.onrender.com" // production
];




app.use("/uploads", express.static("./uploads"));



app.use(cookieParser());


app.use(cors(
    {
         origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
        methods:["GET","POST","PATCH","DELETE"],
          credentials: true,    
    }
))



app.use(express.json());




app.get("/api",()=>{
  console.log("ok");
  
})



const storage=multer.diskStorage({
    filename:(req,file,cb)=>{
 const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);    },
    
    destination:(req,file,cb)=>{

        console.log("multer",file);
        
        cb(null,path.join(__dirname, "./uploads"))
    }
})

const upload=multer({storage})


app.post("/register",upload.single("profileImage"),async (req,res)=>{


  const {fullName,username,password,email}=req.body

const data={fullName,email};


const token=GenerateAccessToken(data)


  console.log(fullName,username,password,email,"received",token);


res.cookie("AccessToken",token)

let profileImg=null
    try {
      
 if (req.file) {
        console.log("Inside ");
        
        profileImg = await UploadOnCloudinary(req.file.path);
      }


console.log(profileImg,"after");





res.json("ok")

    } catch (error) {
      console.log(error);
      
    }
})



async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully!");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
}

checkConnection();




app.listen(process.env.PORT||8000,()=>{
  console.log(`server is listening on PORT:${process.env.PORT}`);
  
})