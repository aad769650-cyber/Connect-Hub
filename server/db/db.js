const mysql=require("mysql2/promise")
require('dotenv').config();


const fs=require("fs")

const pool=mysql.createPool({
    host:"localHost",
    database:"Pulse",
    password:"SunnySky42!",

    port:3306,
    user:"root",
  
})

module.exports={pool}