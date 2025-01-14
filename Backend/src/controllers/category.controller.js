import express from "express";
// import User from "../models/user.model.js";
// import Book from "../models/book.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import categoryModel from "../models/category.model.js"

const router = express.Router();

//add category

const addCategory = asyncHandler(async(req,res) =>{
        const {name,description} = req.body;

            const existingCategory = await categoryModel.findOne({categoryName:name});
            if(existingCategory){
                throw  new ApiError(400,"Category already exists");
            }
    
            const category = new categoryModel({categoryName:name,description});
            const savedCategory = await category.save();
    
            res.status(201).json(new ApiResponse(201,savedCategory,"Category added successfully"));
            
      
});

//getAllCategory
const getCategory = asyncHandler(async(req,res)=>{
try {
    const allCategory = await categoryModel.find();
    if(allCategory.length === 0){ 
        throw new ApiError(404,"Categories not found")

    }
    res.status(200).json(new ApiResponse(200,allCategory,"All categories retrived successfully."));
   
} catch (error) {
    throw new ApiError(404,"Problem in fetching categories",error.message);
}
})

//Update category
const updateCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    
        const updatedCategory = await categoryModel.findByIdAndUpdate(id,{name,description});
        if(!updatedCategory){
            throw new ApiError(404, 'Category not found');
        }
        res.status(200).json(new ApiResponse(200, updatedCategory, 'Category updated successfully'));
})
//Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
        throw new ApiError(404, 'Category not found');
    }

    res.status(200).json(new ApiResponse(200, deletedCategory, 'Category deleted successfully'));
});

export {
     addCategory,
     getCategory,
     updateCategory,
     deleteCategory
    };