// message, status code, error code, error

export class HttpException extends Error {
  message: string;
  errorCode: any;
  statusCode: number;
  errors: ErrorCode;

  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    errors: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  PRODUCT_NOT_FOUND = 1004,
  ADDRESS_NOT_FOUND = 1005,
  CART_NOT_FOUND = 1006,
  ORDER_NOT_FOUND = 1006,
  ADDRESS_DOES_NOT_BELONG = 1008,
  UNPROCESABLE_ENTITY = 2001,
  INTERNAL_EXCEPTION = 3001,
  UNAUTHORIZED = 3002,
}
