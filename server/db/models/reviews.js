const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    titulo: {
        type: String,
        minlenght: 3,
        required: true
    },
    comentario: {
        type: String,
        minlenght: 3,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    autorRef: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
        required: true
    },
    fechaPublicacion: {
        type: Date,
        default: Date.now
    },
    link: String
});

let Review = mongoose.model('resenas', ReviewSchema);

module.exports = {Review}