const express = require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../database');




router.get('/signup', (req, res) =>{
    res.render('auth/signup')
});




router.post('/signup', async (req, res) => {
    const { fullname, email, password} = req.body;
    const nuevoUsuario = {
        fullname,
        email,
        password
    };
    await pool.query('INSERT INTO users set ?', [nuevoUsuario]);
    req.flash('success', 'Cuenta creada con éxito.');
    res.redirect('/moves')
})


router.get('/signin', (req, res) => {
    res.render('auth/signin');
})

router.post('/signin', (req, res, next) =>{
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next)
});

router.get('/profile', (req, res) => {
    res.send('Profile')
});

module.exports = router;