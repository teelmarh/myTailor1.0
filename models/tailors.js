const mongoose = require('mongoose');
const schema = mongoose.Schema;

const tailorSchema = new schema({
    fname:String,
    lname : String ,
    phoneno: String,
    email:String,
    password:String,
})

const tailor = mongoose.model('tailor', tailorSchema);

module.exports =tailor;
