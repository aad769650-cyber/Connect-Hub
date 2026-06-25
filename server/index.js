require('dotenv').config()
const express=require("express")
const cors=require("cors")
const app=express()
const allowedOrigins = [
  "http://localhost:5173",  // Vite
  "https://rentra-mern-frontend.onrender.com" // production
];

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



















app.listen(process.env.PORT||8000,()=>{
  console.log(`server is listening on PORT:8000`);
  
})