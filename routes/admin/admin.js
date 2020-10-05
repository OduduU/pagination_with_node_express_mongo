const { body } = require("express-validator");

const express = require("express");

const adminController = require("../../controllers/admin");
const isAuth = require("../../middleware/is-auth");
// const rootDir = require("../../utils/path");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProducts);

// /admin/products
router.get("/products", isAuth, adminController.getProducts);

// /admin/product => POST
router.post(
  "/product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postAddProducts
);

// /admin/edit-product GET
router.get("/edit-product/:productId", isAuth, adminController.getEditProducts);

// /admin/edit-product => POST
router.post("/edit-product",
[
  body("title").isString().isLength({ min: 3 }).trim(),
  body("imageUrl").isURL(),
  body("price").isFloat(),
  body("description").isLength({ min: 5, max: 400 }).trim(),
], isAuth, adminController.postEditProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
