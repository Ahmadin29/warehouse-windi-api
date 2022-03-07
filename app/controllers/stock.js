const express = require('express');
const stockModel = require('../models/stock_histories');
const variantsModel = require('../models/item_variants');
const stockRoutes = express.Router();

const { sendNotification } = require('./notifications')

const requestStock = async (data)=>{
    const requestStock = {
        amount:data.amount,
        status:"requested",
        type:data.type,
        item:{variant:data.variant,item:data.item},
        user:data.user,
    };

    const storeStock = new stockModel(requestStock);

    await storeStock.save();
}

const changeStatus = async (data)=>{

    const stockRequest = await stockModel.findOne({
        _id:data._id,
        status:'requested',
        type:data.type,
    })

    const variant =  await variantsModel.findOne({
        _id:stockRequest.item.variant._id
    })
    
    const currentStock = variant.stock;

    const queryStock = {
        stock:data.type == 'inbound' ? currentStock + stockRequest.amount : currentStock - stockRequest.amount
    }

    await variantsModel.updateOne({
        _id:stockRequest.item.variant._id
    },queryStock)

    const query = {
        status:data.status,
    };

    await stockModel.updateOne({
        _id:data._id
    },query)
}

stockRoutes.get('/',async(req,res)=>{
    const {_page,_limit,_search} = req.query;

    const limit         = _limit     ? _limit : 10;
    const skip          = _page      ? (_page - 1) * limit : 0;

    try {
        const data = await stockModel.find({
            "item.variant.name":{
                $regex:_search ? _search : '',$options:"i",
            },
            "item.variant.sku":{
                $regex:_search ? _search : '',$options:"i",
            },
            "item.item.name":{
                $regex:_search ? _search : '',$options:"i",
            },
            "status":"requested"
        })
        .skip(skip)
        .limit(limit)
        .sort({_id:-1})

        res.json({
            status:'success',
            message:'Berhasil mendapatkan request stock',
            data:data,
            meta:{
                page:_page      ? _page     : 1,
                limit:_limit    ? _limit    : 10,
                total:data.length,
                skip:skip
            },
            request:req.query
        })
    } catch (error) {
        res.json({
            status:'error',
            message:'Gagal mendapatkan data items, '+error,
        })
    }
})

stockRoutes.post('/request-inbound',async(req,res)=>{
    try {

        const {amount,variant,item} = req.body;

        const data = {
            amount:amount,
            variant:variant,
            item:item,
            user:req.user,
            type:"inbound"
        }

        requestStock(data,res)
        sendNotification({
            user:req.user,
            title:'Permintaan Approve Inbound',
            message:'Hai, Admin Gudang meminta approve inbound untuk penambahan stock produk '+variant.name,
            reciever:"supervisor"
        });

        res.json({
            status:'succcess',
            message:'Berhasil membuat request stock',
        })

    } catch (error) {
        res.status(400).json({
            status:'error',
            message:'Gagal membuat request stock'+error,
        })
    }
})

stockRoutes.post('/accept-inbound',async(req,res)=>{
    try {

        const {_id} = req.body;

        changeStatus({
            status:'accepted',
            type:'inbound',
            _id:_id,

        })
        sendNotification({
            user:req.user,
            title:'Permintaan Terkonfirmasi',
            message:'Hai, Supervisor mengkonfirmasi penambahan stock produk kamu',
            reciever:"admingudang"
        });

        res.json({
            status:'succcess',
            message:'Berhasil menerima request stock',
        })

    } catch (error) {
        res.status(400).json({
            status:'error',
            message:'Gagal menerima request stock'+error,
        })
    }
})

stockRoutes.post('/request-outbound',async(req,res)=>{
    try {

        const {amount,variant,item} = req.body;

        const data = {
            amount:amount,
            variant:variant,
            item:item,
            user:req.user,
            type:"outbound"
        }

        requestStock(data)
        sendNotification({
            user:req.user,
            title:'Permintaan Approve',
            message:'Hai, Admin Gudang meminta approve untuk penambahan stock produk '+variant.name,
            reciever:"supervisor"
        });

        res.json({
            status:'succcess',
            message:'Berhasil membuat request outbound stock',
        })

    } catch (error) {
        res.status(400).json({
            status:'error',
            message:'Gagal membuat request outbound stock'+error,
        })
    }
})

stockRoutes.post('/accept-outbound',async(req,res)=>{
    try {

        const {_id} = req.body;

        changeStatus({
            status:'accepted',
            type:'outbound',
            _id:_id,

        })
        sendNotification({
            user:req.user,
            title:'Permintaan Terkonfirmasi',
            message:'Hai, Supervisor mengkonfirmasi penambahan stock produk kamu',
            reciever:"admingudang"
        });

        res.json({
            status:'succcess',
            message:'Berhasil menerima request outbound stock',
        })

    } catch (error) {
        res.status(400).json({
            status:'error',
            message:'Gagal menerima request outbound stock'+error,
        })
    }
})

stockRoutes.delete('/delete-all',async(req,res)=>{
    try {

        await stockModel.deleteMany({
            amount:{
                $gt:0,
            }
        });

        res.status(400).json({
            status:'succcess',
            message:'Berhasil menghapus semua request stock',
        })

    } catch (error) {
        res.status(400).json({
            status:'error',
            message:'Gagal menghapus request stock'+error,
        })
    }
})

module.exports = {
    requestStock,
    stockRoutes,
}