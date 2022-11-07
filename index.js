const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()


const app = express()
app.use(express.json());
app.use(cors())

const port = process.env.PORT || 5000;
// Connect To Database 
