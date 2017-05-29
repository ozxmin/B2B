const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    nombreProducto: {
        type: String,
        required: true,
        minlength: 3,
        trim: true //trims leading and trailing white spaces
    },
    descripcion: {
        type: String,
        minlength: 1,
        trim: true
    },
    ventaMinima: {
        type: Number,
        default: 1
    },
    creado: {
        type: Date,
        default: Date.now
    },
    costo: Number,
    fichaTech: String,
    inventario: {
        type: Number,
        min: 0
    },
    fotos: [{
        type: String,
        required: false
    }],
    //Disponible(?)
    estado: Boolean,
    categoria: String,
    subCategoria: [{
        type: String
    }]
});

// const Product = mongoose.model('Products', ProductSchema);

module.exports = ProductSchema;
