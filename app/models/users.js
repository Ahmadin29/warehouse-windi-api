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
    },
    user_push_tokens:[{type:mongoose.Schema.Types.ObjectId,ref:'user_push_tokens'}]
},{
    timestamps:true,
})

module.exports = User = mongoose.model('users',users); 