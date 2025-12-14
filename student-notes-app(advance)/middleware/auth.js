module.exports = function (req, res, next) {
    if (!req.session.userId) { // this value is acquired when user logs in
        return res.redirect('/login');  // user is NOT logged in → redirect
    }
    next(); // user IS logged in → continue
};
