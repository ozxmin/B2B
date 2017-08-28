// Vendor imports
const _ = require('lodash');
const {ObjectID} = require('mongodb');

//Local imports
const {mongoose} = require ('./../db/mongoose');
const {Product} = require('./../db/models/product');
const {User} = require('./../db/models/user');
const {Company} = require('./../db/models/company');
const {authenticate} = require('./../routes/middleware/authenticate');


//============================= Rutas exportadas a express (server.js)  ==================================
module.exports = function(route) {

//============================= Rutas empresa  ==================================

const camposRegistroEmpresa = ['nombreEmpresa', 'membresia', 'suscripcion', 'miembros'];
const datosAdmin = ['nombre', 'apellido', 'email', 'rol', 'password']

//Se utiliza al registrarse por primera vez el usuario adiministrador
//Se guarda el usuario y se devuelve el token el cual será utilizado para crear 
//la empresa en el momento deseado
route.post('/registroadmin', (req, res) => {
    let fields = _.pick(req.body, datosAdmin);
    
    let admin = new User(fields);
    admin.rol = 'admin';
    admin.save().then(() => {
        return admin.generateAuthToken();
    }).then((token) => {
        // no se regresa contrasena
        const confirmationFields = _.pick(admin, ['nombre','email', 'apellido', 'creado']);
        // custom header `x-header`
        res.status(201).header('x-auth', token).send(confirmationFields);
        
    }).catch((e) => {
        console.log('/registroAdmin', e);
        res.status(400).send(e);
    });
});

//Despues de guardado el usuario principal se usa registroEmpresa para crear la empresa
//Y guardar los datos esenciales
route.post('/registroEmpresa', authenticate, (req, res) => {
    const datosEmpresa = _.pick(req.body, camposRegistroEmpresa);
    const admin = req.user;
    admin.registraEmpresa(datosEmpresa).then((empresaGuardada) => {
        // console.log('empresa guardada /registroEmpresa',empresaGuardada);
        res.status(201).send(empresaGuardada)
        if(!empresaGuardada) {
            res.status(404).send('empresa no guardada', empresaGuardada);
        }
    }).catch((err) => {
        console.log('err /registroEmpresa',err);
      res.status(400).send(err);  
    })
});



//=========================Rutas Publicas sistema =========================

route.get('/getDiccionarioCategorias', (_, res) => {
    const {diccionarioCategorias} = require('./../db/models/categorias');
    res.status(200).send(diccionarioCategorias);
});





route.patch('/agregaProducto', authenticate, (req, res) => {
    const datosProducto = _.pick(req.body, editablesDeProducto);
    const usuario = req.user;
    const producto = new Product(datosProducto);
    usuario.productosUsuario.push(producto);
    producto.vendedor = usuario;

    Promise.all([usuario.save(), producto.save()]).then((usuario) => {
        res.status(201).send({message: "producto agregado"});
    }).catch(err => {
        res.status(400).send(err);
    });
});


//=========================Rutas Publicas Usuario =========================

const datosPublicosUsuario = ['nombre','email', 'direccion', 'ubicacion','rfc','empresa',
    'logotipo','celular','descripcion', 'creado', 'empresa'];
const datosModificablesPorUsuario = ['nombre','email','password','ubicacion','rfc','empresa',
    'logotipo','celular','descripcion', 'direccion'];

//crear cuenta, genera token que será usado en las rutas privadas
route.post('/creausuario', (req, res) => {
    const fields = _.pick(req.body, datosModificablesPorUsuario);
    // we'll have the user from the req
    let user = new User(fields);
    user.save().then(() => {
        // we return the rusult from generateAuthToken (a promise)
            return user.generateAuthToken();
    }).then((token) => {
        // no se regresa contrasena
        const confirmationFields = _.pick(user, [
            'nombre','email', 'ubicacion','rfc','empresa','logotipo',
            'celular','descripcion', 'direccion'
        ]);
        // custom header `x-header`
        res.status(201).header('x-auth', token).send(confirmationFields);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

// devuelve un token y lo agrega a la BD
route.post('/login', (req, res) => {
    let credentials = _.pick(req.body, ['user', 'password']);

    User.findByCredentials(credentials.user, credentials.password).then((usuario) => {
        return usuario.generateAuthToken().then((token) => {
            res.status(200).header('x-auth', token).send(usuario);
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

//remueve el token utilizado cuando se llama este api
route.delete('/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(205).send({"message": "logged-out"});
    }, () => {});
});

//Muestra un usuario dado su usuario
route.get('/b2b/:user', (req, res) => {
    User.findOne({user: req.params.user}).then((usuario) => {
        const perfilPublico = _.pick(usuario, datosPublicosUsuario);
        if(!usuario) {
            res.status(404).send({"message":"usuario no encontrado"});
        }
        res.status(200).send(perfilPublico);
    }).catch(err => {
        res.status(404).send(err);
    });
});


//=========================Rutas Privadas de Usuario=========================

//despliega campos `publicos` del usuario
route.get('/miUsuario', authenticate, (req, res) => {
    const usuario = _.pick(req.user, datosPublicosUsuario);
    res.send(usuario);
});

//recibe campos a actualizar del usuario, solo los permitidos serán actualizados
route.patch('/actualizaMiUsuario', authenticate,(req, res) => {
    //_.pick allow us to choose which properties are available for update
    const datosUsuario = _.pick(req.body, datosModificablesPorUsuario);
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
        res.status(205).send({"message": "usuario borrado"});
    }).catch((error) => {
        res.status(400).send(error);
    });

});

//=========================Private Product API=========================

const editablesDeProducto = [
    'nombreProducto','descripcion','ventaMinima',
    'precio','fichaTech','fotos', 'categoria','subcategorias', 'inventario'
];

//Devuelve todos los productos de un usuario
route.get('/misProductos', authenticate, (req, res) => {
    let usuario = req.user;
    usuario.populate({path: 'productosUsuario'}).execPopulate().then((usuario) => {
        const productos = usuario.productosUsuario;
        res.status(200).send(productos);
    })
});

//Crea un producto nuevo y lo agrega a su usuario
route.patch('/agregaProducto', authenticate, (req, res) => {
    const datosProducto = _.pick(req.body, editablesDeProducto);
    const usuario = req.user;
    const producto = new Product(datosProducto);
    usuario.productosUsuario.push(producto);
    producto.vendedor = usuario;

    Promise.all([usuario.save(), producto.save()]).then((usuario) => {
        res.status(201).send({message: "producto agregado"});
    }).catch(err => {
        res.status(400).send(err);
    });
});

//borra producto
route.delete('/borraProducto/:id', authenticate, (req, res) => {
    const usuario = req.user;
    const productoId = isThisValidId(req.params.id, res);
    usuario.getProduct(productoId).then((producto) => {
        producto.remove().then(() => {
            usuario.save().then((usuario) => {});
        });
        res.status(205).send({"message": "producto borrado"});
    }).catch((error) => {
        res.status(400).send(error);
    });
});

//edita producto 205 Reset Content
route.patch('/editaProducto/:id', authenticate, (req, res) => {
    const productoId = isThisValidId(req.params.id, res);
    let usuario = req.user;
    const camposProducto = _.pick(req.body, editablesDeProducto);
    usuario.getProduct(productoId).then((producto) => {
        _.merge(producto, camposProducto);
        usuario.save().then(() => {
            res.send(producto);
        });
    });
});

//========================= Rutas Publicas Productos =========================

//Devuelve producto correspondiente del usuario dado un id
route.get('/producto/:id', (req, res) => {
    const productId = isThisValidId(req.params.id, res);
    Product.find({_id: productId}).then((producto) => {
        if (producto.length < 1) {
            res.status(404).send({message: "producto no encontrado"});
        } else  { res.status(200).send(producto); }
    }).catch(err => { res.status(404).send(err); });
});

//Devuelve todos los productos de una categoria
// las categorias con espacios deben ser URL encoded
//Ejemplo:
route.get('/categoria/:categoria', (req, res) => {
    Product.find({categoria: req.params.categoria}).then((productos) => {
        if (productos.length < 1) {
            res.status(404).send({message: `no se encontraron productos en '${req.params.categoria}'`});
        } else  { res.status(200).send(productos); }
    }).catch(err => {
        res.status(404).send(err);
    });
});

//Devuelve los productos de una subcategoria
//Ejemplo de uso: localhost:3000/categoria/Fibras/Fibra%20de%20lana
route.get('/categoria/:categoria/:subcategoria', (req, res) => {
    Product.find({categoria: req.params.categoria}).then((productos) => {
        if (!productos[req.params.subcategoria]) {
            res.status(404).send({message: `no se encontraron productos en '${req.params.subcategoria}'`});
        } else  { res.status(200).send(productos); }
    }).catch(err => {
        res.status(404).send(err);
    });
});

//Utils
//-----
const isThisValidId = ((id, res) => {
    if(!ObjectID.isValid(id)) {
        return res.status(408).send({ "message":"ID no valido" });
    } else {
        return mongoose.Types.ObjectId(id);
    }
});


}
