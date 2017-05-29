var mongoose = require('mongoose');
var validator = require('validator');
var _ = require('lodash');
//Locals
var ProductSchema = require('./product.js');
var Schema = mongoose.Schema;

// object to configure schema
var UserSchema = new Schema ({
    user: {
        type: String,
        required: true,
        minlength: 3,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        // unique: true,
        trim: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} no es un email valido'
        }
    },
    password: {
        type: String,
        // required: true,
        minlength: 1
    },
    ubicacion: {
        lon: Number,
        lat: Number
    },
    rfc: {
        type: String,
        length: 6
    },
    empresa: String,
    logotipo: String,
    celular: {
        type: Number,
        // isMobilePhone(str, locale)
    },
    descripcion: String,
    creado: {
        type: Date,
        default: Date.now
    },
    // nombre, correo, ubicación (longitud y latitud), Dirección, RFC, Empresa, correo,
    // contraseña, logotipo, celular, descripción (opcional).
    products: [ProductSchema]
});

var User = mongoose.model('UserModel', UserSchema);
module.exports = User;
