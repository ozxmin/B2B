const env = require('../../config');
const mongoose = require('mongoose');
//uses builtin promises ES6
mongoose.Promise = global.Promise;
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI).then(() => {

    console.log('Connected through Mongoose...');
    console.log(mongoURI);
    console.log('==================');
}, (err) => {
    console.log('Not able to connect', err);
});

//object deconstructor in ES6
// module.exports = {mongoose};
module.exports = { mongoose: mongoose }
