//"use strict"
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

//Local imports
const {mongoose} = require ('./db/mongoose');
const Products = require('./models/product');
const User = require('./models/user');


//-------API ROUTES---
let app = express();
//middleware configuration, which will parse the request
app.use(bodyParser.json());

//User APIs
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

//Test
app.post('/fullSchema', (req, res) => {
    // console.log(req.body.products);
    const body = _.pick(req.body,[
        'user','email','password', 'ubicacion','rfc','empresa',
        'logotipo','celular','descripcion','products'
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
    isThisValidId(id,res);
    if(!ObjectID.isValid(id)){
        return res.status(404).send('ID no valido');
    }
    User.findById(id).then((usuario) => {
        isThisInCollection(usuario, res);
        res.send({usuario});
    }).catch((error) => {
        res.status(404).send('Catched 404');
    });
});

//Update user by ID
app.patch('/usuario/:id',(req, res) => {
    let id = req.params.id;
    //_.pick allow us to choose which properties are available for update
    const body = _.pick(req.body,[
        'user','email','password', 'ubicacion','rfc','empresa',
        'logotipo','celular','descripcion'
    ]);
    isThisValidId(id,res);
    User.findByIdAndUpdate(id, {$set: body}, {new: true}).then((usuario) => {
        isThisInCollection(usario,res);
        res.send({usuario: usuario});
    }).catch((error) => {
        res.status(400).send(error);
    });
});

// delete user by ID
app.delete('/borraUsuario/:id',(req, res) => {
    let id = req.params.id;
    isThisValidId(id,res);
    User.findByIdAndRemove(id).then((usuario) => {
        if(!usuario) {
            return res.status(409).send({"message":"usuario no encontrado"})
        }
        // isThisInCollection(usario,res);
        res.send({usuario});
    }).catch((e)=>{
        res.status(407).send(e);
    });
});

//Product API

//add add products to a User by user ID
app.patch('/nuevoProducto/:id',(req, res) => {
    var id = req.params.id;
    var newProduct = _.pick(req.body,[
        'nombreProducto','descripcion','ventaMinima',
        'precio','fichaTech','fotos','categoria','subCategoria'
    ]);

    isThisValidId(id,res);
    User.findByIdAndUpdate(id, {$push: {products: newProduct}}, {new: true}).then((usuario) => {
        if(!usuario) {
            return res.status(404).send({"message":"usuario no encontrado"})
        }
        res.send({usuario: usuario});
    }).catch((error) => {
        res.status(400).send(error);
    });
});

//update products by user ID
// app.patch(/update)

//----FUNCTIONS---

const isThisValidId = ((id, res) => {
    if(!ObjectID.isValid(id)){
        return res.status(408).send({ "message":"ID no valido" });
    }
});

//falls through to catch in app.delete
const isThisInCollection = function(usuario, res) {
    if(!usuario) {
        return res.status(409).send({"message":"usuario no encontrado"})
    }
}

//Listening Port
app.listen(3000,() => {
    console.log('Listening on port 3000');
});
