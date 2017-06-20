const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const diccionarioCategorias = require('./categorias.js');

// const categorias = ['Accesorios de moda','Accesorios generales','Bolsos, maletas y fundas','Calzado y accesorios','Cuero, piel y plumas','Diseñadores textiles','Fibras','Fibras innovadoras','Hilaturas','Maquinaria','Otros textiles y productos de cuero','Plásticos','Químicos','Ropa','Ropa especial','Servicios','Tela','Textil hogar','Textil medico','Textil para el paquete'];

// const Fibras = ['Fibra acrílica','Fibra de aramida','Fibra de bambu','Fibra química','Fibra de cáñamo','Fibra hueca','Fibra de yute','Fibra de lino','Fibra Modacrílica','Fibra de nailon','Fibra de poliester','Fibra de polipropileno','Algodón en bruto','Fibra de poliéster reciclado','Fibra de seda','Fibra de grapas','Fibra sintética','UHMWPE Fibra','Fibra de viscosa','Fibra de lana','Otras fibras'],;


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
    console.log(diccionarioCategorias);
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
