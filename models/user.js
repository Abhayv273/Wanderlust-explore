import mongoose from "mongoose";
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose"

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
         match: [/^[a-zA-Z]+[0-9]+@gmail\.com$/, "Email must be like abc123@gmail.com"]
    
    }
})
userSchema.plugin(passportLocalMongoose.default);
// module.exports = mongoose("User",userSchema)

const User = mongoose.model("User",userSchema);
export default User;