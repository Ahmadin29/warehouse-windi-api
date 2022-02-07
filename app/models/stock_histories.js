const mongoose = require('mongoose')

const stock_histories = new mongoose.Schema({
    amount:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:["requested","accepted","rejected"],
        default:"requested"
    },
    type:{
        type:String,
        enum:["inbound","outbound"] ,
        required:true,
    },
    item:{
        type:Object,
    },
    user:{
        type:Object,
    }
},{
    timestamps:true,
})

module.exports = StockHistories = mongoose.model('stock_histories',stock_histories); 