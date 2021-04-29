import { CustomError } from "./custom-error";

export class DataBaseConnectionError extends CustomError {
  statusCode = 500;
  reason = "Error connection to database";

  constructor(){
    super("Error Database");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DataBaseConnectionError.prototype);
  }

  serializeErrors(){
    return [
      {
        message: this.reason
      }
    ];
  }
}