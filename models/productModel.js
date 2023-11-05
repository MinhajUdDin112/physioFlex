const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    title:{
        type: String,
        required:true,
        unique:true
    },
    desc:{
        type: String,
        required:true,
    },
    img:{
        type:Array,
        required:true
    },
    categories_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
    subcategories_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subCategory',
        required:true
    },
    price:{
        type: Number,
        required:true,
    },
    quantity:{
        type:Number,
        default: 0
    },
    inStock:{
        type:Boolean,
        default:true
    },
},{timestamps:true}
)

module.exports = mongoose.model('Product', productSchema)