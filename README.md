# Live Project

### Kafka Basics Using the Command Line

Create a Kafka topic that will contain order received events, and verify it exists.

```
docker-compose exec broker0 /opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic order_received

docker-compose exec broker0 /opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list
```

Modify the topic created in step 3 by increasing its retention time to three days.

```
docker-compose exec broker0 /opt/bitnami/kafka/bin/kafka-configs.sh --bootstrap-server localhost:9092 --entity-type topics --entity-name order_received --describe

docker-compose exec broker0 /opt/bitnami/kafka/bin/kafka-configs.sh --bootstrap-server localhost:9092 --entity-type topics --entity-name order_received --alter --add-config retention.ms=259200
```

Create additional Kafka topics that use the same configuration as the topic created in step 3.

Create a Kafka topic that will contain order confirmed events, and verify it exists.

```
docker-compose exec broker0 /opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic order_confirmed --config retention.ms=259200
```

Create a Kafka topic that will contain order picked and packed events, and verify it exists.

```
docker-compose exec broker0 /opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic order_packed --config retention.ms=259200
```

Create a Kafka topic that will contain notification events, and verify it exists.

```
docker-compose exec broker0 /opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic notification --config retention.ms=259200
```

Create a Kafka topic that will contain error events, and verify it exists.

```
docker-compose exec broker0 /opt/bitnami/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic error --config retention.ms=259200
```

### Build a Basic Microservice and Kafka Event Publisher

Send message using order service

```
docker-compose up -d --build order
```

Verify it was received by using the appropriate Kafka command-line operation

```
docker-compose exec broker0 /opt/bitnami/kafka/bin/kafka-console-consumer.sh --topic order_received --from-beginning --bootstrap-server localhost:9092
```

##### Learned

- message `value` must be string -- use `JSON.stringify`.
- cannot let docker compose recreate broker containers, the IDs will be changed and
  we will get `No leader` message. If we need to change container configuration, we
  need to remove the container first (`docker compose rm` or `down`).
- **Fastify** with `async/await` needs us to explicitly `return`.
- When start Fastify in container we need to explicitly add "0.0.0.0" as a second
  parameter of funciton `listen`.

### Build an Inventory Consumer That Handles Order Received Events

Treat received events in an idempotent manner, meaning any duplicates that are received must not create any side effects within the system.

```
# Add Kafka config to broker service
- KAFKA_CFG_ENABLE_IDEMPOTENCE=true
```

Create a long-lived subscription to the OrderReceived topic in Kafka.

##### Learned

- Message will come as `Buffer`, we can use `toString()` function to convert it to string.
- Consumer's `groupId` is required when create a consumer.
- It takes few seconds for consumer to join the consumer group.
