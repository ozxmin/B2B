const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    nombreProducto: {
        type: String,
        required: true,
        minlength: 3,
        unique: true,
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
        validate: {
            validator: (precio) => precio > 0,
            message: 'El precio debe ser mayor a 0'
        },
        min: [1, 'el precio no puede ser menor a un peso']
    },
    fichaTech: String,
    //virtual type
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
    categoria: {
        type: String,
        enum: ['categoria1', 'categoria2'],
        default: 'categoria1'
    },
    subcategoria: [{
        type: String,
        required: false
    }],
    vendedor: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
});

const Product = mongoose.model('Products', ProductSchema);

module.exports = Product;
