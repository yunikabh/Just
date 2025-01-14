import express from "express";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
const router =express.Router();

//getallUser
  const getUser = asyncHandler(async(req,res) =>{
      try {
        const users = await User.find();
        if(!users){
          throw new ApiError(404,"Users not found");
        }
        res.status(200).json(new ApiResponse(200,users,"User fetched successfully"));
        
      } catch (error) {
        throw new ApiError(404,users,"User not found",error.message);
      }

  })

//get user
const getUserById = asyncHandler(async (req, res) => {
 
   try {
     const userId  = req.params.id;
     const user = await User.findById(userId);
     if (!user) {
       throw new ApiError(404, "User not found");
     }
     
       res
         .status(200)
         .json(new ApiResponse(200, user, "User fetched successfully"));
     
   } catch (error) {
     console.log("Error during fetching user: ", error.message);
     throw new ApiError(500, error.message || "Error fetching user");
   }
 });
 
const updateUser = asyncHandler(async(req,res) =>{
   try {
    // Extract user ID from the token
    const userId = req.params.id;

     // Extract data from the request body
     const{name,phoneNumber,bio,address}= req.body; //phonenumber how change 
     const updatedUser = await User.findByIdAndUpdate(userId,{name,phoneNumber,bio,address},
      { new: true, runValidators: true } // Return updated user, validate input
     )
     if(!updatedUser){
      throw new ApiError(404,"User not found");
     }
     res.status(200).json(new ApiResponse(200,"Profile Updated Successfully",updatedUser))
   } catch (error) {
            throw new ApiError(500,"Error in updating profile",error.message);
   }
})

//delete user
const deleteUser = asyncHandler(async(req, res) => {
   try {
     const userId = req.params.id;
 
     const deletedUser = await User.findByIdAndDelete(userId);
     if (!deletedUser) {
       throw new ApiError(404, "User not found");
     }
     {
       res
         .status(200)
         .json(new ApiResponse(200, deletedUser, "User deleted successfully"));
       console.log("Deleted Successfully");
     }
   } catch (error) {
     console.error("Error deleting product:", error.message);
     throw new ApiError(500, error.message || "Error deleting product");
   }
 });
 
 export { getUser,getUserById, updateUser, deleteUser };