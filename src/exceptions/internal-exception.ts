import { HttpException } from "./root";

export class InternalException extends HttpException {
  constructor(errors: any, message: string, errorCode: number) {
    super(message, errorCode, 500, errors);
  }
}
