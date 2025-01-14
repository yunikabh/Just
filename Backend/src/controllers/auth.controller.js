import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
// const bcrypt= require('bcrypt');?
import bcrypt from "bcrypt";
//routes are called controller
const router = express.Router();

//Register User

const register = asyncHandler(async (req, res) => {
  //   console.log("eta", req.body);
  //extract new user data from req.body
  const { name, email, password, phoneNumber } = req.body;

  //check uniqueness of email
  const user = await User.findOne({ email });
  if (user) {
    throw new ApiError(409, "Email already exists");
  }

  //hash password before inserting into database
  const plainPassword = password;
  const saltRound = 10; // 1 to 32
  const hashedPassword = await bcrypt.hash(plainPassword, saltRound);
  try {
    const savedUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      phoneNumber: phoneNumber,
  });

  savedUser.password = undefined;
    return res.json(new ApiResponse(200, savedUser, "Registered successfully "))
  } catch (error) {
    console.log(error.message);
    throw new ApiError(409, "Unsuccessful Registration");
};
});

//Login User

const login = asyncHandler(async (req, res) => {
  try {
    const {email, password } = req.body;

    console.log(req.body);
    if (
      [email, password].some((field) => {
        field.trim() === "";
      })
    ) {
      throw new ApiError(404, "All fields are required");
    }

    const user = await User.findOne({ email });
      console.log("logged in user: ",user);
    if (!user) {
      throw new ApiError(409, "Invalid credentials");
    }
    //check password
    const plainPassword = password;
    const hashedPassword = user.password;

    console.log(plainPassword, hashedPassword);

    const matchPassword = await bcrypt.compare(plainPassword, hashedPassword);
    if (!matchPassword) {
      // return res.status(409).send({ message: "Invalid credentials" });
      throw new ApiError(409, "Invalid credentials");
    }

    const accessToken = jwt.sign(
      {
        data: {
          id: user._id,
          email: user.email,

          //need to have role also 
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const options = {
      httpOnly: true,//Makes the cookie inaccessible to client-side JavaScript
      secure: true,// Ensures the cookie is only sent over secure HTTPS connections
    };
    //Authentication successful
    res
      .status(200) //for browser
      .cookie("accessToken", accessToken, options)// Adds a cookie named "accessToken" containing the JWT, using the options defined earlier.
      .json(new ApiResponse(200, user, "Login successful"));
  } catch (error) {
    console.log("Error during login:", error.message);
    throw new ApiError(500, "Error during login");
  }
});


//Logout route 
 const logout = asyncHandler(async(req,res)=>{
  const token = req.cookies.accessToken;//get token from the cookie

  if(!token){
    throw new ApiError(404,"No token provided.Already logged out")
  }
  try{
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
    console.log("dt: ",decodedToken);
    const userId = await User.findById(decodedToken.data.id).select("-password -refreshToken")
    console.log(`User with ID ${userId} has logged out`);

    res.clearCookie('accessToken');
    res.status(200).json(new ApiResponse(200,userId,"User logged out successfully."))
  }
  catch(error){
    console.error('Error verifying token:', error);
    throw new ApiError(400,"Invalid Token.")
  }
 });
export { register, login,logout };
