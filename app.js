const express = require('express');

const { client, dbName, connectToMongo } = require('./config');

const cors = require('cors');

const loger = require('morgan');
const bodyParser = require('body-parser');

const fs = require('fs');
const path = require('path');

const app = express();

app.use(loger('dev'));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log', 'access.log'), { flags: 'a' });

app.use(bodyParser.json());


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

app.get('/search/:param', async (req, res) => {
    const { param } = req.params;
    const collection = req.dbClient.db(dbName).collection('lessons'); 

    try {

        const searchRegex = new RegExp(param, 'i');

        const searchQuery = {
            $or: [
                { location: searchRegex },
                { item_name: searchRegex }
            ]
        };
        
        const data = await collection.find(searchQuery).toArray();
        res.json(data);
    } catch (error) {
        console.error('Error performing search:', error);
        res.status(500).json({ error: 'Error performing search' });
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

app.put('/lesson/:id', async (request, response) => {
    const { id } = request.params;
    const { quantity } = request.body;

    try {
        const lessonsCollection = request.dbClient.db(dbName).collection('lessons');
        const lessonId = parseInt(id);


        const lesson = await lessonsCollection.findOne({ id: lessonId });
        if (!lesson) {
            return response.status(404).send({ message: 'Lesson not found' });
        }


        const newQuantity = lesson.qty - quantity;
        if (newQuantity < 0) {
            return response.status(400).send({ message: 'Insufficient quantity' });
        }


        await lessonsCollection.updateOne({ id: lessonId }, { $set: { qty: newQuantity } });

        response.status(200).send({ message: 'Lesson quantity updated', id: lessonId, newQuantity });
    } catch (error) {
        console.error('Error updating lesson:', error);
        response.status(500).send({ error: 'Error updating lesson' });
    }
});


app.listen(port, () => {
    console.log('App started on port: ' + port);
});
