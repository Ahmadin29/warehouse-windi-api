const mongoose = require('mongoose');

const schema = mongoose.Schema;

const push_tokens = new schema({
    token:{
        type:String,
    },
    user_id:{
        type:schema.Types.ObjectId,ref:"users"
    },
},{
    timestamps:true,
})

module.exports = PushTokens = mongoose.model('user_push_tokens',push_tokens); 