const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

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
        const blogCollection = database.collection(process.env.DB_COLLECTION_BLOG);

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

          app.get('/all-blogs', async (req, res) => {
            const query = {};
            const cursor = blogCollection.find(query);
    
            const results = await cursor.toArray();
            
            if(results) {
              res.json(results);
            }
    
            else {
              res.send([]);
            }

          });

          app.get('/blogs', async (req, res) => {
            // const query = {};
            const query = { isApproved: true };
            const cursor = blogCollection.find(query);
            const count = await cursor.count();
            
            const page = req.query.page;
            const size = parseInt(req.query.size);

            let blogs;

            if (page) {
              blogs = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
              blogs = await cursor.toArray();
            }

            
            if(count) {
              res.send({
                count,
                blogs
              });
            }
    
            else {
              res.send({});
            }
    
          });

          app.get('/blogs/:email', async (req, res) => {
            const { email } = req.params;
            const query = { traveler_email: email };
            
            const cursor = blogCollection.find(query);
    
            const results = await cursor.toArray();
    
            if(results) {
                res.json(results);
            }
    
            else {
                res.send([]);
            }
  
          });

          app.get('/single/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) };
            
            const matchedBlog = await blogCollection.findOne(query);
            
            if(matchedBlog) {
              res.json(matchedBlog);
            }
      
            else {
              res.send({});
            }
  
          });

          app.put('/blogs', async (req, res) => {
            const updated = req.body;
    
            const filter = { _id: ObjectId(updated._id) };
    
            let updateDoc = {};
            if(updated.isApproved)
            {
             updated.isApproved = false;
             updateDoc = {
                 $set: {
                     isApproved: false
                 },
             };
            }
    
            else {
                updated.isApproved = true;
                updateDoc = {
                    $set: {
                        isApproved: true
                    },
                };
               }
               const result = await blogCollection.updateOne(filter, updateDoc);
    
               if (result) {
                res.json(updated);
               }
          });

          app.delete('/blogs/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) };
    
            const result = await blogCollection.deleteOne(query);
            res.json(result);
          });
    
          app.post('/blogs', async (req, res) => {
            const newOrder = req.body;
            const result = await blogCollection.insertOne(newOrder);
            res.json(result);
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