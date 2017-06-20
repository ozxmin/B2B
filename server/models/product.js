const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const diccionarioCategorias = require('./categorias.js');

const ProductSchema = new Schema({
    vendedor: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
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
        min: [1, 'la venta no puede ser menor a uno']
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
    estado: Boolean, //Disponible(?)
    categoria: String,
    subcategorias: [{
        type: String,
    }]
});

//Validar categorias y subcategorias
ProductSchema.pre('save', function(next, err) {
    // let categoria_req = this.categorias;
    let categoria_req = this.categoria;
    let subcategorias_req = this.subcategorias;
    if (!diccionarioCategorias[categoria_req]) {
        err({"error": `${categoria_req} no es una categoria`})
    } else {
        let filteredSubCategories = subcategorias_req.filter(function(subcategoria) {
            return diccionarioCategorias[categoria_req].includes(subcategoria);
        });
        this.subcategorias = filteredSubCategories
        next();
    }


});


const Product = mongoose.model('Productos', ProductSchema);

module.exports = Product;
