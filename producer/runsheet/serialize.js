import protobuf from "protobufjs";

export class RunsheetSerialize {
   static async loadProtobuf() {
      try {
         const root = await protobuf.load('runsheet.proto');
         const RunsheetMessage = root.lookupType('Runsheet');
         return RunsheetMessage;
      } catch (err) {
         console.error(err);
         throw err;
      }
   };

   static serialize(Message, runsheet) {
      const errMsg = Message.verify(runsheet);
      if (errMsg) throw new Error(errMsg);
      const message = Message.create({
         runsheetNumber: runsheet.runsheet_number.toString(),
         branch: runsheet.branch,
         runsheetDate: runsheet.runsheet_date.toString(),
         courierZone: runsheet.courier_zone,
         remarksNotice: runsheet.remarks_notice,
         userId: runsheet.user_id,
         connoteNumber: runsheet.connote_number,
         connoteDate: runsheet.connote_date.toString(),
         koliQty: runsheet.koli_qty,
         courierId: runsheet.courier_id,
      });
      const buffer = Message.encode(message).finish();
      return buffer;
   }
}