const exprees = require("express");
const app = exprees();

const { MongoClient } = require('mongodb');

require('dotenv').config()

const cors = require("cors")

const port = process.env.PORT || 5000;

// middeleware

app.use(cors());
app.use(exprees.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.to6vq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {

     try {
          await client.connect();
          console.log("data base connect successfuly ")

          const database = client.db("modeul-66");
          const productsCllection = database.collection("products");
          const orderCollection = database.collection("order")



          // GET API 

          app.get('/products', async (req, res) => {
               const cursor = productsCllection.find({});
               const count = await cursor.count();


               console.log(req.query)

               const page = req.query.page;
               const size = parseInt(req.query.size);

               let products;

               if (page) {
                    products = await cursor.skip(page * size).limit(size).toArray();
               }
               else {
                    products = await cursor.toArray();
               }





               res.send(
                    {
                         count,
                         products
                    })
          })


          // POST api to get kyes \


          app.post('/products/bykeys', async (req, res) => {
               // console.log(req.body)
               const keys = req.body
               const query = { key: { $in: keys } }
               const products = await productsCllection.find(query).toArray()
               res.json(products)
          })


          // Add orders 
          app.post('/orders', async (req, res) => {
               const order = req.body
               const result = await orderCollection.insertOne(order)
               res.json(result)
          })


     }
     finally {
          // await client.close();
     }


}

run().catch(console.dir)


app.get('/', (req, res) => {
     res.send("hi this is Ema-jon")
})

app.listen(port, () => {
     console.log("hi ", port)
})