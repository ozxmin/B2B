// Vendor imports
const _ = require('lodash');

//Local imports
const {mongoose} = require ('../db/mongoose');
const {Products} = require('../models/product');
const {User} = require('../models/user');
const {authenticate} = require('../middleware/authenticate');

module.exports = function(app) {


//-------------------Private Routes-------------------

    //crear cuenta, genera token que será usado en las rutas privadas
    app.post('/creaUsuario', (req, res) => {
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
            const confirmationFields = _.pick(user,['user','email',
            'ubicacion','rfc','empresa','logotipo','celular','descripcion']);

            //we send the token in the header as custom header `x-header`
            res.status(201).header('x-auth',token).send(confirmationFields);
        }).catch((e) => {
            res.status(400).send(e);
        });
    });

    //despliega campos `publicos` del usuario
    app.get('/miUsuario',authenticate, (req, res) => {
        const usuario = _.pick(req.user,[
            'user','email',, 'direccion', 'ubicacion','rfc','empresa',
            'logotipo','celular','descripcion', 'creado'
        ]);
        res.send(usuario);
    });

    //recibe campos a actualizar del usuario, solo los permitidos serán actualizados
    app.patch('/actualizaMiUsuario', authenticate,(req, res) => {
        //_.pick allow us to choose which properties are available for update
        const body = _.pick(req.body,[
            'user','email','password', 'ubicacion','rfc','empresa',
            'logotipo','celular','descripcion'
        ]);
        let usuario = req.user;
        usuario.update({$set: body}, {new: true}).then((usuario) => {
            res.send(usuario);
        }).catch((error) => {
            res.status(400).send(error);
        });
    });

    //borra usuario
    app.delete('/borraMiUsuario', authenticate, (req, res) => {
        let usuario = req.user;
        usuario.remove({usuario: '._id'}).then((usuario) => {
            res.status(205).send(usuario);
        }).catch((error) => {
            res.status(400).send(error);
        });

    });

//---------APIs PRODUCTOS----

    app.patch('/agregaProducto/', authenticate, (req, res) => {
        const newProduct = _.pick(req.body,[
            'nombreProducto','descripcion','ventaMinima',
            'precio','fichaTech','fotos','categoria','subCategoria'
        ]);
        const usuario = req.user;
        usuario.update({$push: {products: newProduct}}, {new: true}).then((usuario) => {
            res.send({usuario: usuario});
        }).catch((error) => {
            res.status(400).send(error);
        });
    });

    app.listen(3000,() => {
        console.log('Listening on port 3000');
    });

}


///---------------FIN---------------------------------------

//Estas rutas fueron/son SOLO para propositos de 'testeo'
//funcionan con ids generalmente


// //--------------Product API----------------
//
//     //given a user ID update/adds products
//     app.patch('/nuevoProducto/:id',(req, res) => {
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
//     app.delete('/borraProducto/:id', (req, res) => {
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
//     //falls through to catch in app.delete
//     const isThisInCollection = function(usuario, res) {
//         if(!usuario) {
//             return res.status(409).send({"message":"usuario no encontrado"})
//         }
//     }
//

//
// };
