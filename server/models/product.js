const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: false,
        minlength: 1,
        trim: true //trims leading and trailing white spaces
    },
    description: {
        type: String,
        required: false,
        minlength: 1,
        trim: true
    },
    picture: {
        type: String,
        required: false
    },
    dateAdded: {
        type: Number,
        default: null
      }
});

// const Product = mongoose.model('Products', ProductSchema);

module.exports = ProductSchema;
