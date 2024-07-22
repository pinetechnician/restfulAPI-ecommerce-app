require('dotenv').config();
const express = require('express'),
      bodyParser = require('body-parser'),
      db = require('./config/database'),
      routes = require('./routes'),
      app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
