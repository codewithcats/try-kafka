const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "inventory-client",
  brokers: ["broker0:9092", "broker1:9092"],
});

const consumer = kafka.consumer({ groupId: "order-consumer" });
const producer = kafka.producer();

const run = async () => {
  await Promise.all([consumer.connect(), producer.connect()]);
  console.log("✅ Kafka connected");
  await consumer.subscribe({ topic: "order_received", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const order = JSON.parse(message.value.toString());
      console.log("Received", order);

      await producer.send({
        topic: "order_confirmed",
        messages: [
          {
            value: JSON.stringify({
              order,
            }),
          },
        ],
      });
      console.log("✉️ Kafka:order_confirm message sent");
    },
  });
};

run().catch(console.error);
