const mongoose = require('mongoose');

const schema = mongoose.Schema;

const notifications = new schema({
    sender:{
        type:Object,
    },
    reciever:{
        type:String,
    },
    title:{
        type:String,
    },
    message:{
        type:String,
    },
},{
    timestamps:true,
})

module.exports = Notifications = mongoose.model('notifications',notifications); 