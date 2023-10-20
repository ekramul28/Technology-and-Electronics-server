const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Technology-and-Electronics
// GekoNRKzninppbct


const uri = "mongodb+srv://Technology-and-Electronics:GekoNRKzninppbct@cluster0.ktxzlkz.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db("productDB").collection("product");
        const cardData = client.db("cardDB").collection("Card");

        app.post('/card', async (req, res) => {
            const product = req.body;
            const result = await cardData.insertOne(product);
            res.send(result);
        });
        app.get('/card', async (req, res) => {
            const cursor = await cardData.find().toArray();
            res.send(cursor);
        });
        app.post('/product', async (req, res) => {
            const product = req.body;
            const result = await database.insertOne(product);
            res.send(result);
        });
        app.get('/product', async (req, res) => {
            const cursor = await database.find().toArray();
            res.send(cursor);
        });
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { branName: id };
            const cursor = await database.find(query).toArray();
            res.send(cursor);
        });
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await database.findOne(query);
            res.send(result)

        });
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const product = req.body;
            const query = { _id: new ObjectId(id) };

            const options = { upsert: true }
            const updatePro = {
                $set: {
                    name: product.name,
                    image: product.image,
                    type: product.type,
                    price: product.price,
                    branName: product.branName,
                    rating: product.rating,
                    description: product.description
                }
            }
            const result = await database.updateOne(query, updatePro, options);
            res.send(result);
        });

        app.delete('/card/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cardData.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running');
});
app.listen(port, () => {
    console.log('this is the port', port);
})