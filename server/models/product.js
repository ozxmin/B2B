const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    nombreProducto: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    descripcion: String,
    ventaMinima: {
        type: Number,
        default: 1,
        min: [0, 'la venta no puede ser menor a cero']
    },
    agregado: {
        type: Date,
        default: Date.now
    },
    precio: {
        type: Number,
        min: [1, 'el precio no puede ser menor a un peso']
    },
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
    subCategoria: [String]
});

// const Product = mongoose.model('Products', ProductSchema);

module.exports = ProductSchema;
