//"use strict"
const env = require('./config');
const express = require('express');
const bodyParser = require('body-parser');


//-------API ROUTES---
let app = express();
//middleware configuration, which will parse the request
app.use(bodyParser.json());

require('./routes/routes')(app);//

app.listen(process.env.NODE_PORT,() => {
    console.log(`Node on port ${process.env.NODE_PORT}`);
    console.log('=========================>>>>');
});
//Handles routes

module.exports = {app};