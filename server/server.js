//"use strict"
const env = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const routes  = require('./routes/routes');

//-------API ROUTES---
let app = express();

//middleware configuration, which will parse the requests
app.use(bodyParser.json());
//Inyeccion de depondencia app en routes()
// require('./routes/routes')(app);//
routes(app);
app.listen(process.env.NODE_PORT,() => {
    console.log('----------------------------------------------------------');    
    console.log(`☞ 🖥  Node on port ${process.env.NODE_PORT}`);
    console.log(`☞ Connecting through: ${process.env.MONGODB_URI}`);
    console.log('----------------------------------------------------------\n');
});
//Handles routes

module.exports = {app};