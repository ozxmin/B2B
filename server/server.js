//"use strict"
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
//Local imports
var {mongoose} = require ('./db/mongoose');
var {Products} = require('./models/product');
var {User} = require('./models/user');

var app = express();

//middleware configuration, which will parse the request and
// pass it to the `req` parameter
app.use(bodyParser.json());
