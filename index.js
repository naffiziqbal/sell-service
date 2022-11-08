const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()


const app = express()
app.use(express.json());
app.use(cors())

const port = process.env.PORT || 5000;
// Connect To Database 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.zscbcon.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const database = client.db('photographyService').collection('servicesDetails');
        const reviewCollection = client.db('photographyService').collection('reviews');

        const postCollection = client.db('photographyService').collection("userPost");
        //Get Limited Data
        app.get('/limitServices', async (req, res) => {

            const query = {};
            const cursor = database.find(query)
            const services = await cursor.limit(3).toArray();
            const count = await database.estimatedDocumentCount()
            res.send({ count, services })
        });
        // Get All Data 
        app.get('/services', async (req, res) => {

            const query = {};
            const cursor = database.find(query)
            const services = await cursor.toArray();
            const count = await database.estimatedDocumentCount()
            res.send({ count, services })
        });

        // Get Data Using ID 
        app.get('/services/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const services = await database.findOne(query);
            console.log(services);
            res.send(services)
        })

        // Get Review 
        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review)
        })

        // Get Private Review Only For Logged In User 
        app.get('/userreviews', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = {
                    email: req.query.email
                }
            }
            console.log(query);

            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray();
            res.send(review)
        })

        // POST REVIEW 
        app.post('/services', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            console.log(result)
            res.send(result)
        })

        // Post Sevice 
        app.post('/userservice', async (req, res) => {
            const userPost = req.body;
            const userPosts = await  database.insertOne(userPost);
            res.send(userPosts)
        })

        //  Update A Review 
        app.patch('/userservices/:id', async(req, res)=>{
            const id = req.params.id;
            const updateData = req.body.updateData;
            const query = {_id :ObjectId(id)};
            const updateDoc = {
                $set : {
                    updateData : updateData
                }
            }
            const result = await reviewCollection.updateOne(updateDoc, result);
            res.send(result)
        });

        app.delete('/userreviews/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id : ObjectId(id)}
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })


    }
    finally {
        console.log("Best Of Luck, Keep Going");
    }

}
run().catch(err => console.log(err))





app.get('/', (req, res) => {
    res.send(`The Server Is Online`)
})

app.listen(port, () => {
    console.log(
        `Server Running On Port ${port}`);
})
