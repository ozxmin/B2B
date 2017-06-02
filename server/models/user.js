var mongoose = require('mongoose');
var validator = require('validator');
var _ = require('lodash');
const jwt = require('jsonwebtoken');
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
        unique: true,
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
        required: true,
        minlength: 1
    },
    direccion: String,
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
        //unix date
        type: Date,
        default: Date.now
    },
    products: [ProductSchema],
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});


//Overrides what gets sent back to the client in the json
// UserSchema.methods.toJSON = function() {
//     let user = this;
//     //converts mongoose object to regular object
//     let userObject = user.toObject();
//     return _.pick(userObject, ['_id','email']);
// }

UserSchema.methods.getProduct = function(id) {
    let usuario = this;
    let productId = mongoose.Types.ObjectId(id);
    let productoEncontrado;
    productoEncontrado = usuario.products.id(productId);
    if (!productoEncontrado) {
        return Promise.reject({ "message":"producto no encontrado"});
    }
    return Promise.resolve(productoEncontrado);
}


//instance method
UserSchema.methods.generateAuthToken = function() {
    //`this` stores the individual document
    var user = this;
    // random value for access
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'secretValue').toString();

    user.tokens.push({access, token});
    // so we can chain another then on server.js
    return user.save().then(() => {
        return token;
    });
};


// Schema method
UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;
    try {
        //secretValue has to be set as a variable
        decoded = jwt.verify(token, 'secretValue');
    } catch (error) {
        // return new Promise((resolve, reject) => {
        //     reject('token not valid');
        // });
        return Promise.reject();
    }
    return User.findOne({
        _id: decoded._id,
        //lets us query a nested value
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};



var User = mongoose.model('UserModel', UserSchema);
module.exports = {User};
