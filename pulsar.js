const Pulsar = require('pulsar-client');
require('dotenv').config()


const connectToPulsar = async () => {
    const serviceUrl = process.env.PULSAR_URL;
    const pulsarToken = process.env.PULSAR_TOKEN;
    const tenantName = process.env.TENANT_NAME;
    const namespace = process.env.NAMESPACE;
    const topicName = process.env.TOPIC_NAME;
    const topic = `persistent://${tenantName}/${namespace}/${topicName}`;
    const auth = new Pulsar.AuthenticationToken({ token: pulsarToken });
    const client = new Pulsar.Client({
        serviceUrl: serviceUrl,
        authentication: auth,
        // tlsTrustCertsFilePath: trustStore,
        operationTimeoutSeconds: 30,
      });


      const producer = await client.createProducer({
        topic: topic,
      });

      producer.send({
        data: Buffer.from("Hello World"),
      });
      console.log("sent message");

      await producer.flush();
      await producer.close();









}

connectToPulsar();

module.exports = connectToPulsar;