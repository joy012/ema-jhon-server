const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ukskk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const port = 3200;

app.use(cors());
app.use(bodyParser.json());





client.connect(err => {
    const productsCollection = client.db("emaJhonStore").collection("products");
    const ordersCollection = client.db("emaJhonStore").collection("orders");

    app.post('/addProduct', (req, res) => {
        productsCollection.insertOne(req.body)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    app.get('/products', (req, res) => {
        productsCollection.find()
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray( (err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/productByKey', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: { $in: productKeys }})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        ordersCollection.insertOne(req.body)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

});




app.listen(process.env.PORT || port);