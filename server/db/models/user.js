//Vendor
const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//Locals
const env = require('./../../config');
// const Product = require('./product');
const Schema = mongoose.Schema;
//enviroment
const access = process.env.ACCESS;
const secretValue = process.env.SECRET_VALUE;


// object to configure schema
const UserSchema = new Schema ({
    nombre: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        minlength: 3,
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
    rol: {
        type: String,
        enum: ['admin', 'compras', 'ventas'],
        // required: true
    },
    nombreEmpresa: String,
    empresaRef: {
        type: Schema.Types.ObjectId,
        ref: 'companias',
    },
    celular: {
        type: Number,  
        // isMobilePhone(str, locale)
    },
    creado: {
        //unix date
        type: Date,
        default: Date.now
    },
    tokens: [{
        access:  String,
        token: String,
    }]
});


//=========================Instance Methods=========================


UserSchema.methods.registraEmpresa = function(datosEmpresa) {
    //Shaky route
    //Revisar bien lo de las promesas por que dentro del .then no regresa promesas resueltas
    // revisar el error de unhadled error duplicate key en routes.js
    let Company = mongoose.model('companias')
    let admin = this;
    let nuevaEmpresa = new Company(datosEmpresa);
    let empresaGuardada
    nuevaEmpresa.miembros = admin._id;

    nuevaEmpresa.save().then((empresaDB) => {
        admin.update({$set: {nombreEmpresa: datosEmpresa.nombreEmpresa}}, {new: true}).then((adminUpd) => {     
            // console.log(adminUpd)    
        });
    }).catch((err) => {
        console.log('error save Empresa:',err);
        return Promise.reject(err);
    });
    return Promise.resolve(nuevaEmpresa);
}

//Encuentra el producto de un usuario por su ID
UserSchema.methods.getProduct = function(id) {
    let usuario = this;
    let productId = Schema.Types.ObjectId(id);
    let userProducts = mongoose.model('Productos');

    userProducts.find({_id: mongoose.Types.ObjectId(id)}).then((producto) => {
        console.log(producto);
        return producto
    }).catch(err => {
        return err;
    })

    let productoEncontrado;
    productoEncontrado = usuario.products.id(productId);
    if (!productoEncontrado) {
        return Promise.reject('producto no encontrado');
    }
    return Promise.resolve(productoEncontrado);
}

//Genera un Token de autenticacion
UserSchema.methods.generateAuthToken = function() {
    //`this` stores the individual document
    var user = this;
    // random value for access
    var token = jwt.sign({_id: user._id.toHexString(), access}, secretValue).toString();
    user.tokens.push({access, token});
    // so we can chain another then on server.js
    return user.save().then(() => {
        return token;
    });
};

//Remueve token de usuario cuando hace logout
UserSchema.methods.removeToken = function (token) {
    let user = this;
    return user.update({
        $pull:{ tokens: {
            token: token
        }}
    });
};


//------ Schema Methods--------

//Busca a un usuario por token
UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;
    try {
        //secretValue has to be set as a variable
        decoded = jwt.verify(token, secretValue);
    } catch (error) {
        return Promise.reject('bad token');
    }
    return User.findOne({
        _id: decoded._id,
        //lets us query a nested value
        'tokens.token': token,
        'tokens.access': access
    });
};

//Busca a un usuario dado su usario y password
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
                if (res === true) { resolve(usuario);}
                else { reject('contraseña no valida'); }
            });
        });
    });
};

//Previene el re-hash de un password
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
        next(); //not modified
    }
});

UserSchema.pre('remove', function(next) {
    let user = this;
    let userProducts = mongoose.model('Productos');
    userProducts.remove({_id: {$in: user.productosUsuario}}).then(() => next());
})


let User = mongoose.model('usuarios', UserSchema);
module.exports = {User};



//Overrides what gets sent back to the client in the json
// UserSchema.methods.toJSON = function() {
//     let user = this;
//     //converts mongoose object to regular object
//     let userObject = user.toObject();
//     return _.pick(userObject, ['_id','email']);
// }
