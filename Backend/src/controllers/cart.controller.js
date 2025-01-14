import express from "express";
import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import cartModel from  "../models/cart.model.js"

//add book
//edit book
//getbooks
//getbookbyid
//deletebook

const router = express.Router();

//Add to cart
const addToCart = asyncHandler(async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user?._id;

  //validate product
  const book = await Book.findById(bookId);
  console.log(`this is the book ${book}`);
  if (!book) {
    throw new ApiError(404, "Book not found");
  }
  //Find users cart
  let cart = await cartModel.findOne({ userId });

  if (!cart) {
    cart = new cartModel({ userId, items: [], totalPrice: 0 });
    console.log("Cart retrieved or created successfully");
  }

  //check if the product is already in the cart
  const itemIndex = cart.items.findIndex(
    (item) => item.bookId.toString() === bookId
  );

  if (itemIndex) {
    throw new ApiError(404, "Already in the cart.");
  }

  // .findIndex() goes through each item in the items array
  //  returns the index of the product in the array if it exists; otherwise, it returns -1.

  // if (!quantity || quantity <= 0) {
  //   throw new ApiError(400, "Quantity must be greater than 0");
  // }

  cart.items.push({ bookId });
  
  //Recalculating the total price
  let totalPrice = 0;

  // Iterate over each item in the cart
  for (const item of cart.items) {
    // Fetch the book details by its ID
    const book = await Book.findById(item.bookId);
    if (!book) {
      throw new ApiError(404, "Book not found");
    }

    // Add the price of the book * quantity to the total price
    totalPrice += item.quantity * book.price;
  }

  // Set the total price in the cart
  cart.totalPrice = totalPrice;

  // Save the cart to the database

  const savedCart = await cart.save();
  console.log("Item is added to the cart");
  return res
    .status(200)
    .json(new ApiResponse(200, savedCart, "Item added to cart successfully"));
});

//get Cartdetails

const getCartDetails = asyncHandler(async (req, res) => {
  const userId = req.user?._id; // Get the user ID from the request

  //Find cart of the user
  const cart = await cartModel
    .findOne({ userId })
    .populate("items.bookId", "bookName,coverImage,price");

  if (!cart) {
    throw new ApiError(404, "Cart not found");
    
  }

  // Respond with the cart details
  res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart retrieved successfully"));
});

//Update the cart items ( Remove items from cart)

const updateCart = asyncHandler(async (req, res) => {
  const { bookIdToRemove, quantity } = req.body;
  const userId = req.user?._id;
  // const cartId = req.params.id;
  //Finding users cart
  const cart = await cartModel.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  // Check if there are items in the cart
  if (cart.items.length === 0) {
    res.status(200).json(new ApiResponse(200, null, "Cart is empty"));
  }
  // Find the index of the item in the cart
  const itemIndex = cart.items.findIndex(
    (item) => item.bookId.toString() === bookIdToRemove
  );

  if (itemIndex > -1) {
    // If the quantity is greater than 0, update the quantity
    if (quantity > 0) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      // If the quantity is 0 or less, remove the item from the cart
      const removedItem = cart.items.splice(itemIndex, 1);
      console.log("This item is removed", removedItem);
    }
  } else {
    throw new ApiError(404, "Item not found in cart");
  }

  // Recalculate the total price of the cart
  let totalPrice = 0;

  // Iterate over each item in the cart
  for (const item of cart.items) {
    // Fetch the book details by its ID
    const book = await Book.findById(item.bookId);
    if (!book) {
      throw new ApiError(404, "Book not found");
    }

    // Add the price of the book * quantity to the total price
    totalPrice += item.quantity * book.price;
  }

  // Set the total price in the cart
  cart.totalPrice = totalPrice;

  //save the updated cart
  const updatedCart = await cart.save();

  // Return the updated cart
  res
    .status(200)
    .json(new ApiResponse(200, updatedCart, "Cart updated successfully"));
});

//  Delete all items from the cart
const deleteCart = asyncHandler(async (req, res) => {
  const cartId = req.params.id;
  const deleteCart = await cartModel.findByIdAndDelete(cartId);
  if (!deleteCart) {
    throw new ApiError(404, "Cart not found.");
  }
  res
    .status(200)
    .json(new ApiResponse(200, deleteCart, "Cart deleted successfully"));
});

export { addToCart, getCartDetails, updateCart, deleteCart };
