import jwt from "jsonwebtoken"

const generateToken=async(id)=>{
    const token =jwt.sign({userId:id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
    return token
}

export default generateToken;
