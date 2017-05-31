//"use strict"
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');



//-------API ROUTES---
let app = express();
//middleware configuration, which will parse the request
app.use(bodyParser.json());
//Handles routes
require('./routes/routes')(app);
