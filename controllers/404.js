exports.pageNotFound = (req, res, next) => {
  res.render("404", {
    docTitle: "We No See",
    path: null,
    isAuthenticated: req.isLoggedIn,
  });
};

exports.get500 = (req, res, next) => {
  res.render("500", {
    docTitle: "This app dn cast!",
    path: null,
    isAuthenticated: req.isLoggedIn,
  });
};
