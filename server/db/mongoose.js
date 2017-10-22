const env = require('./../config.js');
const mongoose = require('mongoose');
//uses builtin promises ES6
mongoose.Promise = global.Promise;
const mongoURI = process.env.MONGODB_URI;


mongoose.connect(mongoURI).then(() => {
    
}, (err) => {
    console.log('☞ Not able to connect', err);
    console.log(process.env.NODE_PORT);
    console.log(mongoURI);
    console.log('====================');
    
});

//object deconstructor in ES6
// module.exports = {mongoose};
module.exports = { mongoose: mongoose }
