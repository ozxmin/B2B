const mongoose = require('mongoose');
const ProductSchema = require('./product.js');
const Schema = mongoose.Schema;

// object to configure schema
const UserSchema = new Schema ({
    user: {
        type: String,
        required: true,
        minlength: 3,
        unique: true,
        trim: true
    },
    //Valida que el nombre sea mayor de 2 caracteres
    name: {
        type: String,
        validate: {
            //Toma el nombre y regresa un booleano, si es falso se despliega mensaje
            validator: (name) => name.length > 2,
            message: 'El nombre debe ser mayor a dos caractares'
        },
        required: [true, 'El nombre se necesario.']
    },
    itemCount: Number,
    products: [ProductSchema]
});


const User = mongoose.model('UserModel', UserSchema);

module.experts = {User};
