const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: '598526921905-7tifso3acpeceg89rq0dcr4ccki7mjmk.apps.googleusercontent.com',
      clientSecret:'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',
      callbackURL: 'http://localhost:5000/google/callback',

    },
    async function (accessToken, refreshToken, profile, done) {
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value,
      };

      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

// Google Login Route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Retrieve user data
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/dashboard",
  })
);

// Route if something goes wrong
router.get('/login-failure', (req, res) => {
  res.send('Something went wrong...');
});

// Destroy user session
router.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if(error) {
      console.log(error);
      res.send('Error loggin out');
    } else {
      res.redirect('/')
    }
  })
});


// Presist user data after successful authentication
passport.serializeUser(function (user, done) {
  done(null, user.id);
});


// New
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});




module.exports = router;
