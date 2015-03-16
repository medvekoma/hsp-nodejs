module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('home');
    });

    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.get('/admin', isLoggedIn, function (req, res) {
        res.render('admin', {user : req.user});
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect: '/admin',
                failureRedirect: '/login'
            }));

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't ...
        res.redirect('/login');
    }
};