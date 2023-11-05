const express = require('express')
const multer = require('multer');
const path = require('path');
const {
    addProduct,getProducts,prod_on_category,getsingleProduct,updateProduct,deleteProduct
} = require('../controllers/productCtrl');
const authMiddleWare = require('../middleWare/authMiddleware');

// uploading images
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'../public/images'),function(err,success){
            if(err){
                console.log(err)
            }
        });
    },
    filename:(req,file,cb)=>{
        const name =Date.now()+'-'+file.originalname;
        cb(null,name,function(err,success){
            if(err){
                console.log(err)
            }
        })
    },
})

const upload = multer({storage:storage});

//**********Router**********
const router = express.Router()

// Adding product route
router.post('/add-product', upload.array('file'),authMiddleWare, addProduct)

// Getting all products
router.get('/get-products', authMiddleWare, getProducts)

////GET PRODUCT
router.get('/find/:id',authMiddleWare,  getsingleProduct)

// Getting product based on category
router.get('/get-prod_on_subcategory/:subCategoryId', authMiddleWare, prod_on_category)

// Update product
router.put('/update-product/:id',upload.array('file'), authMiddleWare, updateProduct)

// delete product
router.delete('/delete-product/:id', authMiddleWare, deleteProduct)

module.exports = router