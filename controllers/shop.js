const ProductModel = require("../models/product");
const CartModel = require("../models/cart");

// exports.getProducts = (req, res, next) => {
// 	// res.send("<h1>Hello from Express!<h1>");
// 	// res.sendFile('../../views/shop.html');
// 	// res.sendFile(path.join(__dirname, "..", "..", "views", "add-product.html"));
// 	// console.log('Products: ', adminData.products)
// 	// res.sendFile(path.join(rootDir, 'views', 'shop.html'));

// 	ProductModel.fetchAll((products) => {
// 		res.render("shop/product-list", {
// 			prods: products,
// 			docTitle: "All Products",
// 			path: "/products",
// 		});
// 	});
// };

exports.getProducts = (req, res, next) => {
	ProductModel.fetchAll()
		.then((products) => {
			res.render("shop/product-list", {
				prods: products,
				docTitle: "All Products",
				path: "/products",
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	console.log('getById', prodId)
	ProductModel.findById(prodId).then((product) => {
		res.render("shop/product-detail", {
			product,
			docTitle: product.title,
			path: null,
		});
	}).catch((err) => {
		console.log(err)
	})

	// ProductModel.findById(prodId, (product) => {
	// 	res.render("shop/product-detail", {
	// 		product,
	// 		docTitle: product.title,
	// 		path: null,
	// 	});
		
	// });
};

exports.getIndex = (req, res, next) => {
	ProductModel.fetchAll()
		.then((products) => {
			res.render("shop/index", {
				prods: products,
				docTitle: "Shop",
				path: "/",
			});
		})
		.catch((err) => {
			console.log(err);
		}); 
};

// exports.getIndex = (req, res, next) => {
// 	ProductModel.fetchAll((products) => {
// 		res.render("shop/index", {
// 			prods: products,
// 			docTitle: "Shop",
// 			path: "/",
// 		});
// 	});
// };

exports.getCart = (req, res, next) => {
	CartModel.getCart((cart) => {
		ProductModel.fetchAll((products) => {
			const cartProducts = [];
			for (product of products) {
				const cartProductData = cart.products.find(
					(prod) => prod.id === product.id
				);
				if (cartProductData) {
					cartProducts.push({ productData: product, qty: cartProductData.qty });
				}
			}
			res.render("shop/cart", {
				path: "/cart",
				docTitle: "Your Cart",
				products: cartProducts,
			});
		});
	});
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	ProductModel.findById(prodId, (product) => {
		CartModel.addProduct(prodId, product.price);
		res.redirect("/cart");
	});
};

exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	ProductModel.findById(prodId, (product) => {
		console.log("product", product);
		CartModel.deleteProduct(prodId, product.price);
		res.redirect("/cart");
	});
};

exports.getOrders = (req, res, next) => {
	res.render("shop/orders", {
		path: "/orders",
		docTitle: "Your Orders",
	});
};

exports.getCheckout = (req, res, next) => {
	res.render("shop/checkout", {
		path: "/checkout",
		docTitle: "Checkout",
	});
};
