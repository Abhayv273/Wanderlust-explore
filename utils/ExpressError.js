//es module
class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message); // important
    this.statusCode = statusCode;
    
  }
}
export default ExpressError;
