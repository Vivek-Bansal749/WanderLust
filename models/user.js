const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose =
  require("passport-local-mongoose").default ||
  require("passport-local-mongoose");



const userSchema = new Schema({
    email:{
        type:String,
        require:true,
        unique: true,
    },
    // here we dont need to define the schema for username as passportlocalmongoose automatically defines that itself

});
// console.log(typeof passportLocalMongoose);

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);