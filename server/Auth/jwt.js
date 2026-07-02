const jwt=require("jsonwebtoken")

 const GenerateAccessToken=(data)=>{
    const token=jwt.sign(data,process.env.AccessToken,{expiresIn:"24h"})

    return token
}


module.exports={GenerateAccessToken}