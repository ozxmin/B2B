//"use strict"
const express = require('express');
const bodyParser = require('body-parser');


//-------API ROUTES---
let app = express();
//middleware configuration, which will parse the request
app.use(bodyParser.json());

require('./routes/routes')(app);//

app.listen(3000,() => {
    console.log('Listening on port 3000');
});
//Handles routes
