const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('mongoose').model('User');
const crypto = require('./cryptopass');

module.exports = function() {
    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({
                username: username,
                passwordHash: crypto.hash(password)
            }, function(err, user) {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        if (user) {
            done(null, user.id);
        }
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

};
