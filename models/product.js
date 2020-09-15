const mongodb = require('mongodb')
const getDb = require("../utils/database").getDb;

class Product {
	constructor(title, price, description, imageUrl, id) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
		this._id = id;
	}

	save() {
		const db = getDb();
		let dbOp;
		if (this._id) {
			dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this });
		} else {
			dbOp = db.collection('products').insertOne(this);
		}
		return dbOp
			.then((result) => {
				console.log("result: ", result);
				return result;
			})
			.catch((err) => {
				console.log(err);
			});
	}

	static fetchAll() {
		const db = getDb();
		return db
			.collection("products")
			.find()
			.toArray()
			.then((products) => {
				return products;
			})
			.catch((err) => {
				console.log(err);
			});
	}

	static findById(prodId) {
		const db = getDb();
		return db
			.collection("products")
			.find({ _id: new mongodb.ObjectID(prodId) })
			.next()
			.then((product) => {
				return product;
			})
			.catch((err) => {
				console.log(err);
			});
	}
}

module.exports = Product;

// const path = require("path");
// const fs = require("fs");

// const rootDir = require("../utils/path");
// const CartModel = require('./cart')

// const p = path.join(rootDir, "data", "products.json");

// const getProductFromFile = (cb) => {
// 	fs.readFile(p, (err, fileContent) => {
// 		if (err) {
// 			return cb([]);
// 		}
// 		cb(JSON.parse(fileContent));
// 	});
// };

// // const products = [];

// module.exports = class Product {
// 	constructor(id, title, imageUrl, description, price) {
// 		this.id = id;
// 		this.title = title;
// 		this.imageUrl = imageUrl;
// 		this.description = description;
// 		this.price = price;
// 	}

// 	save() {
// 		getProductFromFile((products) => {
// 			if (this.id) {
// 				const existingProductIndex = products.findIndex(
// 					(prod) => prod.id === this.id
// 				);
// 				const updatedProducts = [...products];
// 				updatedProducts[existingProductIndex] = this;
// 				fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
// 					console.log("err: ", err);
// 				});
// 			} else {
// 				this.id = Math.random().toString();
// 				products.push(this);
// 				fs.writeFile(p, JSON.stringify(products), (err) => {
// 					console.log("err: ", err);
// 				});
// 			}
// 		});
// 	}

// 	static fetchAll(cb) {
// 		getProductFromFile(cb);
// 	}

// 	static deleteById(id, cb) {
//         getProductFromFile((products) => {
//             const product = products.find(prod => prod.id === id);
// 			const newProduct = products.filter((p) => p.id !== id);
//             fs.writeFile(p, JSON.stringify(newProduct), (err) => {
//                 if (!err) {
//                     CartModel.deleteProduct(id, product.price)
//                     cb('Deleted...')
//                 }
// 				console.log("err: ", err);
// 			});
// 		});
// 	}

// 	static findById(id, cb) {
// 		getProductFromFile((products) => {
// 			const product = products.find((p) => p.id === id);
// 			cb(product);
// 		});
// 	}
// };
