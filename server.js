const express = require('express');
const cors = require('cors');
const cassandraClient = require('./cassandra');
const productRoutes = require('./routes/productRoutes')
require('dotenv').config();
const app = express();



app.use(express.json());
app.use(cors())


app.use('/api/products', productRoutes)

const port = process.env.PORT;



cassandraClient.connect()
.then(() => {
    app.listen(port, () => {
        console.log(`Listening on port ${port} 😂`);
    })
})
.catch(err => {
    console.log(`Error connecting to db and starting the server😢`);
})