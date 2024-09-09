import { KafkaConfig } from "../config/kafka.config.js";

export class KafkaBroker {
   static async send(topic, messages) {
      const producer = await KafkaConfig.producer();
      await producer.connect();
      await producer.send({
         topic,
         messages
      });
      await producer.disconnect()
   }
}