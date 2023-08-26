const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const urlencodedParser = express.urlencoded({ extended: false });

const Usermodel = require('../model/user');

// Configure Passport to use a Local strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
},
  async (email, password, done) => {
    try {
      const user = await Usermodel.findOne({ email: email }).exec();
      if (!user) {
        return done(null, false, { message: 'Invalid Credentials' });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return done(null, false, { message: 'Invalid Credentials' });
      }

      // if (user.status === 'Inactive') {
      //   return done(null, false, { message: 'Please Contact Management' });
      // }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));
// Serialize user object to store in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user object from the session
passport.deserializeUser(async (id, done) => {
  try {
    const Data = await Usermodel.findById(id).exec();
    done(null, Data);
  } catch (err) {
    done(err);
  }
});
// Render the login page
router.get('/', (req, res) => {
  res.render('login');
});

// Handle login form submission
router.post(
  '/',
  urlencodedParser,
  [
    body('email').trim().notEmpty().withMessage('email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('login', { errorMsg: errors.array() });
      }
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.render('login', { errorMsg: info.message });
        }
        req.login(user, err => {
          if (err) {
            return next(err);
          }
          return res.redirect('/dashboard');
        });
      })(req, res, next);
    } catch (err) {
      return next(err);
    }
  }
);

// Handle user logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
