import protobuf from "protobufjs";

export class EmployeeSerialize {
   static async loadProtobuf() {
      try {
         const root = await protobuf.load('employee.proto');
         const Employee = root.lookupType('Employee');
         return Employee;
      } catch (err) {
         console.error(err);
         throw err;
      }
   };

   static serializeEmployee(EmployeeType, employee) {
      const payload = {
         employee_id: employee.employee_id.toString(),
         employee_name: employee.employee_name
      };

      const errMsg = EmployeeType.verify(payload);
      if (errMsg) throw new Error(errMsg);
      const message = EmployeeType.create(payload);
      const buffer = EmployeeType.encode(message).finish();
      return buffer;
   }

   static serializeEmployees(EmployeeType, employee) {
      const errMsg = EmployeeType.verify(employee);
      if (errMsg) throw new Error(errMsg);
      const message = EmployeeType.create(employee);
      const buffer = EmployeeType.encode(message).finish();
      return buffer;
   }
}