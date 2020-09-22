const path = require("path");

// const http = require('http');
const express = require("express");
const bodyParser = require("body-parser");
// const expressHandlebar = require('express-handlebars');
const session = require("express-session");

const mongoose = require("mongoose");
const MongoDbSessionStore = require("connect-mongodb-session")(session);

const MONGODB_URI =
  "mongodb+srv://oduduu:emem@2000@cluster0.uqgye.mongodb.net/shop?retryWrites=true&w=majority";

// const rootDir = require('./utils/path')

const app = express();
const store = new MongoDbSessionStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

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

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) return next()
  UserModel.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.pageNotFound);

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
    console.log(err);
  });

// const server = http.createServer(app);

// server.listen(3000);
