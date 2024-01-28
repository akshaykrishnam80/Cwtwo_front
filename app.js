const express = require('express');
const logger = require('morgan');

const fs = require('fs');
const path = require('path');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');



app.use(cors());

app.get('/',(req,res)=>{
res.send({"data":"HI"});
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("App started on port: " + port);
});