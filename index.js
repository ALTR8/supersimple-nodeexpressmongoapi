const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const app            = express();
require('dotenv').config()
const bodyParser     = require('body-parser');
var validator        = require('express-validator');
const db             = require('./config/db');

const port           = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());


MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  require('./app/routes')(app, database);
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });
})
