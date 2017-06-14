// Vendor imports
const _ = require('lodash');
const {ObjectID} = require('mongodb');

//Local imports
const {mongoose} = require ('../db/mongoose');
const Product = require('../models/product');
const {User} = require('../models/user');
const {authenticate} = require('../middleware/authenticate');
console.log('USER=========');
console.log(User);
console.log('Product=========');
console.log(Product);

module.exports = function(route) {

//-------------------Private User Routes-------------------

    //crear cuenta, genera token que será usado en las rutas privadas
    route.post('/creaUsuario', (req, res) => {
        const fields = _.pick(req.body,[
            'user','email','password', 'ubicacion','rfc','empresa',
            'logotipo','celular','descripcion'
        ]);
        // we'll have the user from the req
        let user = new User(fields);
        user.save().then(() => {
            // we return the rusult from generateAuthToken (a promise)
            return user.generateAuthToken();
        }).then((token) => {
            const confirmationFields = _.pick(user, [
                'user','email', 'ubicacion','rfc','empresa','logotipo',
                'celular','descripcion', 'direccion'
            ]);
            //we send the token in the header as custom header `x-header`
            //needed for auth
            res.status(201).header('x-auth', token).send(confirmationFields);
        }).catch((e) => {
            res.status(400).send(e);
        });
    });

    //despliega campos `publicos` del usuario
    route.get('/miUsuario', authenticate, (req, res) => {
        const usuario = _.pick(req.user, [
            'user','email', 'direccion', 'ubicacion','rfc','empresa',
            'logotipo','celular','descripcion', 'creado'
        ]);
        res.send(usuario);
    });

    //recibe campos a actualizar del usuario, solo los permitidos serán actualizados
    route.patch('/actualizaMiUsuario', authenticate,(req, res) => {
        //_.pick allow us to choose which properties are available for update
        const datosUsuario = _.pick(req.body,[
            'user','email','password', 'ubicacion','rfc','empresa',
            'logotipo','celular','descripcion', 'direccion'
        ]);
        let usuario = req.user;
        usuario.update({$set: datosUsuario}, {new: true}).then((usuario) => {
            res.send(usuario);
        }).catch((error) => {
            res.status(400).send(error);
        });
    });

    //borra usuario
    route.delete('/borraMiUsuario', authenticate, (req, res) => {
        let usuario = req.user;
        usuario.remove({usuario: '._id'}).then((usuario) => {
            res.status(205).send(usuario);
        }).catch((error) => {
            res.status(400).send(error);
        });

    });

//--------------Private Product API----------------------


    //Devuelve todos los productos de un usuario
    route.get('/misProductos',authenticate, (req, res) => {
        res.send(req.user.products);
    });

    //Crea un producto nuevo y lo agrega a su usuario
    route.patch('/agregaProducto', authenticate, (req, res) => {
        const newProduct = _.pick(req.body,[
            'nombreProducto','descripcion','ventaMinima',
            'precio','fichaTech','fotos','categoria','subcategoria', 'inventario'
        ]);
        const usuario = req.user;
        const producto = new Product(newProduct)
        usuario.update({$push: {products: newProduct}}, {new: true}).then((usuario) => {
            res.status(201).send(usuario);
        }).catch((error) => {
            res.status(400).send(error);
        });
    });
    // route.patch('/agregaProducto', authenticate, (req, res) => {
    //     const newProduct = _.pick(req.body,[
    //         'nombreProducto','descripcion','ventaMinima',
    //         'precio','fichaTech','fotos','categoria','subcategoria', 'inventario'
    //     ]);
    //     const usuario = req.user;
    //     usuario.update({$push: {products: newProduct}}, {new: true}).then((usuario) => {
    //         res.status(201).send(usuario);
    //     }).catch((error) => {
    //         res.status(400).send(error);
    //     });
    // });

    //Devuelve producto correspondiente del usuario dado un id
    route.get('/muestraProducto/:id', authenticate, (req, res) => {
        isThisValidId(req.params.id, res);
        const usuario = req.user;
        usuario.getProduct(req.params.id).then((producto) => {
            res.send(producto);
        }).catch((error) => {
            res.status(400).send(error);
        });
    });

    //borra producto
    route.delete('/borraProducto/:id', authenticate, (req, res) => {
        const usuario = req.user;
        isThisValidId(req.params.id, res);
        usuario.getProduct(req.params.id).then((producto) => {
            producto.remove().then(() => {
                usuario.save().then((usuario) => {});
            });
            res.status(204).send({"message": "producto borrado"});
        }).catch((error) => {
            res.status(400).send(error);
        });
    });

    //edita producto 205 Reset Content
    route.patch('/editaProducto/:id', authenticate, (req, res) => {
        isThisValidId(req.params.id, res);
        let usuario = req.user;
        const camposProducto = _.pick(req.body,[
            'nombreProducto','descripcion','ventaMinima',
            'precio','fichaTech','fotos','categoria','subCategoria'
        ]);
        usuario.getProduct(req.params.id).then((producto) => {
            _.merge(producto, camposProducto);
            usuario.save().then(() => {
                res.send(producto);
            });
        });
    });

    //Post /users/login
    // devuelve un token y lo agrega a la BD
    route.post('/login', (req, res) => {
        let credentials = _.pick(req.body, ['user', 'password']);

        User.findByCredentials(credentials.user, credentials.password).then((usuario) => {
            return usuario.generateAuthToken().then((token) => {
                res.header('x-auth', token).send(usuario);
            });
        }).catch((e) => {
            res.status(400).send(e);
        });
    });

    //remueve el token utilizado cuando se llama este api
    route.delete('/logout', authenticate, (req, res) => {
        req.user.removeToken(req.token).then(() => {
            res.status(204).send({"message": "logged-out"});
        }, () => {});
    });

    const isThisValidId = ((id, res) => {
        if(!ObjectID.isValid(id)) {
            return res.status(408).send({ "message":"ID no valido" });
        }
    });
}


///---------------FIN---------------------------------------

//Estas rutas fueron/son SOLO para propositos de 'testeouuu
//funcionan con ids generalmente

// route.post('/nuevoUsuario', (req, res) => {
//     // console.log(req.body.products);
//     const body = _.pick(req.body,[
//         'user','email','password', 'ubicacion','rfc','empresa',
//         'logotipo','celular','descripcion'
//     ]);
//     let myUser = new User(body);
//     myUser.save().then((savedUser) => {
//         res.status(200).send(savedUser);
//         // console.log('saved user', JSON.stringify(savedUser, undefined, 2));
//     }, (error) => {
//         res.status(400).send(error);
//     });
// });
//
// //Test
// route.post('/fullSchema', (req, res) => {
//     // console.log(req.body.products);
//     const body = _.pick(req.body,[
//         'user','email','password', 'ubicacion','rfc','empresa',
//         'logotipo','celular','descripcion','products'
//     ]);
//     const myUser = new User(body);
//     myUser.save().then((savedUser) => {
//         res.status(200).send(savedUser);
//         // console.log('saved user', JSON.stringify(savedUser, undefined, 2));
//     }, (error) => {
//         res.status(400).send(error);
//     });
// });
//
// // query user by ID
// route.get('/usuario/:id',(req, res) => {
//     var id = req.params.id;
//     isThisValidId(id,res);
//     if(!ObjectID.isValid(id)){
//         return res.status(404).send('ID no valido');
//     }
//     User.findById(id).then((usuario) => {
//         isThisInCollection(usuario, res);
//         res.send({usuario});
//     }).catch((error) => {
//         res.status(404).send('Catched 404');
//     });
// });
//
// //Update user by ID
// route.patch('/usuario/:id',(req, res) => {
//     let id = req.params.id;
//     //_.pick allow us to choose which properties are available for update
//     const body = _.pick(req.body,[
//         'user','email','password', 'ubicacion','rfc','empresa',
//         'logotipo','celular','descripcion'
//     ]);
//     isThisValidId(id,res);
//     User.findByIdAndUpdate(id, {$set: body}, {new: true}).then((usuario) => {
//         isThisInCollection(usario,res);
//         res.send({usuario: usuario});
//     }).catch((error) => {
//         res.status(400).send(error);
//     });
// });
//
// // delete user by ID
// route.delete('/borraUsuario/:id',(req, res) => {
//     let id = req.params.id;
//     isThisValidId(id,res);
//     User.findByIdAndRemove(id).then((usuario) => {
//         if(!usuario) {
//             return res.status(409).send({"message":"usuario no encontrado"})
//         }
//         // isThisInCollection(usario,res);
//         res.send({usuario});
//     }).catch((e)=>{
//         res.status(407).send(e);
//     });
// });


// //--------------Product API----------------
//
//     //given a user ID update/adds products
//     route.patch('/nuevoProducto/:id',(req, res) => {
//         const id = req.params.id;
//         const newProduct = _.pick(req.body,[
//             'nombreProducto','descripcion','ventaMinima',
//             'precio','fichaTech','fotos','categoria','subCategoria'
//         ]);
//         isThisValidId(id,res);
//         User.findByIdAndUpdate(id, {$push: {products: newProduct}}, {new: true}).then((usuario) => {
//             if(!usuario) {
//                 return res.status(404).send({"message":"usuario no encontrado"})
//             }
//             res.send({usuario: usuario});
//         }).catch((error) => {
//             res.status(400).send(error);
//         });
//     });
//
//     //Deletes product by ID
//     route.delete('/borraProducto/:id', (req, res) => {
//         let id = req.params.id;
//         if (!ObjectID.isValid(id)) {
//             return res.status(404).send();
//         }
//         Todo.findByIdAndRemove(id).then((todo) => {
//             if (!todo) {
//                 return res.status(404).send();
//             }
//             res.send(todo);
//         }).catch((e) => {
//             res.status(400).send();
//         });
//     });
//
//     //----FUNCTIONS---
//
//     const isThisValidId = ((id, res) => {
//         if(!ObjectID.isValid(id)){
//             return res.status(408).send({ "message":"ID no valido" });
//         }
//     });
//
//     //falls through to catch in route.delete
//     const isThisInCollection = function(usuario, res) {
//         if(!usuario) {
//             return res.status(409).send({"message":"usuario no encontrado"})
//         }
//     }
//

//
// };
