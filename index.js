const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'tracking-producer-nestedJSON',
  brokers: ['my-cluster-kafka-bootstrap.kafka.svc:9092'],
  sasl: {
    mechanism: "scram-sha-512",
    username:  "4b0xm2bbnx2kvyw7l1ixbykmh", // Use env variable for security
    password:  "GMbdA5pjNUNqoiX1BIYxRE4zQob8jZnT",
  }
});

const producer = kafka.producer();
const topic = process.env.KAFKA_TOPIC ;
const key = 'static-key'; // Define key to avoid ReferenceError

function getRandomJson() {
    return {
      id: Math.floor(Math.random() * 1000),
      name: `User_${Math.floor(Math.random() * 100)}`,
      isActive: Math.random() > 0.5,
      timestamp: new Date().toISOString(),
      scores: [Math.random() * 10, Math.random() * 10, Math.random() * 10],
      metadata: {
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0',
        extra: {
          level: Math.floor(Math.random() * 5),
          valid: Math.random() > 0.5
        }
      }
    };
  }

  async function sendMessage() {
    await producer.connect();
    console.log('Producer connected');
    
    setInterval(async () => {
      const value = getRandomJson();
      await producer.send({
        topic,
        messages: [
          { key, value: JSON.stringify(value) }
        ]
      });
      console.log('Message sent:', value);
    }, 3000); // Sending message every 3 seconds
  }
  
  sendMessage().catch(console.error);