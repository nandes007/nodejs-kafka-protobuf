import { Kafka, Partitioners } from "kafkajs";
import protobuf from 'protobufjs';

const kafka = new Kafka({
   brokers: ["localhost:9092"]
});

const producer = kafka.producer({
   createPartitioner: Partitioners.DefaultPartitioner
});

await producer.connect();

export async function generateToKafka(payload) {   
   await producer.send({
      topic: 'helloworld',
      messages: payload
   });
}

async function sendMessage(i) {
   try {
      const root = await protobuf.load('user.proto');
      const UserMessage = root.lookupType('User');

      const payload = {
         id: `${i.toString()}`,
         name: "Hello User " + i, 
         age: 30
      };

      const errMessg = UserMessage.verify(payload);
      if (errMessg) throw new Error(errMessg);

      const message = UserMessage.create(payload);
      const buffer = UserMessage.encode(message).finish();
      console.log(buffer);

      const kafkaPayload = [
         {
            key: "user1", value: buffer
         }
      ];

      await generateToKafka(kafkaPayload);
   } catch (e) {
      console.log("Error: " + e);
   }
}

for (let i = 1; i <= 100; i++) {
   await sendMessage(i);
}

await producer.disconnect();

