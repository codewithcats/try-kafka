const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "order-client",
  brokers: ["broker0:9092", "broker1:9092"],
});

const producer = kafka.producer();

const run = async () => {
  console.log("️connecting to Kafka");
  await producer.connect();
  console.log("✅ connected");
  console.log("try sending the message...");
  await producer.send({
    topic: "order_received",
    messages: [
      {
        value: JSON.stringify({
          order_id: "1234",
          received_at: `${new Date().valueOf()}`,
        }),
      },
    ],
  });
  console.log("✉️ order_received message sent");
};

run().catch(console.error);
