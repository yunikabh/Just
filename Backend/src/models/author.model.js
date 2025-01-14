import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
    authorName: {
          type: String,
          required: true
        },
        authorBio: {
          type: String,
          required: true
        },
        moreBooks: {
          type: [String], // List of book titles or identifiers by the author
          default: []
        }
      })

const Author = mongoose.model("Author",authorSchema);

export default Author;