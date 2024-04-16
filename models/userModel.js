const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    photo : {
        type : String,
    },
    password : {
        type : String,
        required : true
    },
    is_admin : {
        type : Number,
    },
    __v : {
        type : Number
    }
});

module.exports = mongoose.model('User',User);