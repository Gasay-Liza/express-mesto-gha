
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Map = require('./models/card');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
useNewUrlParser: true});

app.use('/users', require('./routes/users'));

const {PORT = 3000} = process.env;
app.use(bodyParser.json());


app.listen(PORT, () => {
  console.log('Server started on port '+ PORT)
})
