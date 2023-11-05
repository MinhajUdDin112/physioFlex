const categoryModel = require('../models/categoryModel');

const addCategory = async(req,res) =>{
    try {
        const newCategory = new categoryModel({category:req.body.category})
        const cat_data = await newCategory.save()
        res.status(200).json({success:true, msg:`Category added`, data:cat_data})
    } catch (error) {
        res.status(400).json({
            success:false,
            msg:error.message,
        })
    }
}

// getting all categories
const get_categories = async(req, res)=>{
    try {
        return categoryModel.find();
    } catch (error) {
        res.status(400).json({
            success:false,
            msg:error.message,
        })
    }
}

module.exports = {addCategory,get_categories}