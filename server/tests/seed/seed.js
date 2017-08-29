const {mongoose} = require('mongoose');
const {User} = require('./../../db/models/user');
const {Company} = require('./../../db/models/company');
const {ConnectedAd} = require('./../../db/models/publicidadConnected');

const random = (upTo) =>  Math.floor((Math.random() * upTo) + 1);

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
        User.remove({}), Company.remove({}), ConnectedAd.remove({})
    ]).then(() => {
        // doesnt call middleware, dosent hash password
        return ConnectedAd.insertMany(adsConnected);
    }).then(() => done()
    ).catch((err) => { done(err)});
}



module.exports = {populateDB, adsConnected, datosMinEmpresa, adminGoodProbe, random}