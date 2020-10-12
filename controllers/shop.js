const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit')

const ProductModel = require("../models/product");
const OrderModel = require("../models/order");

exports.getProducts = (req, res, next) => {
  ProductModel.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  ProductModel.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product,
        docTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  ProductModel.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  ProductModel.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  OrderModel.find({ "user.userId": req.user._id })
  .then((orders) => {
    res.render("shop/orders", {
      path: "/orders",
      docTitle: "Your Orders",
      orders,
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
          email: user.email,
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    docTitle: "Checkout",
  });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  OrderModel.findById(orderId).then(order => {
    if (!order) return next(new Error('No order found.'))
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error('Unauthorized'));
    }
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName)

    const pdfDoc = new PDFDocument();
    res.setHeader(`Content-Type`, `application/pdf`);
    res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text('Invoice', {underline: true});
    pdfDoc.fontSize(18).text('-------------------')
    let totalPrice = 0;
    order.products.forEach(prod => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc.fontSize(12).text(`${prod.product.title} - ${prod.quantity} X $${prod.product.price}`)
    })
    pdfDoc.fontSize(18).text('-------------------')
    pdfDoc.fontSize(18).text(`Total Price: $${totalPrice}`)

    pdfDoc.end()

    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) return next(err);
    //   res.setHeader(`Content-Type`, `application/pdf`);
    //   res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`)
    //   res.send(data);
    // })
    // const file = fs.createReadStream(invoicePath);
    // res.setHeader(`Content-Type`, `application/pdf`);
    // res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
    // file.pipe(res);
    
  }).catch(err => next(err))
}
