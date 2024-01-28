const express = require('express');

const { client, connectToMongo } = require('./config');

const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = 'mongodb+srv://akshaykrishnam80:UYJjJ2WCBVFhPbHW@cluster0.u6rtwku.mongodb.net/';
const dbName = 'mydatabase';

app.use(cors());

app.use(async (req, res, next) => {
    req.dbClient = client;
    next();
});

app.get('/collection/:param', async (req, res) => {
    const { param } = req.params;
    const collection = req.dbClient.db(dbName).collection(param);

    try {
        const data = await collection.find().toArray();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});



app.listen(port, () => {
    console.log('App started on port: ' + port);
});
