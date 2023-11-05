const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: [true, "firstname is required"],
    },
    lastName:{
        type:String,
        required: [true, "firstname is required"],
    },
    email:{
        type:String,
        required: [true, "lastName is required"]
    },
    password:{
        type:String,
        required: [true, "email is required"]
    },
    cpassword:{
        type:String,
        required: [true, "email is required"]
    },
    token:{
        type:String,
        default:''
    }
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;