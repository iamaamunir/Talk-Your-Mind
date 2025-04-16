export class AppError extends Error {
  constructor(message, statusCode) {
    super(message || "Something went wrong");
    this.statusCode = this.statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
