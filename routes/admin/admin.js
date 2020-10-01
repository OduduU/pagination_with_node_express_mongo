const path = require('path');

const express = require('express');

const adminController = require('../../controllers/admin')
const isAuth = require('../../middleware/is-auth')
// const rootDir = require("../../utils/path");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProducts);

// /admin/products
router.get("/products", isAuth, adminController.getProducts);

// /admin/product => POST
router.post("/product", isAuth, adminController.postAddProducts);

// /admin/edit-product GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProducts)

// /admin/edit-product => POST
router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct)

module.exports = router;