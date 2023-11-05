const subCategoryModel = require('../models/subCategoryModel');
const categoryModel = require('../models/categoryModel')

const addSubCategory = async(req,res) =>{
    try {
        const newSubCategory = new subCategoryModel({sub_category:req.body.sub_category, category:req.body.category})
        const subcat_data = await newSubCategory.save()
        res.status(200).json({success:true, msg:`subCategory added`, data:subcat_data})
    } catch (error) {
        res.status(400).json({
            success:false,
            msg:error.message,
        })
        console.log(error)
    }
}

const get_subcategories = async(req, res)=>{
    try {
        return categoryModel.find();
    } catch (error) {
        res.status(400).json({
            success:false,
            msg:error.message,
        })
    }
}

// getting all sub-categories based on categories
const sub_on_category = async(req,res) =>{
    /* try {
        const categories=req.body.categories  // is like [_1234464 , 987654321] ;
        const filteredProducts= await subCategoryModel.find({ category:{$in:categories}  })
        res.status(200).send({data:filteredProducts})
    } catch (error) {
        res.status(400).json({
            success:false,
            msg:error.message,
        })
        console.log(error)
    } */
    try {
        const categories = await subCategoryModel.find().populate('category');
        res.json(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

// single category and its subcategories
const Singlesub_on_category =async (req,res)=>{
    try {
        const parentId = req.params.categoryId;
    
        // Find the parent category
        const parentCategory = await categoryModel.findById(parentId);
        console.log(parentCategory)
        
        if (!parentCategory) {
          return res.status(404).json({ message: 'Parent category not found' });
        }
    
        // Find all categories with the specified parent
        const subCategories = await subCategoryModel.find({ category: parentId });
        console.log(subCategories)
    
        res.json(subCategories);
      } catch (error) {
        console.error('Error fetching sub-categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

module.exports = {addSubCategory,sub_on_category,Singlesub_on_category}