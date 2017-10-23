//Vendor
const mongoose = require('mongoose');
const mongo = require('mongodb');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//Locals
const env = require('./../../config');
const {Company} = require('./company');
const {Product} = require('./product');
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

//registra una empresa si el usuario es admin
UserSchema.methods.registraEmpresa = function(datosEmpresa) {
    //Shaky route
    //Revisar bien lo de las promesas porque dentro del .then no regresa promesas resueltas
    // revisar el error de unhadled error duplicate key en routes.js
    let admin = this;
    let nuevaEmpresa = new Company(datosEmpresa);
    let empresaGuardada
    nuevaEmpresa.miembros = admin._id;

    nuevaEmpresa.save().then((empresaDB) => {
        admin.update({$set: {
            nombreEmpresa: datosEmpresa.nombreEmpresa,
            empresaRef: empresaDB._id
        }}, {new: true}).then((adminUpd) => {     
            // console.log(adminUpd);    
        });
    }).catch((err) => {
        console.log('error save Empresa:',err);
        return Promise.reject(err);
    });
    return Promise.resolve(nuevaEmpresa);
};

//Agrega un producto a la lista de productos de la empresa y los guarda en db
// --no le caería mal una refacorización para reducir el numero de returns
UserSchema.methods.agregaProducto = function (datosProducto) {
    let usuario = this;
//encuentra compañia de usuario
    return usuario.getCompany(usuario.empresaRef).then((compania) => {
        let producto = new Product(datosProducto);
        producto.vendedor = compania;

        return producto.save().then((productoGuardado) => {
            compania.productosEmpresa.push(productoGuardado);
            return compania.save().then((companiaGuardada) => {
                return Promise.resolve(productoGuardado);
            });
        }).catch((err) => {
            console.log(err);
            return Promise.reject('err');
        });
    });
};

//devuelve la compania a la que este usuario pertenece
UserSchema.methods.getCompany = function (id) {
    const user = this;
    const companyId = mongoose.Types.ObjectId(String(id))
    // const Companies = mongoose.model('companias');
    return Company.findOne({_id: companyId}).then((companyFound) => {
        if(!companyFound) {
            return Promise.reject('compania no encontrada');
        }
        return Promise.resolve(companyFound);
    }).catch((err) => {
        console.log(err);
        return Promise.reject(err);
    });
};

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
    })
};

//Busca a un usuario dado su usario y password
UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    return User.findOne({email}).then((usuario) => {
        if (!usuario || email == undefined) {
            console.log('FAILED');
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

//[to be changed]
//removerá su referencia de la empresa
//hacer otro api donde el admin pueda remover usuarios de su empresa
UserSchema.pre('remove', function(next) {
    let user = this;
    let userProducts = mongoose.model('Productos');
    userProducts.remove({_id: {$in: user.productosUsuario}}).then(() => next());
});


let User = mongoose.model('usuarios', UserSchema);
module.exports = {User};