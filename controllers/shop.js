const ProductModel = require("../models/product");
const OrderModel = require("../models/order");

exports.getProducts = (req, res, next) => {
  ProductModel.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log("prodId:", req.params);
  ProductModel.findById(prodId)
    .then((product) => {
      console.log("singleProduct:", product);
      res.render("shop/product-detail", {
        product,
        docTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  ProductModel.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((products) => {
      res.render("shop/cart", {
        path: "/cart",
        docTitle: "Your Cart",
        products: products.cart.items,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  ProductModel.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  OrderModel.find({ "user.userId": req.user._id })
  .then((orders) => {
    res.render("shop/orders", {
      path: "/orders",
      docTitle: "Your Orders",
      orders,
      isAuthenticated: req.session.isLoggedIn
    });
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((cartItem) => {
        return {
          product: { ...cartItem.productId._doc },
          quantity: cartItem.quantity,
        };
      });

      const order = new OrderModel({
        products,
        user: {
          userId: user._id,
          name: user.name,
        },
      });

      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    docTitle: "Checkout",
    isAuthenticated: req.session.isLoggedIn
  });
};
