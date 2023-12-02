const { Kafka, Partitioners  } = require('kafkajs')
require('dotenv').config();

const { KAFKA_USERNAME: username, KAFKA_PASSWORD: password } = process.env
const sasl = username && password ? { username, password, mechanism: 'plain' } : null
const ssl = !!sasl



const kafka = new Kafka({
    clientId: "cassandra-project",
    brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],
    sasl,
    ssl,
});


const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
  });
const produceMessage = async (topic, message) => {
    await producer.connect();
    await producer.send({
        topic,
        messages: [
            {
                value: JSON.stringify(message),
            }
        ]
    });
    await producer.disconnect();


};

module.exports = produceMessage;
