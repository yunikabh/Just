import express from "express";
import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import Purchase from "../models/order.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

//Create a new order
const createOrder = asyncHandler(async (req, res) => {
    
  const { quantity, totalPrice, paymentMethod, shippingAddress } = req.body;

  const userID = req.user._id;

  const { bookID: id } = req.params;

  //Validate user
  if (!userId) {
    throw new ApiError(401, "User ID is required to place an order.");
  }

  //create and save the order
  const order = new Order({
    userId,
    bookId,
    quantity,
    totalPrice,
    paymentMethod,
    shippingAddress,
  });
  const savedOrder = await order.save();
  res
    .status(201)
    .json(new ApiResponse(201, savedOrder, "Order created successfully"));
});

//Fetch all orders
