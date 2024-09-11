import { Kafka, Partitioners } from "kafkajs";

const kafka = new Kafka({
   brokers: ["localhost:9092"]
});

const producer = kafka.producer({
   createPartitioner: Partitioners.DefaultPartitioner
});

await producer.connect();

const topicMessages = [
   {
      topic:  'topic-A',
      messages: [ { key: 'keyA1', value: 'key 1 topic A' } ]
   },
   {
      topic: 'topic-B',
      messages: [ { key: 'keyB1', value: 'key 1 topic B' } ]
   },
   {
      topic: 'topic-C',
      messages: [ { key: 'keyC1', value: 'key 1 topic C' } ]
   }
];

await producer.sendBatch({ topicMessages });

await producer.disconnect();