export class Runsheet {
   pool;

   constructor(pool) {
      this.pool = pool;
   }

   async getRunsheet(deliveryId) {
      let client;
      try {
         client = await this.pool.connect();
         const query = "SELECT * FROM f_get_runsheet($1)";
         const params = [deliveryId];

         const result = await client.query(query, params);

         if (!Array.isArray(result.rows)) {
            let tempArray = [];
            tempArray.append(result.rows);
            return tempArray;
         }

         return result.rows;
      } catch (err) {
         console.log(err);
      } finally {
         if (client) {
            client.release();
         }
      }
   }
}