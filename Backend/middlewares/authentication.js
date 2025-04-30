import jwt from "jsonwebtoken"

const authentication=async(req,res,next)=>{
try {
        let cookieToken =req.cookies.token
        if(!cookieToken) return res.status(401).json({success:false,message:"Please login first"})
        let decode = jwt.verify(cookieToken,process.env.JWT_SECRET_KEY)
    
      if(!decode) return res.status(401).json({success:flase,message:"Invalid"})
        req.id=decode.userId
    next()
} catch (error) {
    console.log(error)
}
}
export default authentication