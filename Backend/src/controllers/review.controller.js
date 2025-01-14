import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import authorModel from "../models/author.model.js";
import mongoose from "mongoose";
import reviewModel from "../models/review.model.js"
import Book from "../models/book.model.js";

const addRating = asyncHandler(async(req,res) =>{
    
        try{
    const {bookId,rating,reviewText} = req.body;
        const userId = req.user?._id;

        // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
     
    //Check if the user have already rated the book or not
    const existingRating = await reviewModel.findOne({book:bookId , user:userId})
    if(existingRating){
        return res.status(400).json(new ApiResponse(existingRating,400,"You have already rated this book"));
    }
    //Otherwise create a new rating
    const newRating = await reviewModel.create({
        book:bookId,
        user:userId,
        rating,
        reviewText
    });

    //Updates book rating 
        
                    const ratings = Book.ratingsCount+1;
                    const totalRating = Book.totalRatings +ratings;
                    const averageRating = totalRating/ratings;
                await Book.save();

                res.status(201).json({ message: 'Rating added successfully', rating: newRating });
            } 
            catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
              }

              //Get all ratings for a specific book

                const getRatingsForBook = asyncHandler(async(req,res)=>{

                    try {
                        const {bookId} = req.params;
                        const ratings = await reviewModel.find({book:bookId}).populate('user',"name");
                        
                    } catch (error) {
                        
                    }
                })
})