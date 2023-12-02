const cassandra = require('cassandra-driver');
require('dotenv').config()
const client = new cassandra.Client({
    cloud: { secureConnectBundle: './secure-connect.zip' },
    credentials: { username: process.env.CASSANDRA_CLIENT_ID, password: process.env.CASSANDRA_CLIENT_SECRET },
    keyspace: process.env.CASSANDRA_KEYSPACE
  },
  
  );


module.exports = client;
