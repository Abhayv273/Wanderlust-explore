//es module
class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message); // important
    this.statusCode = statusCode;
    
  }
}
export default ExpressError;


// commonjs
// class ExpressError extends Error{
//     constructor(statusCode,message){
//         super();
//         this.statusCode=statusCode;
//         this.message=message;
//     }
// }
// module.exports=ExpressError;