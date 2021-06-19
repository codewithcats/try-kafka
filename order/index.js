const { Kafka } = require("kafkajs");
const fastify = require("fastify");

const kafka = new Kafka({
  clientId: "order-client",
  brokers: ["broker0:9092", "broker1:9092"],
});
const producer = kafka.producer();

const app = fastify({ logger: true });
app.post("/order/:order_id", async (request, reply) => {
  const orderId = request.params.order_id;
  console.log("received order with id:", orderId);
  await producer.send({
    topic: "order_received",
    messages: [
      {
        value: JSON.stringify({
          order_id: orderId,
          received_at: `${new Date().valueOf()}`,
        }),
      },
    ],
  });
  console.log("✉️ Kafka:order_received message sent");
  reply.code(200);
  return "";
});

const run = async () => {
  await producer.connect();
  console.log("✅ Kafka connected");
  await app.listen(80, "0.0.0.0");
  console.log("🧸 Order service started");
};

run().catch(console.error);
