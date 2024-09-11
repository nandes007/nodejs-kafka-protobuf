import { Kafka } from "kafkajs";

const topics = [
   'topic-A',
   'topic-B',
   'topic-C'
];
const kafka = new Kafka({
   "brokers": ["localhost:9092"]
});

const consumer = kafka.consumer({
   groupId: "nodejs"
});

await consumer.connect();

// subsribe to multiple topic at once
await consumer.subscribe({ topics, fromBeginning: true });
// await consumer.subscribe({ topics: [ 'topic-A', 'topic-B', 'topic-C' ], fromBeginning: true });

/**
 * * Note:: Alternatively, can use subscribe to any topic that matches a regular expression:
 */
// await consumer.subscribe({ topics: [/topic-(eu|us)-.*/i] })

await consumer.run({
   eachMessage: async ({topic, message}) => {
      console.log({
         key: message.key.toString(),
         value: message.value.toString(),
         headers: message.headers,
         topic
      })
   }
});