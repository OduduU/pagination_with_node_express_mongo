const mongodb = require("mongodb");
const ProductModel = require("../models/product");

exports.getAddProducts = (req, res, next) => {
	// res.send(
	// 	"<form action='/admin/product' method='POST'><input type='text' name='title'><button type='submit'>Submit</button></form>"
	// );

	// res.sendFile(path.join(__dirname, "..", "..", "views", "add-product.html"));

	// res.sendFile(path.join(rootDir, 'views', 'add-product.html'))

	res.render("admin/edit-product", {
		docTitle: "Add Product",
		path: "/admin/add-product",
		editing: null,
	});
};

exports.postAddProducts = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	// const product = new ProductModel(null, title, imageUrl, description, price);
	// product.save();
	// res.redirect("/");
	const product = new ProductModel(
		title,
		price,
		description,
		imageUrl,
		null,
		req.user._id
	);
	product
		.save()
		.then(() => {
			res.redirect("/admin/products");
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getEditProducts = (req, res, next) => {
	const editMode = req.query.edit;
	if (editMode !== "true") {
		return res.redirect("/");
	}
	const prodId = req.params.productId;
	ProductModel.findById(prodId)
		.then((product) => {
			if (!product) return res.redirect("/");
			res.render("admin/edit-product", {
				docTitle: "Edit Product",
				path: "/admin/edit-product",
				editing: editMode,
				product,
			});
		})
		.catch((err) => console.log(err));
	// ProductModel.findById(prodId, (product) => {
	// 	if (!product) return res.redirect("/");

	// 	res.render("admin/edit-product", {
	// 		docTitle: "Edit Product",
	// 		path: "/admin/edit-product",
	// 		editing: editMode,
	// 		product,
	// 	});
	// });
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDesc = req.body.description;

	const product = new ProductModel(
		updatedTitle,
		updatedPrice,
		updatedDesc,
		updatedImageUrl,
		prodId
	);

	product
		.save()
		.then((result) => {
			res.redirect("/admin/products");
		})
		.catch((err) => {
			console.log(err);
		});

	// const updatedProduct = new ProductModel(
	// 	prodId,
	// 	updatedTitle,
	// 	updatedImageUrl,
	// 	updatedDesc,
	// 	updatedPrice
	// );
	// updatedProduct.save();
	// res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	ProductModel.deleteById(prodId)
		.then((product) => {
			res.redirect("/admin/products");
		})
		.catch((err) => {
			console.log(err);
		});

	// ProductModel.deleteById(prodId, (product) => {
	// 	res.redirect("/admin/products");
	// });
};

exports.getProducts = (req, res, next) => {
	ProductModel.fetchAll()
		.then((products) => {
			res.render("admin/products", {
				prods: products,
				docTitle: "Admin Products",
				path: "/admin/products",
			});
		})
		.catch((err) => console.log(err));
	// ProductModel.fetchAll((products) => {
	// 	res.render("admin/products", {
	// 		prods: products,
	// 		docTitle: "Admin Products",
	// 		path: "/admin/products",
	// 	});
	// });
};
