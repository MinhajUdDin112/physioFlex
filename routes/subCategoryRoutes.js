const express = require('express')
const auth = require('../middleWare/authMiddleware');
const {
    addSubCategory,sub_on_category,Singlesub_on_category
} = require('../controllers/subCategoryCtrl');
const authMiddleWare = require('../middleWare/authMiddleware');

//**********Router**********
const router = express.Router()

// adding subcategories
router.post('/add-subcategory', auth, addSubCategory)

// getting subcategories on categories
router.get('/subcat_on_cat',authMiddleWare, sub_on_category)

// getting subcategories of single category
router.get('/single-subcat_on_cat/:categoryId',authMiddleWare, Singlesub_on_category)

module.exports = router