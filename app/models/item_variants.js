const mongoose = require('mongoose')

const item_variants = new mongoose.Schema({
    item_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'items',
        required:true,
    },
    sku:{
        type:String,
    },
    name:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        default:'available'
    },
    first_stock:{
        type:Number,
    }
},{
    timestamps:true,
})

module.exports = ItemVariants = mongoose.model('item_variants',item_variants); 