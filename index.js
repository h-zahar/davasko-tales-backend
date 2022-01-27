const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = 5000 | process.env.PORT;

app.use(cors());
app.use(express.json());


const { MongoClient, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.gmeoo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const run = async() => {
    try {
        await client.connect();

        const database = client.db(process.env.DB_NAME);
  
        const userCollection = database.collection(process.env.DB_COLLECTION_USER);
        const postCollection = database.collection(process.env.DB_COLLECTION_BLOG);

        // Requests



    } finally {

    }
};
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Server Running Hapily...');
});

app.listen(port, () => {
    console.log(`Listening at Port ${port}`);
});