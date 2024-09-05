require('dotenv').config();
const express = require('express'),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      passport = require('./config/passport'),
      routes = require('./routes/index'),
      cors = require('cors'),
      helmet = require('helmet');
const app = express();

const PORT = process.env.PORT || 4000;

app.use(helmet());

app.use(cors());

app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        sameSite: 'strict' 
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
