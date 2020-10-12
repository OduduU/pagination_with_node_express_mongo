const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const fileHelper = require('../utils/file');

const ProductModel = require("../models/product");

exports.getAddProducts = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
  });
};

exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description,
      },
      errorMessage: 'Attached file is not an image.',
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description,
      },
      errorMessage: errors.array()[0].msg,
    });
  }

  const imageUrl = image.path

  const product = new ProductModel({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  });

  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
        hasError: false,
        errorMessage: null,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.file;
  const updatedDesc = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
    });
  }

  ProductModel.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString())
        return res.redirect("/");
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (updatedImageUrl) {
        fileHelper.deleteFile(product.imageUrl)
        product.imageUrl = updatedImageUrl.path;
      }
      return product.save().then((result) => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  ProductModel.findById(prodId).then(product => {
    if (!product) return next(new Error('Product not found.'));
    fileHelper.deleteFile(product.imageUrl)
    return ProductModel.deleteOne({ _id: prodId, userId: req.user._id });
  })
  .then((product) => {
    res.redirect("/admin/products");
  })
  .catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

exports.getProducts = (req, res, next) => {
  ProductModel.find({ userId: req.user._id })
    // .select("title price -_id")
    // .populate("userId", "name")
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
