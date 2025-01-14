import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"

export const verifyUser=async(req, _, next)=>{
    try {
        const accessToken= req.cookies.accessToken||req.header("Authorization")?.replace("Bearer ","")
        console.log("oh vaisabb");

        if(!accessToken){
            throw new ApiError(401,"Unauthorized request")
        }

    const decodedToken= jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)//yo secret kabata aayo
    console.log("dt: ",decodedToken);
    if(!decodedToken){
        throw new ApiError(204,"there was error in jwt verify")
    }

    const user= await userModel.findById(decodedToken.data.id).select("-password -refreshToken") //whats refresh token here

    if(!user){
        throw new ApiError(204,"Invalid access token")
    }

        req.user= user; //Attaches the authenticated user object to the request for downstream access
        next()

    } catch (error) {
        console.error("Error in verifyUser middleware:", error.message);
        next(error); 
    }
}

export const authorize=(...role)=>{
    return (req, _, next)=>{
        if(!role.includes(req.user.role)){
            throw new ApiError(403, "You are not allowed to access this resource")
        }
        next()
    }
}