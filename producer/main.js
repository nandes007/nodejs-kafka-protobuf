import pg from 'pg';
import { DatabaseConfig } from './config/database.config.js';
import { Runsheet } from './runsheet/runsheet.js';
import { RunsheetSerialize } from './runsheet/serialize.js';
import { KafkaBroker } from './kafka-broker/index.js';

async function main() {
   const deliveryId = 'ff54ed64-ba95-42ad-95a2-ec9b779ada9e';
   const databaseConfig = new DatabaseConfig();
   const dbPool = new pg.Pool(databaseConfig.DATABASE_OBJ);
   const runsheetInstance = new Runsheet(dbPool);
   const runsheets = await runsheetInstance.getRunsheet(deliveryId);
   for (const runsheet of runsheets) {
      console.log(runsheet);
      try {
         const runsheetMessage = await RunsheetSerialize.loadProtobuf();
         const buffer = RunsheetSerialize.serialize(runsheetMessage, runsheet);
         const kafkaPayload = [
            {
               key: "runsheet1",
               value: buffer
            }
         ];

         await KafkaBroker.send("helloworld", kafkaPayload);
         console.info("Successfully send runsheet to broker");
      } catch (err) {
         console.log(err);
      }
   }
}

await main();