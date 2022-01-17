const db  = require('../db/db');
const multer  = require('multer');
const express = require('express');
const productsController = require('../controllers/products');
const imagesController = require('../controllers/images');

const router = express.Router();

//Setting multer configurations
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix+file.originalname)
  }
})
const upload = multer({ storage: storage })

//API V2
//Get Products
router.get('/api/v2/products',async (req,res)=>{
	const page = req.query.page || 1;
	await productsController.getProductsAPI(page).then((response)=>{
		res.json(response);
	});
});

// Create new product
router.post('/api/v2/products',async (req,res)=>{
	const data = req.body;
	await productsController.createProductAPI(data).then((response)=>{
		  if(!response.success){
		  	res.status(400);
		  }
			res.json(response);
	});
});

//Get product by id
router.get('/api/v2/product/:id',async (req,res)=>{
	const id = req.params.id;
	productsController.getProductByIdAPI(id).then((product)=>{
		res.json(product);
	})
});

//Update product by id
router.put('/api/v2/product/:id',async (req,res)=>{
	const config = {
		'id' : req.params.id,
		'data' : req.body
	}
	productsController.updateProductById(config).then((response)=>{
		if(!response.success) res.status(400);
		res.json(response);
	})
});
//Delete product
router.get('/api/v2/product/del/:id',async (req,res)=>{
	const id = req.params.id;
	productsController.deleteProduct(id).then((status)=>{
		res.json(status);
	})
});

// Get product images list
router.get('/api/v2/images/:product_id',(req,res)=>{
	const product_id = req.params.product_id;
	imagesController.getProductImages(product_id).then((images_list)=>{
		res.json(images_list);
	})
})

// Upload product image
router.post('/api/v2/images/:parent_id',upload.single('image'),async (req,res)=>{
	const config = {
		'filedata' : req.file,
		'parent' :  req.params.parent_id
	}
	imagesController.uploadImage(config).then((response)=>{
		res.json(response);
	})
});
module.exports = router;