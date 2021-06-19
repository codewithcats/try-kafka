const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "inventory-client",
  brokers: ["broker0:9092", "broker1:9092"],
});

const consumer = kafka.consumer({ groupId: "order-consumer" });

const run = async () => {
  await consumer.connect();
  console.log("✅ Kafka connected");
  await consumer.subscribe({ topic: "order_received", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log("Received", message.value.toString());
    },
  });
};

run().catch(console.error);
