const db = require('../db/db');
const Joi = require('joi');
const { attachPaginate } = require('knex-paginate');
attachPaginate();
const util = require('util')
//Per page pagination count
const PER_PAGE_PAGINATION = 4;

//POST request validation schema
const schema = {
	name: Joi.string().min(3).required(),
	price: Joi.number().required(),
	quantity: Joi.number().integer().required(),
}

class ProductsController {
	async createProductAPI(data){
		const result = Joi.validate(data, schema);
		let product_id = 0;
		try{
			if(result.error === null){
				const { name, price,quantity } = data
				await db('products').insert({
					name: name,
					price:price,
					quantity: quantity,
				}).returning('id').then((id)=>{
					product_id = id;
				});
				return {success:true,'product_id': product_id};
			}else{
				return {success:false,'error': result.error};
			}
		}catch(err){
			return {success:false,'error': err};
		}
	}
	//Return list of products
	async getProductsAPI(page){
		let current_page = page;
		let product_list = [];
		try{
			await db('products')
			  .select({
			    id: 'id',
			    name: 'name',
			    price: 'price',
			    quantity: "quantity"	
			  }).orderBy('id','asc').paginate({ perPage: PER_PAGE_PAGINATION, currentPage: current_page })
			  .then((products) => {
			  	product_list = products.data;
			  })
		}catch(e){
			console.log(e);
		}
		return product_list;
	}

	//Send JSON data obout product by id
	async getProductByIdAPI(id){
		let product = [];
		await db.select('*').from('products').where('id',id).then((prod)=>{
			if(prod.length){
				product = prod;
			}else{
				product = [];
			}
		})
		return product;
	}
	
	//Update single project
	async updateProductById(config){
		const {name,price,quantity} = config.data || {};
		const id = config.id;
		// console.log(name,price,quantity,config.id);
		const result = Joi.validate(config.data, schema);
		let updated_product = {};
		try{
			if(result.error == null){
				await db('products').where('id',id).update({
					name: name,
					price: price,
					quantity: quantity
				})
				await db.select('*').from('products').where('id',id).then((product)=>{
					updated_product =  {success:true, product: product};
				})
			}else{
				updated_product = {success:false, product: null, message: result.error}
			}
		}catch(err){
			updated_product = {success:false, product: null, message: err}
		}
		return updated_product;
	}
	//Delete product
	async deleteProduct(id){
		let status = {success: true, message: 'Product removed successfuly'};
		console.log(id);
		//Deleting all related images to product
		await db('images').where('parent_id', id).del().catch(err=>{
			status = {success: false, message: err};
		});
		//Deleting product
		await db('products').where('id', id).del().catch(err=>{
			status = {success: false, message: err};
		});
		
		return status;
	}
} 


module.exports = new ProductsController();