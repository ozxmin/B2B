const mongoose = require('mongoose');

const ReviewSchema = new Schema({
    titulo: {
        type: String,
        minlenght: 3
        required: true
    },
    comentario: {
        type: String,
        minlenght: 3
        required: true
    },
    usuario: {
        type: String,
        required: true
    }
    fechaPublicacion: {
        type: Date,
        default: Date.now
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Productos',
        required: true
    },
    link: String
});

let Comment = mongoose.model('resenas', commentSchema);

module.exports = {Comment}