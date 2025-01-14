import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    reviewText: {
      type: String,
      required: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const Review= mongoose.model("Review", reviewSchema);

  export default Review;