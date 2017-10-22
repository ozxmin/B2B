//
// Modelo Mongoose para los productos
//

const env = require('./../../config');
const mongoose = require('mongoose');
const {diccionarioCategorias} = require('./categorias');
const Schema = mongoose.Schema;


const ProductSchema = new Schema({
    vendedor: {
        type: Schema.Types.ObjectId,
        ref: 'empresa',
        required: true
    },
    nombreProducto: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
        
    },
    categoria: String,
    subcategorias: [{
        type: String,
    }],
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
    disponible: Boolean, //Disponible(?)
    oferta: Number,
    comentariosProducto: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'resenas'
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


let Product = mongoose.model('productos', ProductSchema);
module.exports = {Product};
