const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb+srv://akshaykrishnam80:UYJjJ2WCBVFhPbHW@cluster0.u6rtwku.mongodb.net/';
const dbName = 'mydatabase'; // Replace with your database name

// Create the MongoDB client
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });


// Export the connectToMongo function
async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};


// Export the client

module.exports={connectToMongo,dbName, client}
