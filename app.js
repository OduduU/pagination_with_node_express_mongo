const path = require("path");

// const http = require('http');
const express = require("express");
const bodyParser = require("body-parser");
// const expressHandlebar = require('express-handlebars');
const session = require("express-session");
const multer = require("multer");

const mongoose = require("mongoose");
const MongoDbSessionStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const MONGODB_URI =
  "mongodb+srv://oduduu:emem@2000@cluster0.uqgye.mongodb.net/shop?retryWrites=true&w=majority";

// const rootDir = require('./utils/path')

const app = express();
const store = new MongoDbSessionStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.fieldname + '-' + file.originalname );
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false)
  }
}

const UserModel = require("./models/user");

const errorController = require("./controllers/404");

const adminRoutes = require("./routes/admin/admin");
const shopRoutes = require("./routes/shop/shop");
const authRoutes = require("./routes/auth/auth");

// Serving templating engine
// app.engine("hbs", expressHandlebar({
//     layoutsDir: 'views/layouts',
//     defaultLayout: 'main-layout',
//     extname: 'hbs'
// }));
app.set("view engine", "ejs");
app.set("views", "views");

// Middleware to parse body data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: fileStorage, fileFilter}).single('image'))

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images",)));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) return next();
  UserModel.findById(req.session.user._id)
    .then((user) => {
      if (!user) return next();
      req.user = user;
      next();
    })
    .catch((err) => {
      const error = new Error(err);
      next(error);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

app.use(errorController.pageNotFound);

app.use((error, req, res, next) => {
  // res.redirect('/500')
  res.status(500).render("500", {
    docTitle: "Error dn dy",
    path: "/500"
  });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to Database...");
    return UserModel.findOne();
  })
  .then((user) => {
    if (!user) {
      const user = new UserModel({
        name: "Jide",
        email: "jide@test.com",
        cart: {
          items: [],
        },
      });
      return user.save();
    }
  })
  .then(() => {
    app.listen(3000, () => {
      console.log("Connected to Server...");
    });
  })
  .catch((err) => {
    console.log('Failed to connect to database.')
  });