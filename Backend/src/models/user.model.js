import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        maxlength: 30,
        required: true,
        trim: true,
    },
    
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true

    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    phoneNumber:{
        type:Number,
        required:true,
        minlength:10
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,  // Store refresh token for authentication
    },
    role : {
        type: String,
        enum: 
        [
            'user','admin'
        ],
        default: "user"
    },
    //Fields are optional
    profilePicture: {
        type: String, // URL or file path to the profile picture
        default: null,
    },
    bio: {
        type: String,
        maxlength: 250, // User's short description
        default: '',
    },
    address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' } 
    },
})

//Creating a model/table

const User = new mongoose.model("User",userSchema)

export default User;
