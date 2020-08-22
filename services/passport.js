const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");
const mongoose = require('mongoose');

const User = mongoose.model('users')

passport.serializeUser( (user, done) => {
  console.log("Serialize ", user);
  done(null, user.id);
});

passport.deserializeUser( async (userId, done) => {
  console.log("Deserialize ", userId);
  const user = await User.findById(userId);
  done(null, user);
});

passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    
    const existingUser = await User.findOne({googleId: profile.id});
    
    if (existingUser) {
      
      console.log('User already exists');
      done(null, existingUser);

    } else {
      
      console.log('Creating user');
      
      const newUser = await new User({
        googleId: profile.id
      }).save();

      done(null, newUser);

    }
  })
);
