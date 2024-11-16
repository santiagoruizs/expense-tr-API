
const LocalStrategy = require('passport-local').Strategy;
const { findUserByUsername, comparePassword, findUserById } = require('../models/Users');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await findUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const isMatch = await comparePassword(password, user.password_hash);
        
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    process.nextTick (() => done(null, user.user_id))  
  });

  passport.deserializeUser(async (user_id, done) => {
    process.nextTick (() => done(null, user))
    // try {
    //   const user = await findUserById(user_id);
    //   done(null, user);
    // } catch (err) {
    //   done(err, null);
    // }

  });
};
