const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MongoDB_URL)
        console.log(`Database connected`.bgGreen.white)
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB