exports.pageNotFound = (req, res, next) => {
    // res.status(404).send('<h1>Page Not Found</h1>');
    // res.sendFile(path.join(__dirname, 'views', '404.html'))
    // res.sendFile(path.join(rootDir, "views", "404.html"));
    res.render('404', { docTitle: 'We No See', path: null });
}