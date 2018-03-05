const LocalStrategy = require("passport-local").Strategy;
const User          = require("../models/user");
const bcrypt        = require("bcrypt");

module.exports = (passport) => {
  passport.use(new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, user) => {
      if (err) { return next(err); }
      if (!user) { next(null, false, { message: "Incorrect username" }); }
      if (!bcrypt.compareSync(password, user.password)) { next(null, false, { message: "Incorrect password" });
    }

      return next(null, user);
    });
  }));

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });
}
