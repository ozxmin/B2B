//"use strict"
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
//Local imports
var {mongoose} = require ('./db/mongoose');
var Products = require('./models/product');
var User = require('./models/user');

var app = express();

//middleware configuration, which will parse the request and
// pass it to the `req` parameter
app.use(bodyParser.json());

var myUser = new User({
    user: 'blath',
    name: 'blah',
    itemCount: 3,
    products: [{ }]
});

myUser.save().then((savedUser) => {
    console.log('saved user', JSON.stringify(savedUser, undefined, 2));
}, (error) => {
    console.log('Unable to save', error);
});

// , (err, result) => {
//    if (err) {
//      return console.log('Unable to insert todo', err);
//    }
//
//    console.log(JSON.stringify(result.ops, undefined, 2));
//  });
