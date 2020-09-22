exports.pageNotFound = (req, res, next) => {
  res.render("404", {
    docTitle: "We No See",
    path: null,
    isAuthenticated: req.isLoggedIn,
  });
};
