import { Kafka, Partitioners } from "kafkajs";

export class KafkaConfig {
   static async producer() {
      const kafka = new Kafka({
         clientId: "fake-consumer",
         brokers: ["localhost: 9092"],
      });

      const producer = kafka.producer({
         createPartitioner: Partitioners.DefaultPartitioner
      });

      return producer;
   }
}



