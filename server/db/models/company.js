//Vendor Libraries
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema ({
    fechaDeRegistro: {
        //unix date
        type: Date,
        default: Date.now
    },
    nombreEmpresa: {
        type: String,
        required: true,
        minlength: 3,
        unique: true,
        trim: true
    },
    logotipo: String,
    ubicacion: {
        type: {
            lon: Number,
            lat: Number
        }
    },
    direccion: String,
    membresia: {
        type: String,
        enum: ['comerciante', 'startup', 'mipyme', 'prime'],
        required: true
    },
    suscripcion: {
        type: String,
        enum: ['mensual', 'anual', 'gratis']
    },
    //monto: virtualType
    intereses: {
        type: [String],
    },
    giro: String,
    cuentaBancaria: {
        type: String,
        lenght: 10
    },
    nombreCuentaHabiente: String,
    rfc: {
        type: String,
        length: 6
    },
    descripcionEmpresa: String,
    productosEmpresa: [{
        type: Schema.Types.ObjectId,
        ref: 'productos'
    }],
    miembros: [{
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    }]
});

//Calcula el monto a pagar por una suscripcion; Dada la membresia y el tiempo contratada
CompanySchema.virtual('montoMembresia').get(function() {
   let company = this;
   let membresia
   switch (company.membresia) {
       case 'comerciante':
           membresia = 0;
           break;
        case 'startup':
           membresia = 500;
           break;
        case 'mipymes':
           membresia = 1000;
           break;
        case 'prime':
           membresia = 2500;
           break;
       default:break;
   }
   if (company.suscripcion === 'anual') {
       membresia = membresia * 0.5;
   }
   return membresia;
});


//string del subdominio a utilizar obtenido del nombre de la empresa
CompanySchema.virtual('subdominio').get(function() {
    return this.nombre;
})

let Company = mongoose.model('companias', CompanySchema);
module.exports = {Company};