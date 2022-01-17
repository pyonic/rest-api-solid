const request = require('supertest');
const app = require('./app');

describe('/api/v2/products POST - New product adding',()=>{
	describe('Correct passed tests', ()=>{
		test('Should get product_id after post',async () =>{
			const response = await request(app).post('/api/v2/products').send({
				name: "Hello from unit test",
				price: 1234,
				quantity: 77
			});
			// console.log(response.body);
			expect(response.body.product_id).toBeDefined(); //Check if product_id exists in response
			expect(response.statusCode).toBe(200); //And chech if status code is 200
		})
	})

	describe('Incorrect passed test',()=>{
		//Check for error for wrong data passed
		test('Should respond 400 and error for wrong post datas',async ()=>{
			const response = await request(app).post('/api/v2/products').send({
				name: 'A',
				price: 7
			});
			expect(response.body.success).toBe(false);
			expect(response.statusCode).toBe(400);
		})
	})
})

describe('/api/v2/product/:id PUT - update product',()=>{

	describe('Check for correct datas', ()=>{

		test('Should return product object if PUT datas are correct',async ()=>{
			const response = await request(app).put('/api/v2/product/1').send({
				name: 'New update from unit test',
				price: 333,
				quantity: 3
			});
			expect(response.body.product).not.toBeNull();
			expect(response.statusCode).toBe(200);
		})

	})

	describe('Check fir incorrect datas', ()=>{
		test('Should return 400 and null as product body', async ()=>{
			const response = await request(app).put('/api/v2/product/1').send({
				name: 'New update from unit test',
				price: 333
			});
			expect(response.body.product).toBeNull();
			expect(response.statusCode).toBe(400);
		})
	})
})

describe('/api/v2/product/del/:id GET - Delete product test', ()=>{
	describe('Checking for correct request',()=>{
		test('Should return success if product deleted', async ()=>{
			const response = await request(app).get('/api/v2/product/del/26');
			expect(response.statusCode).toBe(200);
			expect(response.body.success).toBe(true);
		})
	})
})