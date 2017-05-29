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

app.post('/', (req, res) => {
    console.log('request seen');
    var myUser = new User({
        user: req.body.user,
        name: req.body.name,
        itemCount: req.body.itemCount,
        products: req.body.products
    });
    myUser.save().then((savedUser) => {
        console.log('user saved');
        res.status(200).send(savedUser);
        // console.log('saved user', JSON.stringify(savedUser, undefined, 2));
    }, (error) => {
        res.status(400).send(error);
    });
});

app.listen(3000,() => {
    console.log('Listening on port 3000');
});

//---Save a test user
// var myUser = new User({
//     user: 'blath',
//     name: 'blah',
//     itemCount: 3,
//     products: [{ }]
// });
// myUser.save().then((savedUser) => {
//     console.log('saved user', JSON.stringify(savedUser, undefined, 2));
// }, (error) => {
//     console.log('Unable to save', error);
// });
