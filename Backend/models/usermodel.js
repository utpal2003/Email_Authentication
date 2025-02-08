import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password:
    {
        type: String,
        required: true,
        minlength: 8
    },
    lastlogin:{
        type:Date,
        default: Date.now
    },
    isverified: {
        type: Boolean,
        default: false
    },
    resetpasswordToken: String,
    resetpasswordTokenExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);