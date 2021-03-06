const express = require("express");
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require("./config/keys");

require("./models/User");
require('./services/passport');

const PORT = process.env.PORT || 1000;

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
