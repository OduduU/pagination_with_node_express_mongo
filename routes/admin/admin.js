const path = require('path');

const express = require('express');

const adminController = require('../../controllers/admin')
// const rootDir = require("../../utils/path");

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProducts);

// /admin/products
// router.get("/products", adminController.getProducts);

// /admin/product => POST
router.post("/product", adminController.postAddProducts);

// /admin/edit-product GET
// router.get('/edit-product/:productId', adminController.getEditProducts)

// /admin/edit-product => POST
// router.post('/edit-product', adminController.postEditProduct);

// router.post('/delete-product', adminController.postDeleteProduct)

module.exports = router;