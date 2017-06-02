//"use strict"
const express = require('express');
const bodyParser = require('body-parser');




//-------API ROUTES---
let app = express();
//middleware configuration, which will parse the request
app.use(bodyParser.json());
//Handles routes
require('./routes/routes')(app);
