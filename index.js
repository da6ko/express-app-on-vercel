const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');

// Configure Express to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// MongoDB connection URI and database name
const uri = 'mongodb+srv://user1:user1@testcluster.ehr4d.mongodb.net/Locations?retryWrites=true&w=majority';
const dbName = 'Locations';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDBAtlas() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error(error);
  }
}
connectToMongoDBAtlas();

// Endpoint to save data to MongoDB
app.post('/saveData', (req, res) => {

  const data = req.body;

  console.log('Received data:', data);

  const db = client.db(dbName);
  const collection = db.collection('Users');

  // Insert the data into MongoDB
  collection.insertOne(data, function(err, result) {
    if (err) {
      console.error('Error saving data to MongoDB:', err);
      res.status(500).json({ error: 'Failed to save the data' });
    } else {
      console.log('Data saved successfully');
      res.json({ success: true });
    }
  });
});

// Route handler for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(8080, () => {
  console.log('Server started on port 8080');
});


// Export the Express API
module.exports = app;

