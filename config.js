

const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb+srv://akshaykrishnam80:UYJjJ2WCBVFhPbHW@cluster0.u6rtwku.mongodb.net/';
const dbName = 'mydatabase'; 

const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports.client = client;

