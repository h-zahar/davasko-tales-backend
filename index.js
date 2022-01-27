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
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.json(result);
          });
    
          app.put('/users', async (req, res) => {
            const newUser = req.body;
            const filter = {email: newUser.email};
            const option = {upsert: true};
    
            const upsertedDoc = {
                $set: newUser
            };
            
            const result = await userCollection.updateOne(filter, upsertedDoc, option);
            res.json(result);
          });
    
          app.put('/users/:email', async (req, res) => {
            const { email } = req.params;
            const filter = { email: email };
            const replacedDoc = {
                $set: { isAdmin: true }
            };
    
            const result = await userCollection.updateOne(filter, replacedDoc);
            res.json(result);
          });
    
          app.get('/users/:email', async (req, res) => {
            const { email } = req.params;
            const query = { email: email };
    
            const matchedUser = await userCollection.findOne(query);
            
            if(matchedUser) {
              res.json(matchedUser);
            }
    
            else {
              res.send({});
            }
    
          });


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