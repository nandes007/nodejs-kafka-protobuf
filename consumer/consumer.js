import { Kafka } from "kafkajs";
import protobuf from 'protobufjs';

const kafka = new Kafka({
   "brokers": ["localhost:9092"]
});

const consumer = kafka.consumer({
   groupId: "nodejs"
});

await consumer.subscribe({
   // topic: "helloworld", // for sandbox
   topic: "core_event",
   fromBeginning: true
});

async function consumeData(message) {
   const root = await protobuf.load('user.proto');
   const UserMessage = root.lookupType('User');
   const buffer = Buffer.from(message.value, 'binary');
   const decodedMessage = UserMessage.decode(buffer);
   const userObject = UserMessage.toObject(decodedMessage, {
      longs: String,
      enums: String,
      bytes: String
   });

   console.log("Received message from kafka:", userObject);
}

async function consumeEmployee(message) {
   const root = await protobuf.load('employee.proto');
   const EmployeeMessage = root.lookupType('Employee');
   const buffer = Buffer.from(message.value, 'binary');
   const decodedMessage = EmployeeMessage.decode(buffer);
   const employeeObject = EmployeeMessage.toObject(decodedMessage, {
      longs: String,
      enums: String,
      bytes: String
   });

   console.log("Received message from kafka:", employeeObject);
}

async function consumeRunsheet(message) {
   const root = await protobuf.load('runsheet.proto');
   const RunsheetMessage = root.lookupType('Runsheet');
   const buffer = Buffer.from(message.value, 'binary');
   const decodedMessage = RunsheetMessage.decode(buffer);
   const runsheetObject = RunsheetMessage.toObject(decodedMessage, {
      longs: String,
      enums: String,
      bytes: String,
      defaults: true
   });

   console.log("Received message from kafka:", runsheetObject);
   // console.log('Proto field names:', RunsheetMessage.fields);
}

async function consumeEventStore(message) {
   const root = await protobuf.load('event_store.proto');
   const EventStoreMessage = root.lookupType('EventStore');
   const buffer = Buffer.from(message.value, 'binary');
   const decodedMessage = EventStoreMessage.decode(buffer);
   const eventStoreObject = EventStoreMessage.toObject(decodedMessage, {
      longs: String,
      enums: String,
      bytes: String,
      defaults: true
   });
   
   console.log("Received message from kafka:", eventStoreObject);
}

await consumer.connect();

await consumer.run({
   eachMessage: async (record) => {
      const message = record.message;
      console.log('Raw message value:', message.value);
      // console.info(message.value + " THIS IS VALUE");
      try {
         await consumeEventStore(message);
      } catch (e) {
         console.log(e);
      }
   }
})