import "dotenv/config"

export class DatabaseConfig {
   DATABASE_OBJ;
   DATABASE_URL;

   constructor() {
      this.DATABASE_OBJ = {
         user: this.#databaseUsername(),
         host: this.#databaseHost(),
         database: this.#databaseName(),
         password: this.#databasePassword(),
         port: this.#databasePort(),
         max: this.#databaseMaxPool()
      };

      this.DATABASE_URL = `${this.#databaseType()}://${this.#databaseUsername()}:` +
         `${this.#databasePassword()}@${this.#databaseHost()}:` +
         `${this.#databasePort()}/${this.#databaseName()}`;
   }

   #databaseType() {
      const value = process.env.DATABASE_TYPE;
      if ((value === null) || (value === undefined) || (value === '')) {
         throw new Error("Missing env DATABASE_TYPE value");
      }
      return value;
   }

   #databaseUsername() {
      const value = process.env.DATABASE_USERNAME;
      if ((value === null) || (value === undefined) || (value === '')) {
         throw new Error("Missing env DATABASE_USERNAME value");
      }
      return value;
   }

   #databasePassword() {
      const value = process.env.DATABASE_PASSWORD;
      if ((value === null) || (value === undefined) || (value === '')) {
         throw Error("Missing env DATABASE_PASSWORD value");
      }

      return value;
   }

   #databaseHost() {
      const value = process.env.DATABASE_HOST;
      if ((value === null) || (value === undefined) || (value === '')) {
         throw Error("Missing env DATABASE_HOST value");
      }

      return value;
   }

   #databasePort() {
      let value = process.env.DATABASE_PORT;
      if ((value === null) || (value === undefined) || (value === '')) {
         throw Error("Missing env DATABASE_PORT value");
      }

      const parsedValue = parseInt(value);

      if (isNaN(parsedValue)) {
         throw Error("DATABASE_PORT must number value");
      }

      return parsedValue;
   }

   #databaseName() {
      const value = process.env.DATABASE_NAME;
      if ((value === null) || (value === undefined) || (value === '')) {
         throw Error("Missing env DATABASE_NAME value");
      }

      return value;
   }

   #databaseMaxPool() {
      let value = process.env.DATABASE_MAX_POOL;
      if ((value === null) || (value === undefined) || (value === '')) {
         return 20;
      }

      const parsedValue = parseInt(value);

      if (isNaN(parsedValue)) {
         throw Error("DATABASE_MAX_POOL must number value");
      }

      return parsedValue;
   }
}