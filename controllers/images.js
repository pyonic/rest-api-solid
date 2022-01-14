const db = require('../db/db');

class ImagesController{
	//Upload image
	async uploadImage(config){
		let filedata = config.filedata;
		let parent = config.parent;
		let images_list;
	    if(filedata){
		    	await db('images').insert({
		    		parent_id : parent,
		    		image_url : filedata.filename
		    	})
			    await db.select('*').from('images').where('parent_id',parent).then((images)=>{
			       	images_list = images;
			    })
		}else{
	        images_list = {success: false, message: 'Error'};
	    }
	    return images_list;
	}
	async getProductImages(product_id){
		let images_list = [];
		await db.select('*').from('images').where('parent_id',product_id).then((images)=>{
				images_list = images;
		})
		return images_list;
	}
}

module.exports = new ImagesController();