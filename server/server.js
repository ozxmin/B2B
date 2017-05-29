//"use strict"
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

//Local imports
const {mongoose} = require ('./db/mongoose');
const Products = require('./models/product');
const User = require('./models/user');

let app = express();

//middleware configuration, which will parse the request and
// pass it to the `req` parameter
app.use(bodyParser.json());

//create new user
app.post('/nuevoUsuario', (req, res) => {
    // console.log(req.body.products);
    const body = _.pick(req.body,[
        'user','email','password', 'ubicacion','rfc','empresa',
        'logotipo','celular','descripcion'
    ]);
    const myUser = new User(body);
    myUser.save().then((savedUser) => {
        res.status(200).send(savedUser);
        // console.log('saved user', JSON.stringify(savedUser, undefined, 2));
    }, (error) => {
        res.status(400).send(error);
    });
});

// query user by ID
app.get('/usuario/:id',(req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send('ID no valido');
    }
    User.findById(id).then((usuario) => {
        console.log(usuario);
        if (!usuario) {
            return res.status(404).send('usuario no encontrado');
        }
        res.send({usuario});
    }).catch((error) => {
        res.status(404).send();
    });
    // res.send(req.params);
});


//Update user by ID
app.patch('/usuario/:id',(req, res) => {
    let id = req.params.id;
    //_.pick allow us to choose which properties are available
    // for update
    const body = _.pick(req.body,[
        'user','email','password', 'ubicacion','rfc','empresa',
        'logotipo','celular','descripcion'
    ]);
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    User.findByIdAndUpdate(id, {$set: body}, {new: true}).then((usuario) => {
        if(!usuario) {
            res.status(404).send('usuario no encontrado');
        }
        res.send({usuario: usuario});
    }).catch((error) => {
        res.status(400).send(error);
    });

});


app.listen(3000,() => {
    console.log('Listening on port 3000');
});
