import express from "express";
// import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import authorModel from "../models/author.model.js";
import categoryModel from "../models/category.model.js";
import mongoose from "mongoose";

//add book
//edit book
//getbooks
//getbookbyid
//deletebook

const router = express.Router();

//add book
const addBook = asyncHandler(async (req, res) => {
  const bookDetails = req.body;
  const authorName = bookDetails.author.name;
  let categoryIds = bookDetails.category;

  console.log(authorName);
  console.log(bookDetails);
  // console.log(categoryIds);
  //check if the book is added already or not
  try {
    const existingBook = await Book.findOne({ ISBN: bookDetails.ISBN })
      .populate("category")
      .populate("author");

      console.log("this is ",existingBook);
    let author = await authorModel.findOne({ authorName });
    console.log("this is ", author);

    if (!author) {
      return res
        .status(404)
        .json(
          new ApiError(
            404,
            "Author not found",
            "The author does not exist in the database."
          )
        );
    }
    if (existingBook) {
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            existingBook,
            "Book already exists with this ISBN "
          )
        );
    }
    // Find categories by ID (assuming categoryIds are sent)

    if (categoryIds && Array.isArray(categoryIds)) {
      console.log("Category IDs:", categoryIds); // Debugging line
      bookDetails.category= categoryIds.map((categoryId) =>
         new mongoose.Types.ObjectId(categoryId)
      );
    } else {
        categoryIds = []; // If no categories selected, set it as an empty array
    }
    bookDetails.category = categoryIds;
    console.log("Creating book with details:", bookDetails);

    bookDetails.author = author._id;
    console.log(req.file);
    const coverImage = req.file.path;

    const savedBook = await Book.create(bookDetails);
    res
      .status(201)
      .json(new ApiResponse(201, savedBook, "Book added successfully"));
  } catch (error) {
    throw new ApiError(404, "Book not added", error.message);
  }
});

//getBooks all
const getBooks = asyncHandler(async (req, res) => {
  try {
    const books = await Book.find();
    if (books.length === 0) {
      throw new ApiError(404, "Book not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, books, "Book successfully retrived"));
  } catch (error) {
    throw new ApiError(404, "Problem in fetching book", error.message);
  }
});

//getBooksById

const getBookById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id);

    console.log("ma hu book");
    if (!book) {
      throw new ApiError(404, "Book not found of this id");
    }
    res
      .status(200)
      .json(new ApiResponse(200, book, "Book is fetched through id"));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch the book", error.message);
  }
});

//update Books

const updateBooks = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  try {
    const updateBook = await Book.findByIdAndUpdate(id, updatedData);
    if (!updateBook) {
      throw new ApiError(404, "Book not found");
    }
    res
      .status(200)
      .json(
        new ApiResponse(updateBook, 200, "Book updated successfully", true)
      );
  } catch (error) {
    throw new ApiError(500, "Failed to update the book", error.message);
  }
});

//Delete books
const deleteBooks = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      throw new ApiError(404, "Book not found");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, deletedBook, "Book deleted successfully", true)
      );
  } catch (error) {
    throw new ApiError(500, "Failed to delete the book", error.message);
  }
});

export { addBook, getBooks, getBookById, updateBooks, deleteBooks };
