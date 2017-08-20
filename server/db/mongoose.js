const env = require('./../config.js');
const mongoose = require('mongoose');
//uses builtin promises ES6
mongoose.Promise = global.Promise;
const mongoURI = process.env.MONGODB_URI;

console.log(process.env.NODE_ENV);
console.log('objectobjectobjectobjectobject');

mongoose.connect(mongoURI).then(() => {
    
    console.log('Connected through Mongoose...');
    console.log(mongoURI);
    console.log('==================');
}, (err) => {
    console.log(process.env.NODE_PORT);
    console.log(mongoURI);
    console.log('====================');
    console.log('Not able to connect', err);
});

//object deconstructor in ES6
// module.exports = {mongoose};
module.exports = { mongoose: mongoose }
