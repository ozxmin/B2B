var mongoose = require('mongoose');
var validator = require('validator');
var _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
        minlength: 6
    },
    direccion: String,
    ubicacion: {
        type: {
            lon: Number,
            lat: Number
        }
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

// Schema methods

UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;
    try {
        //secretValue has to be set as a variable
        decoded = jwt.verify(token, 'secretValue');
    } catch (error) {
        return Promise.reject('bad token');
    }
    return User.findOne({
        _id: decoded._id,
        //lets us query a nested value
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};


UserSchema.methods.removeToken = function (token) {
    let user = this;
    return user.update({
        $pull:{ tokens: {
            token: token
        }}
    });
};


UserSchema.statics.findByCredentials = function (user, password) {
    let User = this;
    return User.findOne({user}).then((usuario) => {
        if (!usuario) {
            return Promise.reject('usuario no encontrado');
        }
        //bcrypct doesnot support promises so we wrap it up to keep working
        //with promises
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, usuario.password, (err, res) => {
                if (res === true) {
                    resolve(usuario);
                } else {
                    reject('contraseña no valida');
                }
            });
        });
    });
};


UserSchema.pre('save', function(next) {
    let user = this;
    //prevets to hash un-modified passwords when saving docs
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        //not modified
        next();
    }

});


var User = mongoose.model('UserModel', UserSchema);
module.exports = {User};
