const express = require('express');
const morgan = require('morgan');
const {engine} = require('express-handlebars');
const path = require('path');
//const { helpers } = require('handlebars');
const session = require('express-session');
//const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const {database} = require('./keys');

// initializations
const app = express();
require('./lib/passport');
// settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

// Middlewares
app.use(session({
    secret: 'alkemywallet',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));

app.use(flash()); 
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next)=>{
    app.locals.success = req.flash('success');
    next();

});

// Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/moves',require('./routes/moves'));



// Public
app.use(express.static(path.join(__dirname, 'public')));


// Starting the server
app.listen(app.get('port'), () =>{
    console.log('Server on port', app.get('port'));
})
