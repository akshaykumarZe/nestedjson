const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'tracking-producer-nestedJSON',
  brokers: ['my-cluster-kafka-bootstrap.kafka.svc:9092'],
  sasl: {
    mechanism: "scram-sha-512",
    username:  "igx4vuorw5ol2t3gmj7u3blnh", // Use env variable for security
    password:  "fmHY1GtFumSgVmYKwPeoeB69Ck1XpwtK",
  }
});

const producer = kafka.producer();
const topic = process.env.KAFKA_TOPIC ;
const key = 'static-key'; // Define key to avoid ReferenceError

function getVehicleTrackingJson() {
  return {
    vehicleId: `VH-${Math.floor(Math.random() * 20) + 1}`,
    model: `Model-${Math.floor(Math.random() * 20)+1}`,
    isActive: Math.random() > 0.5,
    timestamp: new Date().toISOString(),
    location: {
      latitude: (Math.random() * 180 - 90).toFixed(6), // Random latitude (-90 to 90)
      longitude: (Math.random() * 360 - 180).toFixed(6), // Random longitude (-180 to 180)
      speed: (Math.random() * 120).toFixed(2), // Speed in km/h
      heading: Math.floor(Math.random() * 360), // 0-360 degrees
    },
    engineStatus: {
      isRunning: Math.random() > 0.5,
      temperature: (Math.random() * 120).toFixed(2), // Engine temp in °C
      fuelLevel: (Math.random() * 100).toFixed(2), // Fuel percentage
    },
    alerts: [
      { type: "overspeed", active: Math.random() > 0.8 },
      { type: "lowFuel", active: Math.random() > 0.9 },
      { type: "maintenanceDue", active: Math.random() > 0.7 },
    ],
    metadata: {
      owner: `Owner_${Math.floor(Math.random() * 100)}`,
      registrationNumber: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
      manufactureYear: 2000 + Math.floor(Math.random() * 24), // Random year
      insuranceValid: Math.random() > 0.3,
    },
  };
}
  async function sendMessage() {
    await producer.connect();
    console.log('Producer connected');
    
    setInterval(async () => {
      const value = getVehicleTrackingJson();
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