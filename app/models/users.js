const mongoose = require('mongoose')

const users = new mongoose.Schema({
    name:{
        type:String,
    },
    username:{
        type:String,
    },
    password:{
        type:String,
    },
    role_id:{
        type:String,
    },
    api_key:{
        type:String,
    }
},{
    timestamps:true,
})

module.exports = User = mongoose.model('users',users); 