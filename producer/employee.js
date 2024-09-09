import { DatabaseConfig } from "./config/database.config.js";
import pg from 'pg';
import { EmployeeSerialize } from "./serialize/employee.serialize.js";
import { KafkaBroker } from "./kafka-broker/index.js";
import path from "path";
import protobuf from "protobufjs";
import { Kafka, Partitioners } from "kafkajs";

const databaseConfig = new DatabaseConfig();
const dbPool = new pg.Pool(databaseConfig.DATABASE_OBJ);
const kafka = new Kafka({
   brokers: ["localhost:9092"]
});

const producer = kafka.producer({
   createPartitioner: Partitioners.DefaultPartitioner
});

await producer.connect();

async function generateToKafka(payload) {   
   await producer.send({
      topic: 'helloworld',
      messages: payload
   });
}

async function getEmployees(employeeId) {
   let client;
   try {
      client = await dbPool.connect();
      const query = "SELECT employee_id as id, employee_name as name, employee_nik as nik FROM tc_employee WHERE employee_id = $1";
      const param = [employeeId];
      const result = await client.query(query, param);
      return result.rows;
   } catch (e) {
      console.log(e);
   } finally {
      if (client) {
         client.release();
      }
   }
}

async function run() {
   try {
      const employees = await getEmployees(424);
      for (const employee of employees) {
         console.log(employee);
         const root = await protobuf.load('employee.proto');
         const employeeMessage = root.lookupType('Employee');
         const errMessg = employeeMessage.verify(employee);
         if (errMessg) throw Error(errMessg);
         
         const message = employeeMessage.create(employee);
         const buffer = employeeMessage.encode(message).finish();
         const kafkaPayload = [
            {
               key: "employee1", value: buffer
            }
         ];
   
         await KafkaBroker.send("helloworld", kafkaPayload);
      }

      return;
   } catch (err) {
      console.log(err);
   }
}

await run();
