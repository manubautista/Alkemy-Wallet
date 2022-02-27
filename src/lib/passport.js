const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');

passport.use('local.signin', new LocalStrategy({
    unsernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    console.log(req.body)
    console.log(email)
    console.log(password)
}));


passport.use('local.signup', new LocalStrategy({
    emailField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const { fullname } = req.body;
    const newUser = {
        email,
        password,
        fullname

    };
    await pool.query('INSERT INTO users SET ?', [newUser]);
}));

// passport.serializeUser((usr, done) => {})