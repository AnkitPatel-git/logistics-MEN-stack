const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const winston = require('winston');
require('dotenv').config();
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.secretKey,
    resave: false,
    saveUninitialized: false
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(helmet());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Database connection setup
mongoose.connect(process.env.MongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


// API Routes
app.use('/', require('./controllers/authcontroller'));
// middleware for route starting from "/"
app.use('/', function (req, res, next) {
  if (req.isAuthenticated()) {
      res.locals.user = req.user;
    next();
  } else {
    res.redirect('/');
  }
});
app.use('/dashboard', require('./controllers/dashboard'));
app.use('/admin', require('./routes/admin'));
// Error handling middleware
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
  // return res.status(500).json('Restricted');
});

// Logging configuration using winston
global.logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(), // Add timestamp
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'app.log' })
    ]
  });
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port}!`));