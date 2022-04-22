const express = require('express');
const cors = require('cors');
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
const res = require('express/lib/response');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//connect with mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rm3yw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

async function run () { 
  try{
    await client.connect();
    const serviceCollection = client.db('sundorimaCar').collection('service');
    // console.log('DB connected')

    //create an api endpoint to load all data and send response as response will be sent upon request
    app.get('/service', async (req, res) => {
        const query = {};
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
    })

    //api endpoint to load single data
    app.get('/service/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const service = await serviceCollection.findOne(query);
        res.send(service)
    });

    //POST
    app.post('/service', async (req, res) => {
        const newService = req.body;
        const result = await serviceCollection.insertOne(newService);
        res.send(result);
    });

    //DELETE
    app.delete('/service/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await serviceCollection.deleteOne(query);
        res.send(result);
    })
  }
  finally{

  }
   
}

run().catch(console.dir);


// app.get('/', (req, res) => {
//     res.send('Sundorima server is running')
// });





//Dynamic port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})