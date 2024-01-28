const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb+srv://akshaykrishnam80:UYJjJ2WCBVFhPbHW@cluster0.u6rtwku.mongodb.net/';
const dbName = 'mydatabase'; 

const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports={connectToMongo,dbName, client}
