const {mongoose} = require('mongoose');
const {User} = require('./../../db/models/user');
const {Company} = require('./../../db/models/company');
const {ConnectedAd} = require('./../../db/models/publicidadConnected');
const {Product} = require('./../../db/models/product')

const random = (upTo) =>  Math.floor((Math.random() * upTo) + 1);



///==========Users================
const adminGoodProbe = {
    nombre: `usuario${random(100)}`,
    apellido: 'apellido',
    email: `ejemplo${random(100)}@correo.com`,
    password: 'contrasena',
    nombreEmpresa: `miEmpresa`,
    rol: 'vendedor',
    celular: 1234567890
};
const datosMinEmpresa = {
    nombreEmpresa: `miempresa${random(100)}`, 
    membresia: 'comerciante',
    suscripcion: 'gratis'
};


///========Products=============
const productosDeEmpresa = [{
        nombreProducto: 'Producto1',
        categoria: 'Hilaturas',
        subcategorias: 'Hilo de acrílico',
        descripcion: 'descripcion 1',
        precio: 20,
        inventario: 10,
    }, {
        nombreProducto: 'Producto2',
        categoria: 'Tela',
        subcategorias: 'Tela acrílica',
        descripcion: 'descripcion 2',
        precio: 10,
        inventario: 20
    }, {
        nombreProducto: 'Producto3',
        categoria: 'Ropa especial',
        subcategorias: 'Delantal',
        descripcion: 'descripcion 3',
        precio: 30,
        inventario: 210
    }
]





//==============Ads
const adsConnected =  [
    {
        titulo: 'mi anuncio 1',
        imagen: './blah/blah/imagen1.jpg',
        link: 'connectedb2b.com/ad1',
        descripcion: 'descripcion1',
        posicion: 1
    },
    {
        titulo: 'mi anuncio 2',
        imagen: './blah/blah/imagen2.jpg',
        link: 'connectedb2b.com/ad2',
        descripcion: 'descripcion2',
        posicion: 2
    },
    {
        titulo: 'mi anuncio 3',
        imagen: './blah/blah/imagen3.jpg',
        link: 'connectedb2b.com/ad3',
        descripcion: 'descripcion3',
        posicion: 3
    }
];


//================> Set up

const populateDB = (done) => {
    Promise.all([
        User.remove({}), Company.remove({}), ConnectedAd.remove({}), Product.remove({})
    ]).then(() => {
        // doesnt call middleware, dosent hash password
        return ConnectedAd.insertMany(adsConnected);
    }).then(() => done()
    ).catch((err) => { done(err)});
}



module.exports = {
    populateDB, adsConnected, datosMinEmpresa, adminGoodProbe, random, productosDeEmpresa
}