var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../app/models/user');

var configAuth = require('./auth');

module.exports = function(passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
    },
    function (token, refreshToken, profile, done) {
        process.nextTick(function () {
            var user = new User(profile.id, token, profile.displayName, profile.emails[0].value);
            return done(null, user);
        });
    }));
};

