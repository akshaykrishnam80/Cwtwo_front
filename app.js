const express = require('express');

const { client,dbName, connectToMongo } = require('./config');

const cors = require('cors');

const loger = require('morgan');
const bodyParser = require('body-parser');


const fs = require('fs');
const path = require('path');

const app = express();

app.use(loger('dev'));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log', 'access.log'), { flags: 'a' });

app.use(bodyParser.json()); // for parsing application/json


app.use(loger('combined', { stream: accessLogStream }));


const port = process.env.PORT || 3000;

app.use(cors());

app.use(async (request, res, next) => {
    request.dbClient = client;
    next();
});

app.get('/collection/:param', async (request, res) => {
    const { param } = request.params;
    const collection = request.dbClient.db(dbName).collection(param);

    try {
        const data = await collection.find().toArray();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.post('/order', async (request, response) => {
    try {
        const order = request.body;
        console.log('Received order:', order);

        const collection = request.dbClient.db(dbName).collection('orders');

        await collection.insertOne(order);

        response.status(201).send({ message: 'Order received successfully', order });
    } catch (error) {
        console.error('Error processing order:', error);
        response.status(500).send({ error: 'Error processing order' });
    }
});

app.put('/lesson/:id', async(request, response)=>{
const {id} = request.params;
const {quantity} = request.body;

console.log(quantity);

});

app.listen(port, () => {
    console.log('App started on port: ' + port);
});
