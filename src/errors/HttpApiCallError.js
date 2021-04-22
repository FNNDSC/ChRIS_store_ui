export default class HttpApiCallError extends Error {
  constructor(error) {
    super(error);
    this.message = error.message;
    this.statusCode = error.statusCode;
    this.stack = new Error(error.message).stack;
    this.name = "HttpApiCallError";
  }
}