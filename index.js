const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require('cors');

require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


//geniuscarservices database



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zrwofka.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanics');
        const serviceCollection = database.collection('services');
        //get API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //get specific service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //post API
        app.post('/services', async (req, res) => {
            const service = req.body;
            //console.log(service);
            const result = await serviceCollection.insertOne(service);
            //console.log(result);
            res.json(result);
        })

        //post delete API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const removeService = await serviceCollection.deleteOne(query);
            res.json(removeService);
        })

        //post update API
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const newService = req.body;
            // console.log("hit the update", newService, id);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateService = {
                $set: {
                    name: newService.name,
                    description: newService.description,
                    price: newService.price
                },
            };
            //console.log(updateService);
            const result = await serviceCollection.updateOne(filter, updateService, options);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("hitting the server from genius server");
})

app.listen(port, () => {
    console.log("server listening from ", port);
})