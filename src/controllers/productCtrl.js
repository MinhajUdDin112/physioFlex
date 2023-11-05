const productModel = require('../models/productModel');
const subCategoryModel = require('../models/subCategoryModel')
const categoryCtrl = require('../controllers/categoryCtrl');


// adding product
const addProduct = async(req,res) =>{
    try {
        var arrImages =[];
        for(let i=0; i<req.files.length; i++){
            arrImages[i]= req.files[i].filename;
        }
        const product = new productModel({
            user_id:req.body.user_id,
            title:req.body.title,
            desc:req.body.desc,
            img:arrImages,
            categories_id:req.body.categories_id,
            subcategories_id:req.body.subcategories_id,
            price:req.body.price,
            inStock:req.body.inStock
        })
        const product_data = await product.save()
        res.status(200).json({success:true,message:"product added",data:product_data})
    } catch (error) {
        res.status(400).json({
            success:false,
            msg:error.message,
        })
        console.log(error)
    }
}

// getting all Products
const getProducts = async(req,res) =>{
    try {
        var send_data = [];
        var cat_data = await categoryCtrl.get_categories();
        if(cat_data.length > 0){
            for(let i=0; i< cat_data.length; i++){
                var product_data = [];
                var cat_id = cat_data[i]['_id'].toString();
                const cat_pro = await productModel.find({categories_id:cat_id})
                if(cat_pro.length>0){
                    for(let j=0; j<cat_pro.length; j++){
                        product_data.push({
                            "product_name":cat_pro[j]['title'],
                            "images":cat_pro[j]['img'],
                            'price':cat_pro[j]['price']
                        })
                    }
                }
                send_data.push({
                    "category":cat_data[i]['category'],
                    "product":product_data
                })
            }
            res.status(200).send({success:true,msg:'product detail', data:send_data})
        }else{
            res.status(200).json({success:false,msg:"product detail", data: cat_data})
        }
    } catch (error) {
        res.status(400).json({
            success:false,
            msg:error.message,
        })
        console.log(error)
    }
}

//GET PRODUCT
const getsingleProduct = async(req,res)=>{
    try {
        const product = await productModel.findById(req.params.id);
        res.status(200).json(product);
      } catch (err) {
        res.status(500).json(err);
      }
}

// get products based on subcategory
const prod_on_category = async(req,res) =>{
    try {
        const subCategoryId = req.params.subCategoryId;
    
        // Find the sub-category
        const subCategory = await subCategoryModel.findById(subCategoryId);
        
        if (!subCategory) {
          return res.status(404).json({ message: 'Sub-category not found' });
        }
    
        // Find products with the specified sub-category
        const products = await productModel.find({ subcategories_id: subCategoryId });
    
        res.json(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

//UPDATE
const updateProduct=async(req,res)=>{
  try {
    var dataobj;
    var arrayImg = [];
    if(req.files.length > 0){
      for(let i=0; i<req.files.length; i++){
        arrayImg[i] = '/public/images/'+req.files[i].filename;
      }
      dataobj = {
        title : req.body.title,
        desc:req.body.desc,
        price : req.body.price,
        quantity:req.body.quantity,
        inStock: req.body.inStock,
        img : arrayImg
      }
    }else{
      dataobj = {
        title : req.body.title,
        desc:req.body.desc,
        price : req.body.price,
        quantity:req.body.quantity,
        inStock: req.body.inStock
      }
    }

    const updateProduct = await productModel.findByIdAndUpdate(
       req.params.id ,
      { $set: dataobj },
      { new: true}
      )
      res.status(200).json(updateProduct);

  } catch (err) {
    res.status(500).json(err);
    console.log(err)
  }
}

  
  //DELETE
const deleteProduct = async (req,res)=>{
    try {
        await productModel.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
}
 


module.exports = {addProduct, getProducts,prod_on_category,getsingleProduct,updateProduct,deleteProduct}