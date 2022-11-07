const { MongoClient, ServerApiVersion } = require('mongodb');
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

async function run(){
    try{
        app.get('/courses', async(req, res)=> {
            const database = client.db('photographyCourse').collection('courseDetails');
            const query = {};
            const cursor = database.find(query)
            const courses = await cursor.limit(3).toArray();
            const count = await  database.estimatedDocumentCount() 
            res.send({count,courses})
        })
 

    }
    finally{
        console.log("Best Of Luck, Keep Going");
    }

}
run().catch(err=> console.log(err))





app.get('/', (req, res) => {
    res.send(`The Server Is Online`)
})

app.listen(port, () => {
    console.log(
        `Server Running On Port ${port}`);
})
