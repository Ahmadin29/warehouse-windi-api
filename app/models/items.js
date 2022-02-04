const mongoose = require('mongoose')

const items = new mongoose.Schema({
    name:{
        type:String,
    },
    status:{
        type:String,
        default:"available"
    },
    description:{
        type:String,
    },
    item_variants:[{type:mongoose.Schema.Types.ObjectId,ref:"item_variants"}]
},{
    timestamps:true,
})

module.exports = Item = mongoose.model('items',items); 