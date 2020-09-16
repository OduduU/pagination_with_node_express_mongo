const path = require("path");

// const http = require('http');
const express = require("express");
const bodyParser = require("body-parser");
// const expressHandlebar = require('express-handlebars');

// const rootDir = require('./utils/path')

const app = express();

const UserModel = require("./models/user");

const errorController = require("./controllers/404");
const adminRoutes = require("./routes/admin/admin");
const shopRoutes = require("./routes/shop/shop");

const mongoConnect = require("./utils/database").mongoConnect;

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

app.use((req, res, next) => {
	UserModel.findById("5f608f449b2cb81cc44525bc")
        .then((user) => {
            req.user = new UserModel(user.name, user.email, user.cart, user._id);
			next();
		})
		.catch((err) => {
			console.log(err);
		});
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.pageNotFound);

mongoConnect(() => {
	app.listen(3000, (err) => {
		if (err) {
			console.log("Server Connection Error", err);
			throw err;
		}
		console.log("Connected to server..");
	});
});

// const server = http.createServer(app);

// server.listen(3000);
