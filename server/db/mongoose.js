const mongoose = require('mongoose');
//uses builtin promises
mongoose.Promise = global.Promise;
let port = '27017'
mongoose.connect(`mongodb://localhost:${port}/B2BUsers`).then(() => {
    console.log('Connected through Mongoose...');
}, (err) => {
    console.log('Not able to connect', err);
});

//object deconstructor in ES6
// module.exports = {mongoose};
module.exports = { mongoose: mongoose }
