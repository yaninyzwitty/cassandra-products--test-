const { Kafka, logLevel  } = require('kafkajs')
require('dotenv').config();

const { KAFKA_USERNAME: username, KAFKA_PASSWORD: password } = process.env
const sasl = username && password ? { username, password, mechanism: 'plain' } : null
const ssl = !!sasl



const kafka = new Kafka({
    clientId: "cassandra-project",
    brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],
    sasl,
    ssl,
    logLevel: logLevel.ERROR
});


module.exports = kafka;

