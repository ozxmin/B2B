//Despliega publicidad de la pagina que será ingresada de forma 
// manual por el administrador de connected 
// (editando BD) {Publicidad} = imagen, link, descripción, titulo, posición

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConnectedAdSchema= new Schema ({
    titulo: {
        type: String,
        minlength: 5,
        trim: true,
        required: true
    },
    imagen: String,
    link: String,
    descripcionPublicidad: String,
    posicion: Number
});

//valida que exista un ad en la posicion indicada(Int)
ConnectedAdSchema.statics.findByAdNumber = function(posicion) {
    return this.findOne({posicion: posicion}).then((ad) => {
        if(!ad) {
            return Promise.reject('Publicidad en esa posicion no encontrada');
        }
        return Promise.resolve(ad)
    });
};

let ConnectedAd = mongoose.model('connectedads', ConnectedAdSchema);
module.exports = {ConnectedAd}