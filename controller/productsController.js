const cassandraClient = require('../cassandra');
const { v4: uuidv4 } = require('uuid');
const produceMessage = require('../utils/producer');









const createProduct = async (req, res) => {

  


    try {
        const id = uuidv4();
        const createdAt = new Date();

        const { name, description, price, stock_quantity } = req.body;
        const insertProductQuery = `INSERT INTO products (product_id, name, description, price, stock_quantity, created_at) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = {
            id, name, description, price, stock_quantity, createdAt
        }

        const kafkaValues = {
          id, name, createdAt, price
        }
        const insertProductValues = [id, name, description, price, stock_quantity, createdAt];
        await cassandraClient.execute(insertProductQuery, insertProductValues, { prepare: true }).then(async () => {

          console.log("Product inserted succesfully")
          
          
          
           res.status(200).json(values);

         await produceMessage('products', kafkaValues);


          console.log("Message sent to Kafka")



          // witty
        }).catch(err => {
            console.log("Error inserting product", err)
            return res.status(500).json({ error: "Internal Server Error" })
        }) 
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error"})
        
    }


};
// TODO ALWAYS USE THIS
// const getProducts = async (req, res) => {
//     try {
//         const getProductsQuery = 'SELECT * FROM products';
//         const products = [];

//         const stream = cassandraClient.stream(getProductsQuery, [], { prepare: true });

//         return new Promise((resolve, reject) => {
//             stream
//                 .on('readable', () => {
//                     let row;
//                     while ((row = stream.read())) {
//                         // Process each row
//                         products.push(row);
//                     }
//                 })
//                 .on('end', () => {
//                     res.status(200).json(products);
//                     resolve();
//                 })
//                 .on('error', (err) => {
//                     console.error('Error in streaming:', err);
//                     reject(err);
//                 });
//         });
//     } catch (error) {
//         console.error('Error in getProducts:', error);
//         res.status(500).json({ message: 'Internal Server error' });
//     }
// };























// TODO OK
const getProducts = async (req, res) => {
    try {
      const getProductsQuery = 'SELECT * FROM products';
      const products = [];
  
      await cassandraClient.eachRow(
        getProductsQuery,
        [],
        (n, row) => {
          console.log(row);
          products.push(row);
        },
        (err) => {
          if (err) {
            console.error('Internal Server Error');
            return res.status(500).json({ message: 'Internal Server error' });
          } else {
            console.log('Successfully fetched the products');
            res.status(200).json(products);
          }
        }
      );
    } catch (error) {
      console.error('Error in getProducts:', error);
      res.status(500).json({ message: 'Internal Server error' });
    }
  };

//   TODO good
  const getProduct = async (req, res) => {
try {
    const { id } = req.params;
    const getProductQuery = 'SELECT * FROM products WHERE product_id = ?';
     cassandraClient.eachRow(getProductQuery, [id], (n, row) => {
        console.log(row);
        res.status(200).json(row);
    }, err => {
        if(err) {
            console.log(`Error processing all the rows`);
            return res.status(500).json({ message: 'Internal Server error' });
        } else {
            console.log(`Successfully fetched the product`);
        
        }
    })

    
} catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server error' });
}
    
}



// const getProduct = async (req, res) => {
//     try {
//         const getProductQuery = 'SELECT * FROM products WHERE product_id = ?';
//         const { id } = req.params;
//         const products = [];

//         const stream = cassandraClient.stream(getProductQuery, [id], { prepare: true });

//         return new Promise((resolve, reject) => {
//             stream
//                 .on('readable', () => {
//                     let row;
//                     while ((row = stream.read())) {
//                         // Process each row
//                         products.push(row);
//                     }
//                 })
//                 .on('end', () => {
//                     res.status(200).json(products);
//                     resolve();
//                 })
//                 .on('error', (err) => {
//                     console.error('Error in streaming:', err);
//                     reject(err);
//                 });
//         });
//     } catch (error) {
//         console.error('Error in getProducts:', error);
//         res.status(500).json({ message: 'Internal Server error' });
//     }
// };





  

module.exports = {
    createProduct,
    getProducts,
    getProduct
}


